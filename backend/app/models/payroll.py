from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import String
from sqlalchemy import Date

from app.database import Base


class Payroll(Base):
    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(Integer, nullable=False)

    month = Column(String, nullable=False)

    basic_salary = Column(Float, nullable=False)

    deduction = Column(Float, default=0)

    net_salary = Column(Float, nullable=False)

    generated_on = Column(Date)