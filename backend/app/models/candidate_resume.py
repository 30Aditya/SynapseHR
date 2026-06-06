from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Text

from app.database import Base


class CandidateResume(Base):
    __tablename__ = "candidate_resumes"

    id = Column(Integer, primary_key=True, index=True)

    candidate_name = Column(String, nullable=False)

    resume_text = Column(Text, nullable=False)

    job_description = Column(Text, nullable=False)

    score = Column(Float)

    recommendation = Column(String)