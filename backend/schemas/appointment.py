"""Pydantic schemas for appointment-related endpoints."""
from pydantic import BaseModel
from typing import Optional
from datetime import date, time, datetime

class AppointmentCreate(BaseModel):
    """Schema for creating an appointment."""
    doctor_id: int
    date: date
    time: time
    type: str  # "video", "chat", or "phone"
    notes: Optional[str] = None

class AppointmentUpdate(BaseModel):
    """Schema for updating appointment status."""
    status: str  # "confirmed", "cancelled", "completed"

class AppointmentResponse(BaseModel):
    """Schema for appointment response."""
    id: int
    patient_id: int
    doctor_id: int
    date: date
    time: time
    type: str
    status: str
    notes: Optional[str]
    created_at: datetime
    
    # Include related data
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_specialization: Optional[str] = None
    
    class Config:
        from_attributes = True
