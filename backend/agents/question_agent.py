import json
import re
from pathlib import Path
from services.llm_service import client, MODEL_NAME
from agents.progress_agent import get_adaptive_lo, get_mastery

BASE_DIR = Path(__file__).resolve().parent.parent
BLUEPRINT_PATH = BASE_DIR / "data" / "lesson1_blueprint.json"


def generate_question(lesson_id):
    with open(BLUEPRINT_PATH, "r", encoding="utf-8") as f:
        blueprint = json.load(f)

    lo_id = get_adaptive_lo(lesson_id)
    lo = blueprint["learning_objectives"][lo_id]

    progress = get_mastery()
    mastery = progress[lesson_id][lo_id]["mastery"]

    if mastery < 0.4:
        difficulty = "easy"
    elif mastery < 0.7:
        difficulty = "moderate"
    else:
        difficulty = "application-level"

    prompt = f"""
    Create ONE {difficulty} question strictly based on:

    Lesson Scope:
    {blueprint["scope"]}

    Learning Objective:
    {lo["objective"]}

    Ensure:
    - Question directly tests this objective
    - No unrelated topics
    - Provide correct_answer

    Return ONLY JSON:
    {{
        "learning_objective": "{lo_id}",
        "question": "...",
        "correct_answer": "..."
    }}
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    raw_text = response.text.strip()
    cleaned = re.sub(r"```json|```", "", raw_text).strip()

    return json.loads(cleaned)
