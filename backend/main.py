from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine
from database import models
import json
from pathlib import Path
from routes.auth_routes import router as auth_router
from agents.content_agent import get_content
from agents.question_agent import generate_question
from agents.submission_agent import process_answer

models.Base.metadata.create_all(bind=engine)

BASE_DIR = Path(__file__).resolve().parent
BLUEPRINT_PATH = BASE_DIR / "data" / "lesson1_blueprint.json"

app = FastAPI()
app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Tutor backend running"}


# 🔥 NEW ENDPOINT
@app.get("/lesson/{lesson_id}/blueprint")
def get_blueprint(lesson_id: str):
    with open(BLUEPRINT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/lesson/{lesson_id}/content/{lo_id}")
def content(lesson_id: str, lo_id: str):
    return get_content(lesson_id, lo_id)


@app.get("/lesson/{lesson_id}/next-question")
def next_question(lesson_id: str):
    return generate_question(lesson_id)


@app.post("/lesson/{lesson_id}/answer")
def submit_answer(lesson_id: str, payload: dict):
    return process_answer(
        lesson_id,
        payload["learning_objective"],
        payload["answer"],
        payload["correct_answer"]
    )