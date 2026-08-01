import asyncio
from sqlalchemy.future import select
from app.db.database import AsyncSessionLocal
from app.models.models import User, RoleEnum
from app.core.security import get_password_hash

async def seed_admin():
    async with AsyncSessionLocal() as db:
        # Check if admin already exists
        result = await db.execute(select(User).where(User.email == "admin@geb.gov"))
        admin = result.scalars().first()
        
        if admin:
            print("Admin user already exists.")
            return

        print("Creating admin user...")
        new_admin = User(
            role=RoleEnum.ADMIN,
            full_name="Super Administrator",
            email="admin@geb.gov",
            password_hash=get_password_hash("Admin@123")
        )
        db.add(new_admin)
        await db.commit()
        print("Admin user created successfully. Email: admin@geb.gov, Password: Admin@123")

if __name__ == "__main__":
    asyncio.run(seed_admin())
