from pydantic import BaseModel


class StartInterviewRequest(
    BaseModel
):
    candidate_name: str
    job_title: str
    resume_text: str
    job_description: str


class CandidateResponse(
    BaseModel
):
    answer: str