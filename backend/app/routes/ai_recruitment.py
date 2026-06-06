from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from sqlalchemy.orm import Session

import os
import uuid

from app.dependencies import get_db

from app.models.job_opening import JobOpening

from app.AI.resume_parser import (
    extract_text_from_pdf
)

from app.AI.resume_matcher import (
    calculate_score,
    recommendation,
    find_missing_skills
)

from app.auth.roles import require_role

router = APIRouter(
    prefix="/ai",
    tags=["AI Recruitment"]
)


@router.post("/screen-resume/{job_id}")
async def screen_resume(
    job_id: int,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):

    job = (
        db.query(JobOpening)
        .filter(JobOpening.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    os.makedirs(
        "uploads",
        exist_ok=True
    )

    filename = (
        str(uuid.uuid4())
        + ".pdf"
    )

    filepath = (
        f"uploads/{filename}"
    )

    with open(
        filepath,
        "wb"
    ) as buffer:

        buffer.write(
            await resume.read()
        )

    resume_text = (
        extract_text_from_pdf(
            filepath
        )
    )

    score = calculate_score(
        resume_text,
        job.job_description
    )

    missing_skills = (
        find_missing_skills(
            resume_text,
            job.required_skills
        )
    )

    return {
        "job_title": job.job_title,
        "score": score,
        "recommendation":
            recommendation(score),
        "missing_skills":
            missing_skills
    }