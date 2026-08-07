"""
Course Catalog API — Public Read-Only Service
============================================
Endpoints:
  GET  /api/v1/courses               — List all PUBLISHED courses (filterable)
  GET  /api/v1/courses/{id}          — Full course detail (instructor, curriculum, reviews)
  GET  /api/v1/courses/{id}/reviews  — Paginated reviews for a course
  POST /api/v1/courses/{id}/enroll   — Enroll (requires auth)
  POST /api/v1/courses/{id}/wishlist — Toggle wishlist (requires auth)
"""
import json
import time
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func

from app.db.database import get_db
from app.models.models import (
    Course, CourseSection, CourseLecture, CourseReview,
    Instructor, CourseRegistration, User,
    CourseStatusEnum,
)
from app.schemas.schemas import (
    CourseDetailOut, CourseListItemOut, ReviewOut,
    InstructorOut, SectionOut, LectureOut,
)
from app.api.deps import get_current_user

router = APIRouter()

# ─── Simple in-process TTL cache ─────────────────────────────────────────────
_cache: Dict[str, Any] = {}
_CACHE_TTL = 300  # 5 minutes

def _cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < _CACHE_TTL:
        return entry["val"]
    return None

def _cache_set(key: str, val):
    _cache[key] = {"val": val, "ts": time.time()}

def _cache_invalidate_prefix(prefix: str):
    for k in list(_cache.keys()):
        if k.startswith(prefix):
            del _cache[k]

# ─── Helpers ──────────────────────────────────────────────────────────────────

def _parse_json_list(value: Optional[str]) -> List[str]:
    """Parse a JSON-encoded string list stored in the DB, or split by newline."""
    if not value:
        return []
    try:
        parsed = json.loads(value)
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
    except (json.JSONDecodeError, ValueError):
        pass
    return [line.strip() for line in value.split("\n") if line.strip()]

async def _compute_rating(db: AsyncSession, course_id: str):
    """Return (average_rating, total_reviews) for a course."""
    res = await db.execute(
        select(func.avg(CourseReview.rating), func.count(CourseReview.id))
        .where(CourseReview.course_id == course_id)
    )
    row = res.one()
    avg = round(float(row[0]), 1) if row[0] else None
    count = row[1] or 0
    return avg, count

def _build_section_out(section: CourseSection) -> dict:
    return {
        "id": section.id,
        "title": section.title,
        "order_index": section.order_index,
        "lectures": [
            {
                "id": lec.id,
                "title": lec.title,
                "duration_minutes": lec.duration_minutes or 0,
                "is_preview": lec.is_preview,
                "order_index": lec.order_index,
            }
            for lec in section.lectures
        ],
    }

def _build_review_out(review: CourseReview) -> dict:
    return {
        "id": review.id,
        "rating": review.rating,
        "comment": review.comment,
        "reviewer_name": review.user.full_name if review.user else "Anonymous",
        "created_at": review.created_at,
    }

# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("", response_model=List[CourseListItemOut])
async def list_published_courses(
    category: Optional[str] = Query(None, description="Filter by category"),
    level: Optional[str] = Query(None, description="Filter by level"),
    search: Optional[str] = Query(None, description="Search in title/subtitle"),
    db: AsyncSession = Depends(get_db),
):
    """
    Public endpoint — returns all PUBLISHED courses.
    Supports optional filtering by category, level, and keyword search.
    Results cached in-process for 5 minutes.
    """
    cache_key = f"course_list:{category}:{level}:{search}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    query = (
        select(Course)
        .options(selectinload(Course.instructor))
        .where(Course.status == CourseStatusEnum.PUBLISHED)
    )

    if category:
        query = query.where(Course.category == category)
    if level:
        query = query.where(Course.level == level)

    result = await db.execute(query)
    courses = result.scalars().all()

    # Apply search filter in Python (avoids dialect-specific LIKE issues)
    if search:
        q = search.lower()
        courses = [
            c for c in courses
            if q in (c.name or "").lower()
            or q in (c.subtitle or "").lower()
            or q in (c.short_description or "").lower()
        ]

    # Build response with computed ratings
    output = []
    for c in courses:
        avg, count = await _compute_rating(db, c.id)
        output.append({
            "id": c.id,
            "name": c.name,
            "subtitle": c.subtitle,
            "short_description": c.short_description or c.description,
            "category": c.category,
            "level": c.level.value if c.level else None,
            "language": c.language,
            "thumbnail_url": c.thumbnail_url,
            "price": c.price,
            "discounted_price": c.discounted_price,
            "total_lectures": c.total_lectures or 0,
            "total_duration_minutes": c.total_duration_minutes or 0,
            "average_rating": avg,
            "total_reviews": count,
            "instructor_name": c.instructor.name if c.instructor else None,
            "last_updated": c.last_updated,
        })

    _cache_set(cache_key, output)
    return output


@router.get("/{course_id}", response_model=CourseDetailOut)
async def get_course_detail(
    course_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Public endpoint — returns full detail for a single PUBLISHED course.
    Includes instructor info, full curriculum, and up to 5 recent reviews.
    Response cached in-process for 5 minutes.
    """
    cache_key = f"course_detail:{course_id}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    result = await db.execute(
        select(Course)
        .options(
            selectinload(Course.instructor),
            selectinload(Course.sections).selectinload(CourseSection.lectures),
        )
        .where(Course.id == course_id)
        .where(Course.status == CourseStatusEnum.PUBLISHED)
    )
    course = result.scalars().first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or not yet published.",
        )

    # Ratings
    avg, total_reviews = await _compute_rating(db, course.id)

    # Recent reviews (up to 5)
    rev_result = await db.execute(
        select(CourseReview)
        .options(selectinload(CourseReview.user))
        .where(CourseReview.course_id == course.id)
        .order_by(CourseReview.created_at.desc())
        .limit(5)
    )
    recent_reviews = rev_result.scalars().all()

    # Build instructor output
    instructor_out = None
    if course.instructor:
        instructor_out = {
            "id": course.instructor.id,
            "name": course.instructor.name,
            "bio": course.instructor.bio,
            "profile_image": course.instructor.profile_image,
            "total_courses": course.instructor.total_courses or 0,
            "average_rating": course.instructor.average_rating,
        }

    output = {
        "id": course.id,
        "name": course.name,
        "subtitle": course.subtitle,
        "description": course.description,
        "short_description": course.short_description,
        "category": course.category,
        "level": course.level.value if course.level else None,
        "language": course.language,
        "thumbnail_url": course.thumbnail_url,
        "intro_video_url": course.intro_video_url,
        "price": course.price,
        "discounted_price": course.discounted_price,
        "total_lectures": course.total_lectures or 0,
        "total_duration_minutes": course.total_duration_minutes or 0,
        "what_you_learn": _parse_json_list(course.what_you_learn),
        "requirements": _parse_json_list(course.requirements),
        "target_audience": _parse_json_list(course.target_audience),
        "last_updated": course.last_updated,
        "instructor": instructor_out,
        "sections": [_build_section_out(s) for s in course.sections],
        "average_rating": avg,
        "total_reviews": total_reviews,
        "recent_reviews": [_build_review_out(r) for r in recent_reviews],
    }

    _cache_set(cache_key, output)
    return output


@router.get("/{course_id}/reviews")
async def get_course_reviews(
    course_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=50, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    """
    Public endpoint — paginated reviews for a PUBLISHED course.
    """
    # Verify course exists and is published
    course_res = await db.execute(
        select(Course.id)
        .where(Course.id == course_id)
        .where(Course.status == CourseStatusEnum.PUBLISHED)
    )
    if not course_res.scalars().first():
        raise HTTPException(status_code=404, detail="Course not found or not published.")

    # Total count
    count_res = await db.execute(
        select(func.count(CourseReview.id)).where(CourseReview.course_id == course_id)
    )
    total = count_res.scalar() or 0

    # Paginated reviews
    offset = (page - 1) * page_size
    rev_res = await db.execute(
        select(CourseReview)
        .options(selectinload(CourseReview.user))
        .where(CourseReview.course_id == course_id)
        .order_by(CourseReview.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    reviews = rev_res.scalars().all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
        "reviews": [_build_review_out(r) for r in reviews],
    }


@router.post("/{course_id}/enroll")
async def enroll_in_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Auth-required endpoint — enroll the authenticated user in a PUBLISHED course.
    Idempotent: returns success even if already enrolled.
    """
    # Verify course is published
    course_res = await db.execute(
        select(Course.id, Course.name)
        .where(Course.id == course_id)
        .where(Course.status == CourseStatusEnum.PUBLISHED)
    )
    row = course_res.first()
    if not row:
        raise HTTPException(status_code=404, detail="Course not found or not published.")

    # Check if already enrolled
    reg_res = await db.execute(
        select(CourseRegistration)
        .where(CourseRegistration.user_id == current_user.id)
        .where(CourseRegistration.course_id == course_id)
    )
    existing = reg_res.scalars().first()

    if existing:
        return {
            "status": "already_enrolled",
            "message": "You are already enrolled in this course.",
            "registration_id": existing.id,
        }

    registration = CourseRegistration(
        user_id=current_user.id,
        course_id=course_id,
        status="In Progress",
        completion_percentage=0,
    )
    db.add(registration)
    await db.commit()
    await db.refresh(registration)

    # Invalidate list cache so enrollment counts update
    _cache_invalidate_prefix("course_list:")

    return {
        "status": "enrolled",
        "message": "Successfully enrolled!",
        "registration_id": registration.id,
    }


@router.post("/{course_id}/wishlist")
async def toggle_wishlist(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Auth-required endpoint — toggle wishlist for the authenticated user.
    Uses recommended_courses JSON field on the User model.
    """
    # Verify course exists and is published
    course_res = await db.execute(
        select(Course.id).where(Course.id == course_id).where(Course.status == CourseStatusEnum.PUBLISHED)
    )
    if not course_res.scalars().first():
        raise HTTPException(status_code=404, detail="Course not found or not published.")

    # Parse existing wishlist
    try:
        wishlist: list = json.loads(current_user.recommended_courses or "[]")
        if not isinstance(wishlist, list):
            wishlist = []
    except (json.JSONDecodeError, ValueError):
        wishlist = []

    if course_id in wishlist:
        wishlist.remove(course_id)
        action = "removed"
    else:
        wishlist.append(course_id)
        action = "added"

    # Persist
    user_res = await db.execute(select(User).where(User.id == current_user.id))
    user_obj = user_res.scalars().first()
    if user_obj:
        user_obj.recommended_courses = json.dumps(wishlist)
        await db.commit()

    return {
        "status": "success",
        "action": action,
        "wishlist_count": len(wishlist),
    }
