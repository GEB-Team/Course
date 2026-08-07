from fastapi import APIRouter
from app.api.endpoints import auth, onboarding, dashboard, admin, course_catalog

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

# Course Detail Module — Public Read-Only (no auth required to view)
api_router.include_router(course_catalog.router, prefix="/v1/courses", tags=["course-catalog"])
