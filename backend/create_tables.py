import asyncio
from app.db.database import engine, Base
# Ensure all models are imported before creating tables
from app.models.models import User, RefreshToken, LoginHistory

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully")

if __name__ == "__main__":
    asyncio.run(create_tables())
