"""Patient model extending User."""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    """Patient model with medical information."""
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    medical_notes = Column(String, nullable=True)  # Optional non-sensitive medical info
    
    # Relationships
    user = relationship("User", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    prescriptions = relationship("Prescription", back_populates="patient")
    reports = relationship("Report", back_populates="patient")
    lab_results = relationship("LabResult", back_populates="patient")
    symptom_checks = relationship("SymptomCheckSession", back_populates="patient")
    
    def __repr__(self):
        return f"<Patient(id={self.id}, user_id={self.user_id})>"
