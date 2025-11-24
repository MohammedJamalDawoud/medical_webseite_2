"""Medication intake model for tracking adherence."""
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class IntakeStatus(str, enum.Enum):
    """Medication intake status."""
    TAKEN = "taken"
    MISSED = "missed"

class MedicationIntake(Base):
    """Medication intake record for adherence tracking."""
    __tablename__ = "medication_intakes"
    
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    planned_datetime = Column(DateTime, nullable=False)  # When the dose was planned
    status = Column(SQLEnum(IntakeStatus), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)  # When marked
    
    # Relationships
    medication = relationship("Medication", back_populates="intakes")
    
    def __repr__(self):
        return f"<MedicationIntake(id={self.id}, medication_id={self.medication_id}, status={self.status})>"
