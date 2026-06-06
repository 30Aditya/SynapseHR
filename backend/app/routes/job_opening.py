from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.job_opening import JobOpening
from app.schemas.job_opening import JobOpeningCreate
from app.auth.roles import require_role

router = APIRouter(
    prefix="/jobs",
    tags=["Job Openings"]
)


@router.post("/")
def create_job(
    job: JobOpeningCreate,
    db: Session = Depends(get_db),
    user=Depends(require_role("Admin"))
):
    new_job = JobOpening(**job.dict())

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("/")
def get_jobs(
    db: Session = Depends(get_db)
):
    return db.query(JobOpening).all()