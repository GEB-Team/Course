import asyncio
from app.db.database import engine, Base
# Ensure ALL models are imported before creating tables so SQLAlchemy knows about them
from app.models.models import (
    User, RefreshToken, LoginHistory, EmployeeDocument,
    Course, CourseSection, CourseLecture, CourseReview,
    Instructor, CourseRegistration,
    TrainingSession, Certificate, Payment, Notification,
    ActivityLog, Announcement,
)

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully (including Course Detail module tables)")

if __name__ == "__main__":
    asyncio.run(create_tables())
