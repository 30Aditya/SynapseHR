from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from app.database import Base


class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer,
        ForeignKey(
            "interview_sessions.id"
        )
    )

    speaker = Column(String)

    message = Column(Text)