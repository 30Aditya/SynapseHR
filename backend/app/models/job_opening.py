from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class JobOpening(Base):
    __tablename__ = "job_openings"

    id = Column(Integer, primary_key=True, index=True)

    job_title = Column(String, nullable=False)

    department = Column(String)

    job_description = Column(Text, nullable=False)

    required_skills = Column(Text, nullable=False)