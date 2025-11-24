"""Router for doctor search and information."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.doctor import Doctor
from models.user import User
from schemas.doctor import DoctorResponse
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/doctors", tags=["Doctors"])

@router.get("", response_model=List[DoctorResponse])
def search_doctors(
    name: Optional[str] = Query(None, description="Search by doctor name"),
    specialization: Optional[str] = Query(None, description="Filter by specialization"),
    city: Optional[str] = Query(None, description="Filter by city"),
    db: Session = Depends(get_db)
):
    """
    Search and filter doctors by name, specialization, and city.
    """
    query = db.query(Doctor).join(User, Doctor.user_id == User.id)
    
    if name:
        query = query.filter(User.name.ilike(f"%{name}%"))
    
    if specialization:
        query = query.filter(Doctor.specialization.ilike(f"%{specialization}%"))
    
    if city:
        query = query.filter(Doctor.city.ilike(f"%{city}%"))
    
    doctors = query.all()
    
    # Build response with user information
    result = []
    for doctor in doctors:
        result.append({
            "id": doctor.id,
            "user_id": doctor.user_id,
            "name": doctor.user.name,
            "email": doctor.user.email,
            "phone": doctor.user.phone,
            "specialization": doctor.specialization,
            "city": doctor.city,
            "clinic_address": doctor.clinic_address,
            "description": doctor.description,
            "availability_notes": doctor.availability_notes,
        })
    
    return result

@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific doctor.
    """
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return {
        "id": doctor.id,
        "user_id": doctor.user_id,
        "name": doctor.user.name,
        "email": doctor.user.email,
        "phone": doctor.user.phone,
        "specialization": doctor.specialization,
        "city": doctor.city,
        "clinic_address": doctor.clinic_address,
        "description": doctor.description,
        "availability_notes": doctor.availability_notes,
    }
