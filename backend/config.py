from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()


class Settings(BaseSettings):
    # Base settings
    APP_NAME: str = "FastAPI Template"
    API_PREFIX: str = "/api"
    DEBUG: bool = True
    APP_BASE_URL: str = os.getenv("APP_BASE_URL", "http://localhost:9000")

    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-for-development-only")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Auth0 settings
    AUTH0_DOMAIN: str = os.getenv("AUTH0_DOMAIN", "")
    AUTH0_CLIENT_ID: str = os.getenv("AUTH0_CLIENT_ID", "")
    AUTH0_CLIENT_SECRET: str = os.getenv("AUTH0_CLIENT_SECRET", "")
    AUTH0_AUDIENCE: str = os.getenv("AUTH0_AUDIENCE", "")
    AUTH0_CALLBACK_URL: str = os.getenv("AUTH0_CALLBACK_URL", "http://localhost:8000/auth/callback")
    AUTH0_SECRET: str = os.getenv("AUTH0_SECRET", "")
    AUTH0_SCOPE: str = os.getenv("AUTH0_SCOPE", "openid profile email")

    # Frontend callback URL
    FRONTEND_CALLBACK_URL: str = os.getenv("FRONTEND_CALLBACK_URL", "http://localhost:3000/auth/callback")
    
    # Auth0 Management API settings
    AUTH0_MGMT_API_AUDIENCE: str = os.getenv("AUTH0_MGMT_API_AUDIENCE", f"https://{AUTH0_DOMAIN}/api/v2/")
    AUTH0_MGMT_CLIENT_ID: str = os.getenv("AUTH0_MGMT_CLIENT_ID", AUTH0_CLIENT_ID)
    AUTH0_MGMT_CLIENT_SECRET: str = os.getenv("AUTH0_MGMT_CLIENT_SECRET", AUTH0_CLIENT_SECRET)

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Allow extra fields in environment variables


settings = Settings() 