from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date

from app.database import Base


class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, nullable=False)

    rating = Column(Integer, nullable=False)

    feedback = Column(String)

    review_date = Column(Date)

    reviewed_by = Column(String)