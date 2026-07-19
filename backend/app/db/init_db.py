import asyncio
from sqlalchemy import text
from app.db.database import engine, Base, AsyncSessionLocal
import app.models.models as models
from app.models.models import User, RoleEnum, Course
from app.core.security import get_password_hash

async def init_and_migrate_db():
    # 1. Create all missing tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # 2. Check for SQLite missing columns on users table
        try:
            res = await conn.execute(text("PRAGMA table_info(users)"))
            existing_cols = {row[1] for row in res.fetchall()}
            
            new_cols = {
                "employee_id": "VARCHAR(50)",
                "employee_category": "VARCHAR(50)",
                "qualification": "VARCHAR(150)",
                "department": "VARCHAR(100)",
                "designation": "VARCHAR(100)",
                "verification_status": "VARCHAR(50) DEFAULT 'Pending'",
                "verification_confidence": "FLOAT",
                "recommended_courses": "TEXT",
                "gender": "VARCHAR(20)",
                "date_of_birth": "VARCHAR(30)",
                "nationality": "VARCHAR(50)",
                "blood_group": "VARCHAR(10)",
                "alternate_phone": "VARCHAR(30)",
                "residential_address": "TEXT",
                "emergency_contact_name": "VARCHAR(150)",
                "emergency_contact_phone": "VARCHAR(50)",
                "office_name": "VARCHAR(200)",
                "office_address": "TEXT",
                "reporting_officer": "VARCHAR(150)",
                "office_email": "VARCHAR(150)",
                "employee_status": "VARCHAR(50)",
                "registration_number": "VARCHAR(50)",
                "registration_category": "VARCHAR(100)",
                "registration_date": "VARCHAR(30)",
                "registration_expiry": "VARCHAR(30)",
                "verification_date": "VARCHAR(30)",
                "verification_officer": "VARCHAR(150)",
                "registration_status": "VARCHAR(50) DEFAULT 'Approved'",
                "joining_date": "VARCHAR(30)",
                "profile_completion_percentage": "INTEGER DEFAULT 85",
                "language_preference": "VARCHAR(30) DEFAULT 'English (US)'",
                "two_factor_enabled": "BOOLEAN DEFAULT 1",
                "email_notifications": "BOOLEAN DEFAULT 1",
                "sms_notifications": "BOOLEAN DEFAULT 0",
                "privacy_contact_masked": "BOOLEAN DEFAULT 0"
            }
            
            for col_name, col_type in new_cols.items():
                if col_name not in existing_cols:
                    await conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                    print(f"Added column {col_name} to users table.")
        except Exception as e:
            print(f"Migration check warning: {e}")

    # 3. Seed default Admin if missing
    async with AsyncSessionLocal() as db:
        from sqlalchemy.future import select
        admin_res = await db.execute(select(User).where(User.email == "admin@geb.gov"))
        admin = admin_res.scalars().first()
        if not admin:
            admin = User(
                role=RoleEnum.ADMIN,
                full_name="Super Administrator",
                email="admin@geb.gov",
                password_hash=get_password_hash("Admin@123"),
                is_active=True,
                department="Department of Personnel & Cadre Training",
                designation="Chief Systems Administrator",
                employee_id="GEB-ADM-001"
            )
            db.add(admin)
            await db.commit()
            print("Default admin created: admin@geb.gov / Admin@123")

        # 4. Seed standard Courses if missing
        course_res = await db.execute(select(Course))
        if not course_res.scalars().first():
            c1 = Course(name="Executive Leadership & Public Governance", description="Strategic decision-making for senior government officials.", difficulty_level="Advanced", estimated_duration="4 Weeks")
            c2 = Course(name="Public Administration Law & Regulatory Compliance", description="Government compliance rules, RTI, and legal frameworks.", difficulty_level="Intermediate", estimated_duration="3 Weeks")
            c3 = Course(name="Government Project & Budget Management", description="Capital project budgeting and GFR 2026 guidelines.", difficulty_level="Advanced", estimated_duration="6 Weeks")
            c4 = Course(name="Cybersecurity & Data Privacy for Civil Servants", description="Securing digital public services, records, and networks.", difficulty_level="Beginner", estimated_duration="2 Weeks")
            db.add_all([c1, c2, c3, c4])
            await db.commit()
            print("Default government courses seeded.")
