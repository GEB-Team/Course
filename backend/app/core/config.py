from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GEB Authentication API"
    # Postgres configuration
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "geb_db"

    # JWT 
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7" # Should be random in prod
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google OAuth
    GOOGLE_CLIENT_ID: str = "placeholder-client-id.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET: str = "placeholder-client-secret"

    @property
    def sqlalchemy_database_uri(self) -> str:
        return "sqlite:///./geb.db"
    
    @property
    def sqlalchemy_database_uri_async(self) -> str:
        return "sqlite+aiosqlite:///./geb.db"

    class Config:
        env_file = ".env"

settings = Settings()
