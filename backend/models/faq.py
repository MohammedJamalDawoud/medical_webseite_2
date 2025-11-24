"""FAQ model for frequently asked questions."""
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base

class FAQ(Base):
    """Frequently Asked Questions model."""
    __tablename__ = "faqs"
    
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<FAQ(id={self.id}, question={self.question[:50]})>"
