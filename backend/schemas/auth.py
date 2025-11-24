"""Pydantic schemas for authentication endpoints."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    """Schema for patient registration."""
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None

class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str

class Token(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Schema for token payload data."""
    email: Optional[str] = None

class UserResponse(BaseModel):
    """Schema for user information response."""
    id: int
    email: str
    name: str
    phone: Optional[str]
    date_of_birth: Optional[datetime]
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None

class ChangePassword(BaseModel):
    """Schema for changing password."""
    old_password: str
    new_password: str = Field(..., min_length=6)
