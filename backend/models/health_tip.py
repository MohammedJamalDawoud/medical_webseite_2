"""Health tip model for health and fitness content."""
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum as SQLEnum
from datetime import datetime
import enum
from database import Base

class HealthTipCategory(str, enum.Enum):
    """Health tip category."""
    BEWEGUNG = "bewegung"  # Movement & Sport
    ERNAEHRUNG = "ernährung"  # Nutrition
    PRAEVENTION = "prävention"  # Prevention
    GESUNDHEIT = "gesundheit"  # General health (for telemedicine section)

class HealthTip(Base):
    """Health tip model for various health categories."""
    __tablename__ = "health_tips"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(SQLEnum(HealthTipCategory), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<HealthTip(id={self.id}, title={self.title}, category={self.category})>"
