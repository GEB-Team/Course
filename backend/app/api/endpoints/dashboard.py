from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any, Dict, List
from datetime import datetime

from app.db.database import get_db
from app.models.models import User, CourseRegistration, Certificate, Payment, Notification, ActivityLog, TrainingSession, Announcement
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=Dict[str, Any])
@router.get("/summary", response_model=Dict[str, Any])
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # For demonstration of the UI and immediate smoke testing, we return structured 
    # data that matches the expected DB schema for the dashboard.
    
    return {
        "user": {
            "full_name": current_user.full_name,
            "employee_id": current_user.employee_id or "EMP-001",
            "department": current_user.department or "Engineering",
            "designation": current_user.designation or "Senior Developer",
            "experience": f"{current_user.experience_years or 5} Years",
            "qualification": current_user.qualification or "B.Tech",
            "email": current_user.email,
            "phone_number": current_user.phone_number or "+1 234 567 890",
            "profile_completion": 85,
            "verification_status": current_user.verification_status,
            "last_login": datetime.utcnow().isoformat(),
            "registration_date": current_user.created_at.isoformat()
        },
        "stats": {
            "registered_courses": 4,
            "completed_courses": 2,
            "pending_courses": 2,
            "certificates_earned": 3,
            "training_sessions": 1,
            "pending_notifications": 5
        },
        "course_progress": [
            {"id": "1", "name": "Advanced React Patterns", "completion_percentage": 75, "status": "In Progress", "estimated_completion_date": "2026-08-15T00:00:00Z"},
            {"id": "2", "name": "Government Cybersecurity Basics", "completion_percentage": 30, "status": "In Progress", "estimated_completion_date": "2026-09-01T00:00:00Z"}
        ],
        "ai_recommended_courses": [
            {"id": "3", "name": "Cloud Infrastructure for ERP", "reason": "Based on your recent search for scalable systems", "difficulty_level": "Intermediate", "estimated_duration": "4 Weeks"},
            {"id": "4", "name": "Leadership in Engineering", "reason": "Suggested for career growth to management", "difficulty_level": "Advanced", "estimated_duration": "6 Weeks"}
        ],
        "upcoming_training": [
            {"id": "1", "name": "Q3 Compliance Training", "trainer": "John Doe", "date": "2026-08-10T09:00:00Z", "time": "09:00 AM - 11:00 AM", "venue": "Virtual Room A"}
        ],
        "certificates": [
            {"id": "1", "name": "React Developer Certification", "issue_date": "2025-12-01T00:00:00Z", "certificate_number": "CERT-2025-001"},
            {"id": "2", "name": "Backend FastAPI Basics", "issue_date": "2026-01-15T00:00:00Z", "certificate_number": "CERT-2026-042"}
        ],
        "payments": {
            "pending": 150,
            "completed": 450,
            "history": [
                {"id": "1", "amount": 150, "status": "Pending", "description": "Course Fee: Cloud Infrastructure", "created_at": "2026-07-20T00:00:00Z"},
                {"id": "2", "amount": 450, "status": "Completed", "description": "Certification Exam Fee", "created_at": "2026-06-10T00:00:00Z"}
            ]
        },
        "recent_activities": [
            {"id": "1", "action": "Logged into the portal", "created_at": "2026-07-31T09:00:00Z"},
            {"id": "2", "action": "Completed module 'Hooks in React'", "created_at": "2026-07-30T14:30:00Z"},
            {"id": "3", "action": "Uploaded verification document", "created_at": "2026-07-29T10:15:00Z"}
        ],
        "notifications": [
            {"id": "1", "message": "Your Experience Certificate has been approved.", "is_read": False, "created_at": "2026-07-31T08:00:00Z"},
            {"id": "2", "message": "Leadership Training starts tomorrow.", "is_read": False, "created_at": "2026-07-30T09:00:00Z"}
        ],
        "announcements": [
            {"id": "1", "title": "New Policy on Remote Work updated.", "type": "Policy Update", "created_at": "2026-07-28T00:00:00Z"},
            {"id": "2", "title": "Scheduled Maintenance this weekend.", "type": "System Notification", "created_at": "2026-07-29T00:00:00Z"}
        ],
        "ai_insights": [
            {"title": "Recommended Leadership Training", "description": "Based on your 5 years of experience, transitioning to a team lead role is highly suggested."},
            {"title": "Skill Gap Analysis", "description": "You have completed frontend courses but lack backend integration skills. Consider the Advanced API course."}
        ],
        "charts": {
            "course_completion": [
                {"name": "Jan", "completed": 0},
                {"name": "Feb", "completed": 1},
                {"name": "Mar", "completed": 0},
                {"name": "Apr", "completed": 2},
                {"name": "May", "completed": 1},
                {"name": "Jun", "completed": 3}
            ],
            "training_attendance": [
                {"name": "Attended", "value": 8},
                {"name": "Missed", "value": 2}
            ]
        }
    }
