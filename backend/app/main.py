from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.db.init_db import init_and_migrate_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Run schema migrations and seed admin
    await init_and_migrate_db()
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
