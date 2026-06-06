from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from datetime import date
from datetime import datetime

from app.dependencies import get_db

from app.models.attendance import Attendance
from app.models.employee import Employee

from app.auth.roles import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


@router.post("/check-in")
def check_in(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    employee_email = user["sub"]

    employee = (
        db.query(Employee)
        .filter(
            Employee.email == employee_email
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    existing_record = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.date == date.today()
        )
        .first()
    )

    if existing_record:
        raise HTTPException(
            status_code=400,
            detail="Already checked in today"
        )

    attendance = Attendance(
        employee_id=employee.id,
        date=date.today(),
        check_in=datetime.now().time(),
        status="Present"
    )

    db.add(attendance)

    db.commit()

    db.refresh(attendance)

    return attendance


@router.post("/check-out")
def check_out(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    employee_email = user["sub"]

    employee = (
        db.query(Employee)
        .filter(
            Employee.email == employee_email
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id,
            Attendance.date == date.today()
        )
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Check-in not found"
        )

    attendance.check_out = datetime.now().time()

    db.commit()

    db.refresh(attendance)

    return attendance


@router.get("/my-records")
def my_records(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    employee_email = user["sub"]

    employee = (
        db.query(Employee)
        .filter(
            Employee.email == employee_email
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    records = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee.id
        )
        .all()
    )

    return records


@router.get("/all-records")
def all_records(
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    return db.query(Attendance).all()