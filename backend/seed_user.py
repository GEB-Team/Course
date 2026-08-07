"""
Seed a sample employee user for testing the GEB portal.
Usage:  python seed_user.py
"""
import asyncio
from sqlalchemy.future import select
from app.db.database import AsyncSessionLocal
from app.models.models import User, RoleEnum
from app.core.security import get_password_hash


async def seed_user():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == "employee@geb.gov"))
        existing = result.scalars().first()

        if existing:
            print("Sample employee user already exists.")
            print("  Email   : employee@geb.gov")
            print("  Password: Employee@123")
            return

        print("Creating sample employee user...")
        new_user = User(
            role=RoleEnum.EMPLOYEE,
            full_name="John Employee",
            email="employee@geb.gov",
            password_hash=get_password_hash("Employee@123"),
            verification_status="Verified",
            designation="Senior Officer",
        )
        db.add(new_user)
        await db.commit()
        print("✅ Employee user created successfully!")
        print("  Email   : employee@geb.gov")
        print("  Password: Employee@123")


if __name__ == "__main__":
    asyncio.run(seed_user())
