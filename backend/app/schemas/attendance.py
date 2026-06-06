from pydantic import BaseModel


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    status: str

    class Config:
        from_attributes = True