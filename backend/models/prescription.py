"""Prescription model for medication prescriptions."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Prescription(Base):
    """Prescription model created by doctors for patients."""
    __tablename__ = "prescriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    description = Column(Text, nullable=True)  # General notes about the prescription
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("Doctor", back_populates="prescriptions")
    medications = relationship("Medication", back_populates="prescription", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Prescription(id={self.id}, patient_id={self.patient_id}, doctor_id={self.doctor_id})>"
