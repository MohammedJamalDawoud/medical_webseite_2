"""Router for prescriptions and medications."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.prescription import Prescription
from models.medication import Medication
from models.patient import Patient
from models.doctor import Doctor
from models.user import User
from schemas.prescription import PrescriptionCreate, PrescriptionResponse
from auth.utils import get_current_user, get_current_patient, get_current_doctor
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/prescriptions", tags=["Prescriptions"])

@router.get("", response_model=List[PrescriptionResponse])
def list_prescriptions(
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    List all prescriptions for the current patient.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    prescriptions = db.query(Prescription).filter(Prescription.patient_id == patient.id).all()
    
    result = []
    for prescription in prescriptions:
        result.append({
            **prescription.__dict__,
            "medications": prescription.medications,
            "patient_name": current_user.name,
            "doctor_name": prescription.doctor.user.name
        })
    
    return result

@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def get_prescription(
    prescription_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Get a specific prescription with medications.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    prescription = db.query(Prescription).filter(
        Prescription.id == prescription_id,
        Prescription.patient_id == patient.id
    ).first()
    
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    return {
        **prescription.__dict__,
        "medications": prescription.medications,
        "patient_name": current_user.name,
        "doctor_name": prescription.doctor.user.name
    }

@router.post("/patients/{patient_id}", response_model=PrescriptionResponse, status_code=201)
def create_prescription(
    patient_id: int,
    prescription_data: PrescriptionCreate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    """
    Create a new prescription for a patient (doctor only).
    """
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Create prescription
    prescription = Prescription(
        patient_id=patient_id,
        doctor_id=doctor.id,
        description=prescription_data.description
    )
    db.add(prescription)
    db.flush()
    
    # Add medications
    for med_data in prescription_data.medications:
        medication = Medication(
            prescription_id=prescription.id,
            **med_data.dict()
        )
        db.add(medication)
    
    db.commit()
    db.refresh(prescription)
    
    return {
        **prescription.__dict__,
        "medications": prescription.medications,
        "patient_name": patient.user.name,
        "doctor_name": current_user.name
    }
