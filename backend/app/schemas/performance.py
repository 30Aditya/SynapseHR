from pydantic import BaseModel


class PerformanceCreate(BaseModel):

    rating: int

    feedback: str


class PerformanceResponse(BaseModel):

    id: int

    employee_id: int

    rating: int

    feedback: str

    reviewed_by: str

    class Config:
        from_attributes = True