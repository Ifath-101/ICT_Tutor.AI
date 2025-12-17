from fastapi import FastAPI
from agents.content_agent import get_content
from agents.student_model_agent import get_mastery

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
