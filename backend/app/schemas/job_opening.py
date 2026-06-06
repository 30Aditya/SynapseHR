from pydantic import BaseModel


class JobOpeningCreate(BaseModel):
    job_title: str
    department: str
    job_description: str
    required_skills: str