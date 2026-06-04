from pydantic import BaseModel

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    department: str
    designation: str
    salary: float
    status: str


class EmployeeResponse(EmployeeCreate):
    id: int
    employee_code: str

    class Config:
        from_attributes = True