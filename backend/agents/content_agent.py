import json
from pathlib import Path
from services.llm_service import client, MODEL_NAME

BASE_DIR = Path(__file__).resolve().parent.parent
BLUEPRINT_PATH = BASE_DIR / "data" / "lesson1_blueprint.json"


def get_content(lesson_id, lo_id):
    with open(BLUEPRINT_PATH, "r", encoding="utf-8") as f:
        blueprint = json.load(f)

    lo = blueprint["learning_objectives"][lo_id]

    prompt = f"""
    You are an AI tutor creating lesson content.

    Lesson Title: {blueprint["title"]}
    Grade Level: {blueprint["grade_level"]}
    Scope: {blueprint["scope"]}

    Learning Objective:
    {lo["objective"]}

    Generate structured lesson content:
    - Clear explanation
    - Simple language for Grade 8
    - Include examples
    - Stay within scope
    - 200-300 words
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    return {
        "lesson": blueprint["title"],
        "learning_objective": lo_id,
        "content": response.text
    }
