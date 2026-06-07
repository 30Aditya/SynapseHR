from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import File
from fastapi import Form

import os
import uuid

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.interview_session import (
    InterviewSession
)

from app.models.interview_message import (
    InterviewMessage
)

from app.schemas.interview import (
    StartInterviewRequest,
    CandidateResponse
)

from app.AI.interview_agent import (
    evaluate_candidate
)

from app.AI.resume_parser import (
    extract_text_from_pdf
)

router = APIRouter(
    prefix="/interview",
    tags=["AI Interview"]
)


INTERVIEW_QUESTIONS = [
    "Please introduce yourself.",

    "Tell me about your educational background.",

    "Tell me about your internship experience.",

    "What were your key responsibilities during the internship?",

    "Tell me about your most important project.",

    "What was your contribution to that project?",

    "What challenges did you face and how did you solve them?",

    "What technologies and tools did you use?",

    "Tell me about a situation where you worked in a team.",

    "Why are you interested in this role?",

    "What are your strengths and weaknesses?",

    "Where do you see yourself in five years?"
]


resume_store = {}


@router.post("/start")
async def start_interview(
    candidate_name: str = Form(...),
    job_title: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):

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

    session = InterviewSession(
        candidate_name=candidate_name,
        job_title=job_title
    )

    db.add(session)

    db.commit()

    db.refresh(session)

    resume_store[
        session.id
    ] = resume_text

    first_question = (
        INTERVIEW_QUESTIONS[0]
    )

    db.add(
        InterviewMessage(
            session_id=session.id,
            speaker="AI",
            message=first_question
        )
    )

    db.commit()

    return {
        "session_id": session.id,
        "question": first_question
    }

@router.post("/respond/{session_id}")
def respond(
    session_id: int,
    request: CandidateResponse,
    db: Session = Depends(get_db)
):

    session = (
        db.query(
            InterviewSession
        )
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    db.add(
        InterviewMessage(
            session_id=session_id,
            speaker="Candidate",
            message=request.answer
        )
    )

    session.current_question += 1

    if (
        session.current_question
        >= len(INTERVIEW_QUESTIONS)
    ):

        db.commit()

        return {
            "message":
            "Interview completed. Run /interview/end/{session_id}"
        }

    next_question = (
        INTERVIEW_QUESTIONS[
            session.current_question
        ]
    )

    db.add(
        InterviewMessage(
            session_id=session_id,
            speaker="AI",
            message=next_question
        )
    )

    db.commit()

    return {
        "question": next_question
    }


@router.post("/end/{session_id}")
def end_interview(
    session_id: int,
    db: Session = Depends(get_db)
):

    session = (
        db.query(
            InterviewSession
        )
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    messages = (
        db.query(
            InterviewMessage
        )
        .filter(
            InterviewMessage.session_id
            == session_id
        )
        .all()
    )

    transcript = "\n".join(
        [
            f"{m.speaker}: {m.message}"
            for m in messages
        ]
    )

    evaluation = (
        evaluate_candidate(
            resume_store[
                session_id
            ],
            transcript
        )
    )

    session.status = "COMPLETED"

    db.commit()

    return {
        "evaluation": evaluation
    }


@router.get(
    "/transcript/{session_id}"
)
def transcript(
    session_id: int,
    db: Session = Depends(get_db)
):

    messages = (
        db.query(
            InterviewMessage
        )
        .filter(
            InterviewMessage.session_id
            == session_id
        )
        .all()
    )

    return messages