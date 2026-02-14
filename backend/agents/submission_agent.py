import json
from pathlib import Path
from agents.evaluation_agent import evaluate_answer
from agents.feedback_agent import generate_feedback
from agents.progress_agent import update_mastery

BASE_DIR = Path(__file__).resolve().parent.parent
QUESTION_PATH = BASE_DIR / "data" / "lesson1_questions.json"


def process_answer(lo_id, question_id, student_answer):
    lo_id = lo_id.upper()

    with open(QUESTION_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)

    if lo_id not in questions:
        raise ValueError(f"Learning objective '{lo_id}' not found")

    correct_answer = None

    for difficulty_level in questions[lo_id]:
        for q in questions[lo_id][difficulty_level]:
            if q["id"].upper() == question_id.upper():
                correct_answer = q["answer"]

    if not correct_answer:
        raise ValueError("Invalid question ID")

    score = evaluate_answer(student_answer, correct_answer)
    feedback = generate_feedback(score, student_answer, correct_answer)
    new_mastery = update_mastery(lo_id, score)

    return {
        "score": score,
        "feedback": feedback,
        "updated_mastery": new_mastery
    }
