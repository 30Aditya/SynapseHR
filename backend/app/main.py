from fastapi import FastAPI

from app.database import Base, engine
from app.models.employee import Employee

from app.routes.employee import router as employee_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(employee_router)

@app.get("/")
def home():
    return {
        "message": "HRMS Running"
    }