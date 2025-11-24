"""Doctor model extending User."""
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Doctor(Base):
    """Doctor model with professional information."""
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    specialization = Column(String, nullable=False)  # e.g., Kardiologie, Allgemeinmedizin
    city = Column(String, nullable=False)
    clinic_address = Column(String, nullable=True)
    description = Column(Text, nullable=True)  # Professional bio
    availability_notes = Column(Text, nullable=True)  # e.g., "Mo-Fr 9-17 Uhr"
    
    # Relationships
    user = relationship("User", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id")
    prescriptions = relationship("Prescription", back_populates="doctor")
    reports = relationship("Report", back_populates="doctor")
    lab_results = relationship("LabResult", back_populates="doctor")
    
    def __repr__(self):
        return f"<Doctor(id={self.id}, specialization={self.specialization}, city={self.city})>"
