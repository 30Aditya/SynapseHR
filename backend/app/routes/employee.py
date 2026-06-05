from fastapi import APIRouter, Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.auth.roles import require_role
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate
from app.dependencies import get_db

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

@router.post("/")
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    employee_count = db.query(Employee).count()

    employee_code = f"EMP{1000 + employee_count + 1}"

    new_employee = Employee(
        employee_code=employee_code,
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        phone=employee.phone,
        department=employee.department,
        designation=employee.designation,
        salary=employee.salary,
        status=employee.status
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee


@router.get("/")
def get_employees(
    db: Session = Depends(get_db)
):
    return db.query(Employee).all()


@router.get("/{employee_id}")
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )
    
@router.put("/{employee_id}")
def update_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    db_employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not db_employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    db_employee.first_name = employee.first_name
    db_employee.last_name = employee.last_name
    db_employee.email = employee.email
    db_employee.phone = employee.phone
    db_employee.department = employee.department
    db_employee.designation = employee.designation
    db_employee.salary = employee.salary
    db_employee.status = employee.status

    db.commit()
    db.refresh(db_employee)

    return db_employee

@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
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

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully"
    }