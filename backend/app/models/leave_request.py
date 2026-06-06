from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date

from app.database import Base


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, nullable=False)

    leave_type = Column(String, nullable=False)

    start_date = Column(Date, nullable=False)

    end_date = Column(Date, nullable=False)

    reason = Column(String)

    status = Column(String, default="Pending")