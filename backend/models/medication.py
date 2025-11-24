"""Medication model for individual medications within prescriptions."""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from database import Base

class Medication(Base):
    """Medication model within a prescription."""
    __tablename__ = "medications"
    
    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "Aspirin 100mg"
    dosage = Column(String, nullable=False)  # e.g., "1 Tablette"
    frequency_description = Column(String, nullable=False)  # e.g., "3x täglich"
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)  # Additional instructions
    
    # Relationships
    prescription = relationship("Prescription", back_populates="medications")
    reminders = relationship("MedicationReminder", back_populates="medication", cascade="all, delete-orphan")
    intakes = relationship("MedicationIntake", back_populates="medication", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Medication(id={self.id}, name={self.name}, prescription_id={self.prescription_id})>"
