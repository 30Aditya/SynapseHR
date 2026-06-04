from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_code = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    department = Column(String)
    designation = Column(String)
    salary = Column(Float)
    status = Column(String)