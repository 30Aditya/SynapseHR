from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

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
def start_interview(
    request: StartInterviewRequest,
    db: Session = Depends(get_db)
):

    session = InterviewSession(
        candidate_name=request.candidate_name,
        job_title=request.job_title
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    resume_store[
        session.id
    ] = request.resume_text

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