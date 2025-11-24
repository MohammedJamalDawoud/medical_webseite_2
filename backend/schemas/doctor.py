"""Pydantic schemas for doctor-related endpoints."""
from pydantic import BaseModel
from typing import Optional

class DoctorBase(BaseModel):
    """Base schema for doctor information."""
    specialization: str
    city: str
    clinic_address: Optional[str] = None
    description: Optional[str] = None
    availability_notes: Optional[str] = None

class DoctorResponse(DoctorBase):
    """Schema for doctor response with user info."""
    id: int
    user_id: int
    name: str
    email: str
    phone: Optional[str]
    
    class Config:
        from_attributes = True
