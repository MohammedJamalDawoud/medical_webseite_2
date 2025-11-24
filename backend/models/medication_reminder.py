"""Medication reminder model for scheduled reminders."""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class MedicationReminder(Base):
    """Medication reminder for specific times of day."""
    __tablename__ = "medication_reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    reminder_time = Column(String, nullable=False)  # e.g., "08:00", "14:00", "20:00"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    medication = relationship("Medication", back_populates="reminders")
    
    def __repr__(self):
        return f"<MedicationReminder(id={self.id}, medication_id={self.medication_id}, time={self.reminder_time})>"
