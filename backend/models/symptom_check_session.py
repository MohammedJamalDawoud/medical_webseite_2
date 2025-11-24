"""Symptom check session model for educational symptom checker."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class SymptomSeverity(str, enum.Enum):
    """Symptom severity levels."""
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"

class SymptomCheckSession(Base):
    """
    Symptom checker session model.
    IMPORTANT: This is for educational purposes only and does NOT provide medical diagnoses.
    """
    __tablename__ = "symptom_check_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)  # Optional, can be anonymous
    symptoms_category = Column(String, nullable=False)  # e.g., "Kopf", "Bauch", "Fieber"
    severity = Column(SQLEnum(SymptomSeverity), nullable=False)
    duration = Column(String, nullable=False)  # e.g., "2 Tage", "4 Stunden"
    result_message = Column(Text, nullable=False)  # Educational guidance (not a diagnosis)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    patient = relationship("Patient", back_populates="symptom_checks")
    
    def __repr__(self):
        return f"<SymptomCheckSession(id={self.id}, category={self.symptoms_category}, severity={self.severity})>"
