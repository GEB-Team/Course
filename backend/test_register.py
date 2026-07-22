import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

async def test_register():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/auth/register", json={
            "full_name": "Atchaya Murugesan",
            "username": "atchaya",
            "email": "tchayaa919@gmail.com",
            "phone_number": "7901837653",
            "password": "password123",
            "confirm_password": "password123"
        })
        print(response.status_code)
        print(response.json())

if __name__ == "__main__":
    asyncio.run(test_register())
