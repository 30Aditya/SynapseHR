from pydantic import BaseModel


class PayrollResponse(BaseModel):

    id: int

    employee_id: int

    month: str

    basic_salary: float

    deduction: float

    net_salary: float

    class Config:
        from_attributes = True