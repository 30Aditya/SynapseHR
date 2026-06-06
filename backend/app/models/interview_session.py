from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import DateTime

from datetime import datetime

from app.database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_name = Column(String)

    job_title = Column(String)

    status = Column(
        String,
        default="IN_PROGRESS"
    )

    current_question = Column(
        Integer,
        default=0
    )

    final_score = Column(
        Float,
        nullable=True
    )

    recommendation = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )