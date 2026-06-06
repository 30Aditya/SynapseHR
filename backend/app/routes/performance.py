from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from datetime import date

from app.dependencies import get_db

from app.models.employee import Employee
from app.models.performance import PerformanceReview

from app.schemas.performance import (
    PerformanceCreate
)

from app.auth.roles import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/performance",
    tags=["Performance Management"]
)


@router.post("/review/{employee_id}")
def create_review(
    employee_id: int,
    review: PerformanceCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    if review.rating < 1 or review.rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    performance_review = PerformanceReview(
        employee_id=employee.id,
        rating=review.rating,
        feedback=review.feedback,
        review_date=date.today(),
        reviewed_by=user["sub"]
    )

    db.add(performance_review)

    db.commit()

    db.refresh(performance_review)

    return performance_review


@router.get("/my-reviews")
def my_reviews(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    employee = (
        db.query(Employee)
        .filter(
            Employee.email == user["sub"]
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    reviews = (
        db.query(PerformanceReview)
        .filter(
            PerformanceReview.employee_id == employee.id
        )
        .all()
    )

    return reviews


@router.get("/all")
def all_reviews(
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    return db.query(
        PerformanceReview
    ).all()