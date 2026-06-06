from pydantic import BaseModel


class ResumeScreenRequest(BaseModel):

    candidate_name: str

    resume_text: str

    job_description: str


class ResumeScreenResponse(BaseModel):

    candidate_name: str

    score: float

    recommendation: str