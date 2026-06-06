from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from datetime import date
import calendar

from app.dependencies import get_db

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.leave_request import LeaveRequest
from app.models.payroll import Payroll

from app.auth.roles import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/payroll",
    tags=["Payroll"]
)


@router.post("/generate/{employee_id}")
def generate_payroll(
    employee_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    current_date = date.today()

    days_in_month = calendar.monthrange(
        current_date.year,
        current_date.month
    )[1]

    present_days = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id
        )
        .count()
    )

    approved_leaves = (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.employee_id == employee.id,
            LeaveRequest.status == "Approved"
        )
        .all()
    )

    leave_days = 0

    for leave in approved_leaves:

        leave_days += (
            leave.end_date - leave.start_date
        ).days + 1

    absent_days = (
        days_in_month
        - present_days
        - leave_days
    )

    if absent_days < 0:
        absent_days = 0

    daily_salary = (
        employee.salary
        / days_in_month
    )

    deduction = (
        absent_days
        * daily_salary
    )

    net_salary = (
        employee.salary
        - deduction
    )

    payroll = Payroll(
        employee_id=employee.id,
        month=current_date.strftime("%B %Y"),
        basic_salary=employee.salary,
        deduction=round(deduction, 2),
        net_salary=round(net_salary, 2),
        generated_on=current_date
    )

    db.add(payroll)

    db.commit()

    db.refresh(payroll)

    return {
        "employee_id": employee.id,
        "employee_name": (
            employee.first_name
            + " "
            + employee.last_name
        ),
        "month": payroll.month,
        "days_in_month": days_in_month,
        "present_days": present_days,
        "leave_days": leave_days,
        "absent_days": absent_days,
        "basic_salary": employee.salary,
        "deduction": round(deduction, 2),
        "net_salary": round(net_salary, 2)
    }


@router.get("/my-payslips")
def my_payslips(
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

    payslips = (
        db.query(Payroll)
        .filter(
            Payroll.employee_id == employee.id
        )
        .all()
    )

    return payslips


@router.get("/all")
def all_payroll(
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    return db.query(Payroll).all()