from fastapi import FastAPI

from app.database import Base, engine

# Models
from app.models.employee import Employee
from app.models.user import User
from app.models.attendance import Attendance
from app.models.leave_request import LeaveRequest
from app.models.payroll import Payroll
from app.models.performance import PerformanceReview
from app.models.candidate_resume import CandidateResume
from app.models.job_opening import JobOpening
from app.models.interview_session import InterviewSession
from app.models.interview_message import InterviewMessage



# Routers
from app.routes.auth import router as auth_router
from app.routes.employee import router as employee_router
from app.routes.attendance import router as attendance_router
from app.routes.leave import router as leave_router
from app.routes.payroll import router as payroll_router
from app.routes.performance import router as performance_router
from app.routes.ai_recruitment import router as ai_router
from app.routes.job_opening import router as job_router
from app.routes.interview import router as interview_router



app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(employee_router)
app.include_router(attendance_router)
app.include_router(leave_router)
app.include_router(payroll_router)
app.include_router(performance_router)
app.include_router(ai_router)
app.include_router(job_router)
app.include_router(interview_router)


@app.get("/")
def home():
    return {
        "message": "HRMS Running"
    }