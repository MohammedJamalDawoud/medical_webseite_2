"""Router for health tips and FAQ."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database import get_db
from models.health_tip import HealthTip, HealthTipCategory
from models.faq import FAQ
from config import settings

router = APIRouter(prefix=f"{settings.API_PREFIX}/content", tags=["Health Content"])

class HealthTipResponse(BaseModel):
    """Schema for health tip response."""
    id: int
    title: str
    content: str
    category: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class FAQResponse(BaseModel):
    """Schema for FAQ response."""
    id: int
    question: str
    answer: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/health-tips", response_model=List[HealthTipResponse])
def get_health_tips(
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """
    Get health tips, optionally filtered by category.
    Categories: bewegung, ernährung, prävention, gesundheit
    """
    query = db.query(HealthTip)
    
    if category:
        try:
            cat_enum = HealthTipCategory(category)
            query = query.filter(HealthTip.category == cat_enum)
        except ValueError:
            pass  # Invalid category, return all
    
    tips = query.order_by(HealthTip.created_at.desc()).all()
    return tips

@router.get("/faq", response_model=List[FAQResponse])
def get_faqs(db: Session = Depends(get_db)):
    """
    Get all FAQs.
    """
    faqs = db.query(FAQ).order_by(FAQ.created_at.desc()).all()
    return faqs
