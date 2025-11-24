from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Dict, Any
from database import get_db
from models import Doctor, HealthTip, FAQ, User
from auth.auth import get_current_user

router = APIRouter(
    prefix="/search",
    tags=["search"]
)

@router.get("/", response_model=Dict[str, List[Any]])
def global_search(
    q: str = Query(..., min_length=3),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Global search across Doctors, Health Tips, and FAQs.
    """
    results = {
        "doctors": [],
        "health_tips": [],
        "faqs": []
    }

    # Search Doctors
    doctors = db.query(Doctor).filter(
        or_(
            Doctor.name.ilike(f"%{q}%"),
            Doctor.specialty.ilike(f"%{q}%")
        )
    ).limit(5).all()
    results["doctors"] = doctors

    # Search Health Tips
    tips = db.query(HealthTip).filter(
        or_(
            HealthTip.title.ilike(f"%{q}%"),
            HealthTip.content.ilike(f"%{q}%")
        )
    ).limit(5).all()
    results["health_tips"] = tips

    # Search FAQs
    faqs = db.query(FAQ).filter(
        or_(
            FAQ.question.ilike(f"%{q}%"),
            FAQ.answer.ilike(f"%{q}%")
        )
    ).limit(5).all()
    results["faqs"] = faqs

    return results
