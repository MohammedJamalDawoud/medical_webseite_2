"""Router for lab results."""
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from database import get_db
from models.lab_result import LabResult
from models.patient import Patient
from models.doctor import Doctor
from models.user import User
from schemas.report import LabResultCreate, LabResultResponse
from auth.utils import get_current_user, get_current_patient, get_current_doctor
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/lab-results", tags=["Lab Results"])

def generate_lab_result_pdf(result: LabResult, patient_name: str) -> bytes:
    """Generate a simple PDF from lab result data."""
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, f"Laborergebnis: {result.test_name}")
    
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Patient: {patient_name}")
    p.drawString(50, height - 100, f"Datum: {result.date.strftime('%d.%m.%Y')}")
    p.drawString(50, height - 140, f"Test: {result.test_name}")
    p.drawString(50, height - 160, f"Wert: {result.result_value} {result.unit or ''}")
    if result.normal_range:
        p.drawString(50, height - 180, f"Normalbereich: {result.normal_range}")
    
    p.save()
    buffer.seek(0)
    return buffer.getvalue()

@router.get("", response_model=List[LabResultResponse])
def list_lab_results(
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    List all lab results for the current patient.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    results = db.query(LabResult).filter(LabResult.patient_id == patient.id).all()
    
    response = []
    for result in results:
        response.append({
            **result.__dict__,
            "patient_name": current_user.name,
            "doctor_name": result.doctor.user.name if result.doctor else None
        })
    
    return response

@router.get("/{result_id}", response_model=LabResultResponse)
def get_lab_result(
    result_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Get a specific lab result.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    result = db.query(LabResult).filter(
        LabResult.id == result_id,
        LabResult.patient_id == patient.id
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Lab result not found")
    
    return {
        **result.__dict__,
        "patient_name": current_user.name,
        "doctor_name": result.doctor.user.name if result.doctor else None
    }

@router.get("/{result_id}/download")
def download_lab_result(
    result_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Download a lab result as PDF.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    result = db.query(LabResult).filter(
        LabResult.id == result_id,
        LabResult.patient_id == patient.id
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Lab result not found")
    
    pdf_data = generate_lab_result_pdf(result, current_user.name)
    
    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=lab_result_{result_id}.pdf"}
    )

@router.post("/patients/{patient_id}", response_model=LabResultResponse, status_code=201)
def create_lab_result(
    patient_id: int,
    result_data: LabResultCreate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    """
    Create a lab result for a patient (doctor only).
    """
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    result = LabResult(
        patient_id=patient_id,
        doctor_id=doctor.id,
        test_name=result_data.test_name,
        result_value=result_data.result_value,
        unit=result_data.unit,
        normal_range=result_data.normal_range,
        date=result_data.date
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    
    return {
        **result.__dict__,
        "patient_name": patient.user.name,
        "doctor_name": current_user.name
    }
