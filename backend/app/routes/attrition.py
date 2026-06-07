from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.leave_request import LeaveRequest
from app.models.performance import PerformanceReview

from app.auth.roles import require_role

router = APIRouter(
    prefix="/attrition",
    tags=["AI Attrition"]
)


@router.get("/all")
def attrition_analysis(
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    results = []

    employees = db.query(Employee).all()

    for employee in employees:

        attendance_count = (
            db.query(Attendance)
            .filter(
                Attendance.employee_id
                == employee.id
            )
            .count()
        )

        leave_count = (
            db.query(LeaveRequest)
            .filter(
                LeaveRequest.employee_id
                == employee.id,
                LeaveRequest.status
                == "Approved"
            )
            .count()
        )

        latest_review = (
            db.query(PerformanceReview)
            .filter(
                PerformanceReview.employee_id
                == employee.id
            )
            .order_by(
                PerformanceReview.review_date.desc()
            )
            .first()
        )

        rating = (
            latest_review.rating
            if latest_review
            else 3
        )

        risk_score = 0

        if rating <= 2:
            risk_score += 40

        if leave_count > 5:
            risk_score += 30

        if attendance_count < 10:
            risk_score += 30

        if risk_score >= 60:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        results.append({
            "employee_id": employee.id,
            "employee_name":
                employee.first_name +
                " " +
                employee.last_name,
            "department":
                employee.department,
            "attendance_count":
                attendance_count,
            "approved_leaves":
                leave_count,
            "performance_rating":
                rating,
            "risk_score":
                risk_score,
            "risk_level":
                risk_level
        })

    results.sort(
        key=lambda x:
        x["risk_score"],
        reverse=True
    )

    return results