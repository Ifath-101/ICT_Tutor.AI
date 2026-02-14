import json
import json
import re
from pathlib import Path
from services.llm_service import client, MODEL_NAME
from agents.progress_agent import get_adaptive_lo, set_last_asked_lo
import json

BASE_DIR = Path(__file__).resolve().parent.parent
BLUEPRINT_PATH = BASE_DIR / "data" / "lesson1_blueprint.json"


def generate_question(lesson_id, lo_id, difficulty="moderate"):
    with open(BLUEPRINT_PATH, "r", encoding="utf-8") as f:
        blueprint = json.load(f)

    lo = blueprint["learning_objectives"][lo_id]

    prompt = f"""
        Create one {difficulty} question for:

        Lesson: {blueprint["title"]}
        Grade Level: {blueprint["grade_level"]}
        Scope: {blueprint["scope"]}

        Learning Objective:
        {lo["objective"]}

        Cognitive Level: {lo["cognitive_level"]}

        Generate:
        - One clear question
        - Include correct answer separately
        - Return in JSON format:
        {{
            "question": "...",
            "correct_answer": "..."
        }}
        """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    raw_text = response.text.strip()

    # Remove markdown code block if present
    cleaned = re.sub(r"```json|```", "", raw_text).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON returned from LLM",
            "raw_response": raw_text
        }

def generate_adaptive_question(lesson_id):
    lo_id = get_adaptive_lo(lesson_id)

    # Read mastery level
    from agents.progress_agent import get_mastery
    progress = get_mastery()
    mastery = progress[lesson_id][lo_id]["mastery"]

    # Decide difficulty
    if mastery < 0.4:
        difficulty = "easy and remedial"
    elif mastery < 0.7:
        difficulty = "moderate"
    else:
        difficulty = "challenging and application-based"

    question_data = generate_question(lesson_id, lo_id, difficulty)

    set_last_asked_lo(lo_id)

    return question_data


