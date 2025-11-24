"""Lab result model for laboratory test results."""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from database import Base

class LabResult(Base):
    """Laboratory test result model."""
    __tablename__ = "lab_results"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)  # Optional
    test_name = Column(String, nullable=False)  # e.g., "Blutzucker", "Cholesterin"
    result_value = Column(String, nullable=False)  # e.g., "95"
    unit = Column(String, nullable=True)  # e.g., "mg/dL"
    normal_range = Column(String, nullable=True)  # e.g., "70-100 mg/dL"
    date = Column(Date, nullable=False)
    file_path = Column(String, nullable=True)  # Optional file attachment
    
    # Relationships
    patient = relationship("Patient", back_populates="lab_results")
    doctor = relationship("Doctor", back_populates="lab_results")
    
    def __repr__(self):
        return f"<LabResult(id={self.id}, test_name={self.test_name}, patient_id={self.patient_id})>"
