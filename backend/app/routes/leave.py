from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.employee import Employee
from app.models.leave_request import LeaveRequest

from app.schemas.leave import LeaveCreate

from app.auth.roles import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/leave",
    tags=["Leave Management"]
)

@router.post("/apply")
def apply_leave(
    leave: LeaveCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    employee = (
        db.query(Employee)
        .filter(Employee.email == user["sub"])
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    leave_request = LeaveRequest(
        employee_id=employee.id,
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
        status="Pending"
    )

    db.add(leave_request)

    db.commit()

    db.refresh(leave_request)

    return leave_request

@router.get("/my-leaves")
def my_leaves(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    employee = (
        db.query(Employee)
        .filter(Employee.email == user["sub"])
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.employee_id == employee.id
        )
        .all()
    )
    
@router.get("/all")
def all_leaves(
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    return db.query(LeaveRequest).all()

@router.put("/{leave_id}/approve")
def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    leave = (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave request not found"
        )

    leave.status = "Approved"

    db.commit()

    db.refresh(leave)

    return leave

@router.put("/{leave_id}/reject")
def reject_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    leave = (
        db.query(LeaveRequest)
        .filter(
            LeaveRequest.id == leave_id
        )
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave request not found"
        )

    leave.status = "Rejected"

    db.commit()

    db.refresh(leave)

    return leave