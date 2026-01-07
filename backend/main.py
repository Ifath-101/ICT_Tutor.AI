from fastapi import FastAPI
from agents.content_agent import get_content
from agents.progress_agent import get_mastery
from agents.question_agent import generate_question
from agents.evaluation_agent import evaluate_answer
from agents.feedback_agent import generate_feedback
from agents.progress_agent import update_mastery
from agents.submission_agent import process_answer
import json

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Tutor backend running"}

@app.get("/lesson1/content/{lo_id}")
def content(lo_id: str):
    return get_content(lo_id)

@app.get("/student/progress")
def progress():
    return get_mastery()

@app.get("/lesson1/question")
def get_question():
    return generate_question()

@app.post("/lesson1/answer")
def submit_answer(payload: dict):
    return process_answer(
        payload["learning_objective"],
        payload["question_id"],
        payload["answer"]
    )