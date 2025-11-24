"""Pydantic schemas for reports and lab results."""
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ReportCreate(BaseModel):
    """Schema for creating a report."""
    patient_id: int
    title: str
    content: str

class ReportResponse(BaseModel):
    """Schema for report response."""
    id: int
    patient_id: int
    doctor_id: int
    title: str
    content: str
    file_path: Optional[str]
    created_at: datetime
    
    # Related data
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class LabResultCreate(BaseModel):
    """Schema for creating a lab result."""
    patient_id: int
    test_name: str
    result_value: str
    unit: Optional[str] = None
    normal_range: Optional[str] = None
    date: date

class LabResultResponse(BaseModel):
    """Schema for lab result response."""
    id: int
    patient_id: int
    doctor_id: Optional[int]
    test_name: str
    result_value: str
    unit: Optional[str]
    normal_range: Optional[str]
    date: date
    file_path: Optional[str]
    
    # Related data
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    
    class Config:
        from_attributes = True
