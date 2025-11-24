"""Application configuration loaded from environment variables."""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings."""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    
    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "CHANGE_ME_DEMO_SECRET_KEY")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    
    # Application
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    API_PREFIX: str = "/api"
    
settings = Settings()
