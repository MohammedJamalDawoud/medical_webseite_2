from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class NotificationType(str, enum.Enum):
    SYSTEM = "SYSTEM"
    APPOINTMENT = "APPOINTMENT"
    PRESCRIPTION = "PRESCRIPTION"
    LAB_RESULT = "LAB_RESULT"
    MESSAGE = "MESSAGE"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(Enum(NotificationType), default=NotificationType.SYSTEM)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    link = Column(String, nullable=True)  # Optional link to redirect user

    user = relationship("User", back_populates="notifications")
