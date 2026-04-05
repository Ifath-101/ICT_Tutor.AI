from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database import models
from database.database import engine, get_db
from database.models import User
from routes.auth_routes import router as auth_router
from agents.content_agent import get_content
from agents.question_agent import generate_question
from agents.submission_agent import process_answer
from lessons.catalog import list_lessons, load_blueprint
from routes.progress_routes import router as progress_router
from routes.tutor_routes import router as tutor_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth_router)
app.include_router(progress_router)
app.include_router(tutor_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Tutor backend running"}


@app.get("/lessons")
def get_lessons():
    return list_lessons()


class AnswerPayload(BaseModel):
    learning_objective: str
    answer: str
    correct_answer: str


@app.get("/lesson/{lesson_id}/blueprint")
def get_blueprint(
    lesson_id: str,
    current_user: User = Depends(get_current_user),
):
    return load_blueprint(lesson_id)


@app.get("/lesson/{lesson_id}/content/{lo_id}")
def content(
    lesson_id: str,
    lo_id: str,
    current_user: User = Depends(get_current_user),
):
    return get_content(lesson_id, lo_id)


@app.get("/lesson/{lesson_id}/next-question")
def next_question(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_question(lesson_id, db, current_user.id)


@app.post("/lesson/{lesson_id}/answer")
def submit_answer(
    lesson_id: str,
    payload: AnswerPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return process_answer(
        lesson_id,
        payload.learning_objective,
        payload.answer,
        payload.correct_answer,
        db,
        current_user.id,
    )