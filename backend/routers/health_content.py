"""Router for health tips and FAQ with pagination and caching."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from functools import lru_cache

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
@lru_cache(maxsize=128)
def get_health_tips(
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve health tips, optionally filtered by category, with pagination.
    Categories: bewegung, ernährung, prävention, gesundheit
    """
    query = db.query(HealthTip)
    if category:
        try:
            cat_enum = HealthTipCategory(category)
            query = query.filter(HealthTip.category == cat_enum)
        except ValueError:
            pass  # Invalid category, ignore filter
    query = query.order_by(HealthTip.created_at.desc()).offset(skip).limit(limit)
    return query.all()

@router.get("/faq", response_model=List[FAQResponse])
@lru_cache(maxsize=128)
def get_faqs(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=200, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
):
    """
    Retrieve FAQs with pagination support.
    """
    query = db.query(FAQ).order_by(FAQ.created_at.desc()).offset(skip).limit(limit)
    return query.all()
