"""Router for appointment management."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import get_db
from models.appointment import Appointment, AppointmentStatus, AppointmentType
from models.user import User, UserRole
from models.patient import Patient
from models.doctor import Doctor
from schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentResponse
from auth.utils import get_current_user, get_current_patient, get_current_doctor
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/appointments", tags=["Appointments"])

@router.post("", response_model=AppointmentResponse, status_code=201)
def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Create a new appointment request (patient only).
    """
    # Get patient
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=400, detail="Patient profile not found")
    
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == appointment_data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Validate appointment type
    try:
        app_type = AppointmentType(appointment_data.type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid appointment type")
    
    # Create appointment
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=appointment_data.doctor_id,
        date=appointment_data.date,
        time=appointment_data.time,
        type=app_type,
        status=AppointmentStatus.REQUESTED,
        notes=appointment_data.notes
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    # Build response
    return {
        **appointment.__dict__,
        "patient_name": current_user.name,
        "doctor_name": doctor.user.name,
        "doctor_specialization": doctor.specialization
    }

@router.get("", response_model=List[AppointmentResponse])
def list_appointments(
    upcoming: Optional[bool] = Query(None, description="Filter upcoming (true) or past (false) appointments"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List appointments for the current user.
    Patients see their own appointments. Doctors see their patients' appointments.
    """
    from sqlalchemy.orm import joinedload
    
    if current_user.role == UserRole.PATIENT:
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        query = db.query(Appointment).filter(Appointment.patient_id == patient.id)
    else:  # DOCTOR
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        query = db.query(Appointment).filter(Appointment.doctor_id == doctor.id)
    
    # Filter by upcoming/past
    if upcoming is not None:
        today = date.today()
        if upcoming:
            query = query.filter(Appointment.date >= today)
        else:
            query = query.filter(Appointment.date < today)
    
    # Add eager loading to prevent N+1 queries
    query = query.options(
        joinedload(Appointment.patient).joinedload(Patient.user),
        joinedload(Appointment.doctor).joinedload(Doctor.user)
    )
    
    appointments = query.order_by(Appointment.date.desc(), Appointment.time.desc()).all()
    
    # Build responses with related data (now optimized)
    result = []
    for apt in appointments:
        result.append({
            **apt.__dict__,
            "patient_name": apt.patient.user.name,
            "doctor_name": apt.doctor.user.name,
            "doctor_specialization": apt.doctor.specialization
        })
    
    return result

@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get details of a specific appointment.
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Authorization check
    if current_user.role == UserRole.PATIENT:
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if appointment.patient_id != patient.id:
            raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == UserRole.DOCTOR:
        doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
        if appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        **appointment.__dict__,
        "patient_name": appointment.patient.user.name,
        "doctor_name": appointment.doctor.user.name,
        "doctor_specialization": appointment.doctor.specialization
    }

@router.patch("/{appointment_id}/cancel", response_model=AppointmentResponse)
def cancel_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Cancel an appointment (patient only).
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.patient_id == patient.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if appointment.status == AppointmentStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Appointment already cancelled")
    
    appointment.status = AppointmentStatus.CANCELLED
    db.commit()
    db.refresh(appointment)
    
    return {
        **appointment.__dict__,
        "patient_name": current_user.name,
        "doctor_name": appointment.doctor.user.name,
        "doctor_specialization": appointment.doctor.specialization
    }

@router.patch("/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    appointment_id: int,
    status_update: AppointmentUpdate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    """
    Update appointment status (doctor only).
    """
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.doctor_id == doctor.id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Validate status
    try:
        new_status = AppointmentStatus(status_update.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    appointment.status = new_status
    db.commit()
    db.refresh(appointment)
    
    return {
        **appointment.__dict__,
        "patient_name": appointment.patient.user.name,
        "doctor_name": current_user.name,
        "doctor_specialization": doctor.specialization
    }
