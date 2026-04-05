import json
import re
from pathlib import Path

from fastapi import HTTPException
from sqlalchemy.orm import Session

from agents.progress_agent import get_adaptive_lo, get_lo_mastery
from services.llm_service import client, MODEL_NAME

BASE_DIR = Path(__file__).resolve().parent.parent
BLUEPRINT_PATH = BASE_DIR / "data" / "lesson1_blueprint.json"


def generate_question(lesson_id: str, db: Session, user_id: int):
    with open(BLUEPRINT_PATH, "r", encoding="utf-8") as f:
        blueprint = json.load(f)

    if lesson_id != blueprint.get("lesson_id", "lesson1"):
        raise HTTPException(status_code=404, detail="Lesson not found")

    lo_ids = list(blueprint["learning_objectives"].keys())
    lo_id = get_adaptive_lo(db, user_id, lesson_id, lo_ids)
    lo = blueprint["learning_objectives"][lo_id]

    mastery = get_lo_mastery(db, user_id, lesson_id, lo_id)

    if mastery < 0.4:
        difficulty = "easy"
    elif mastery < 0.7:
        difficulty = "moderate"
    else:
        difficulty = "application-level"

    prompt = f"""
    You are an AI tutor.

    Generate EXACTLY ONE {difficulty} question.

    IMPORTANT RULES:
    - Generate ONLY ONE question.
    - Do NOT combine multiple questions.
    - Question must test ONLY this objective:
      {lo["objective"]}
    - Stay strictly within this scope:
      {blueprint["scope"]}

    Return ONLY valid JSON:
    {{
        "learning_objective": "{lo_id}",
        "question": "One clear question only.",
        "correct_answer": "Clear model answer."
    }}
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    raw_text = response.text.strip()
    cleaned = re.sub(r"```json|```", "", raw_text).strip()

    return json.loads(cleaned)