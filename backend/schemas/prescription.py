"""Pydantic schemas for prescriptions and medications."""
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class MedicationBase(BaseModel):
    """Base schema for medication."""
    name: str
    dosage: str
    frequency_description: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None

class MedicationResponse(MedicationBase):
    """Schema for medication response."""
    id: int
    prescription_id: int
    
    class Config:
        from_attributes = True

class PrescriptionCreate(BaseModel):
    """Schema for creating a prescription."""
    patient_id: int
    description: Optional[str] = None
    medications: List[MedicationBase]

class PrescriptionResponse(BaseModel):
    """Schema for prescription response."""
    id: int
    patient_id: int
    doctor_id: int
    description: Optional[str]
    created_at: datetime
    medications: List[MedicationResponse]
    
    # Related data
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    
    class Config:
        from_attributes = True
