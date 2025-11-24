"""Router for educational symptom checker."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from models.symptom_check_session import SymptomCheckSession, SymptomSeverity
from models.patient import Patient
from models.user import User
from auth.utils import get_current_user
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/symptom-checker", tags=["Symptom Checker"])

class SymptomCheckRequest(BaseModel):
    """Schema for symptom check request."""
    symptoms_category: str  # e.g., "Kopf", "Bauch", "Fieber", "Husten"
    severity: str  # "mild", "moderate", "severe"
    duration: str  # e.g., "2 Tage", "4 Stunden"

class SymptomCheckResponse(BaseModel):
    """Schema for symptom check response."""
    result_message: str
    disclaimer: str

def analyze_symptoms(category: str, severity: SymptomSeverity, duration: str) -> str:
    """
    Simple rule-based symptom analysis.
    IMPORTANT: This is for educational purposes only and does NOT provide medical diagnoses.
    """
    # Base disclaimer
    base_msg = ""
    
    if severity == SymptomSeverity.SEVERE:
        base_msg = ("Ihre Symptome deuten auf eine höhere Dringlichkeit hin. "
                   "Bitte vereinbaren Sie zeitnah einen Arzttermin oder suchen Sie bei "
                   "starken Schmerzen oder Atemnot sofort ärztliche Hilfe auf.")
    elif severity == SymptomSeverity.MODERATE:
        if "tag" in duration.lower() or "woche" in duration.lower():
            base_msg = ("Ihre Symptome bestehen bereits seit einiger Zeit. "
                       "Es wird empfohlen, in den nächsten Tagen einen Arzttermin zu vereinbaren.")
        else:
            base_msg = ("Beobachten Sie Ihre Symptome weiter. Bei Verschlechterung oder "
                       "anhaltenden Beschwerden sollten Sie einen Arzt konsultieren.")
    else:  # MILD
        base_msg = ("Niedrige Dringlichkeit – beobachten Sie Ihre Symptome. "
                   "Bei Verschlechterung oder wenn die Beschwerden anhalten, wenden Sie sich "
                   "bitte an einen Arzt.")
    
    # Add category-specific guidance
    if "fieber" in category.lower():
        base_msg += " Bei hohem Fieber über 39°C oder anhaltendem Fieber sollten Sie ärztlichen Rat einholen."
    elif "atemnot" in category.lower() or "brust" in category.lower():
        base_msg += " Bei Atembeschwerden oder Brustschmerzen suchen Sie bitte umgehend medizinische Hilfe."
    
    return base_msg

@router.post("", response_model=SymptomCheckResponse)
def check_symptoms(
    request: SymptomCheckRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Educational symptom checker.
    
    DISCLAIMER: This tool does NOT provide medical diagnoses and does NOT replace a doctor visit.
    """
    # Validate severity
    try:
        severity = SymptomSeverity(request.severity)
    except ValueError:
        severity = SymptomSeverity.MILD
    
    # Analyze symptoms (simple rule-based)
    result_message = analyze_symptoms(request.symptoms_category, severity, request.duration)
    
    # Save session (optional patient_id if user is authenticated)
    patient_id = None
    if current_user and current_user.role.value == "PATIENT":
        patient = db.query(Patient).filter(Patient.user_id == current_user.id).first()
        if patient:
            patient_id = patient.id
    
    session = SymptomCheckSession(
        patient_id=patient_id,
        symptoms_category=request.symptoms_category,
        severity=severity,
        duration=request.duration,
        result_message=result_message
    )
    db.add(session)
    db.commit()
    
    disclaimer = (
        "WICHTIG: Dieses Tool ersetzt keinen Arztbesuch und stellt keine medizinische Diagnose. "
        "Bei Beschwerden wenden Sie sich bitte an eine Ärztin oder einen Arzt. "
        "Bei akuten Notfällen wählen Sie den Notruf 112."
    )
    
    return {
        "result_message": result_message,
        "disclaimer": disclaimer
    }
