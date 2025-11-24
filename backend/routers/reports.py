"""Router for medical reports."""
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from database import get_db
from models.report import Report
from models.patient import Patient
from models.doctor import Doctor
from models.user import User
from schemas.report import ReportCreate, ReportResponse
from auth.utils import get_current_user, get_current_patient, get_current_doctor
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/reports", tags=["Reports"])

def generate_report_pdf(report: Report, patient_name: str, doctor_name: str) -> bytes:
    """Generate a simple PDF from report data."""
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # Title
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, f"Arztbericht: {report.title}")
    
    # Metadata
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Patient: {patient_name}")
    p.drawString(50, height - 100, f"Arzt: {doctor_name}")
    p.drawString(50, height - 120, f"Datum: {report.created_at.strftime('%d.%m.%Y')}")
    
    # Content
    p.setFont("Helvetica", 11)
    y = height - 160
    for line in report.content.split('\n'):
        if y < 50:
            p.showPage()
            y = height - 50
        p.drawString(50, y, line[:90])  # Truncate long lines
        y -= 15
    
    p.save()
    buffer.seek(0)
    return buffer.getvalue()

@router.get("", response_model=List[ReportResponse])
def list_reports(
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    List all reports for the current patient.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    reports = db.query(Report).filter(Report.patient_id == patient.id).all()
    
    result = []
    for report in reports:
        result.append({
            **report.__dict__,
            "patient_name": current_user.name,
            "doctor_name": report.doctor.user.name
        })
    
    return result

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Get a specific report.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.patient_id == patient.id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return {
        **report.__dict__,
        "patient_name": current_user.name,
        "doctor_name": report.doctor.user.name
    }

@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    """
    Download a report as PDF.
    """
    patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.patient_id == patient.id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Generate PDF
    pdf_data = generate_report_pdf(report, current_user.name, report.doctor.user.name)
    
    return Response(
        content=pdf_data,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{report_id}.pdf"}
    )

@router.post("/patients/{patient_id}", response_model=ReportResponse, status_code=201)
def create_report(
    patient_id: int,
    report_data: ReportCreate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    """
    Create a report for a patient (doctor only).
    """
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    report = Report(
        patient_id=patient_id,
        doctor_id=doctor.id,
        title=report_data.title,
        content=report_data.content
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return {
        **report.__dict__,
        "patient_name": patient.user.name,
        "doctor_name": current_user.name
    }
