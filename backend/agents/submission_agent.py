import json
from agents.evaluation_agent import evaluate_answer
from agents.feedback_agent import generate_feedback
from agents.progress_agent import update_mastery
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
QUESTION_PATH = BASE_DIR / "data" / "lesson1_questions.json"


def process_answer(lo_id, question_id, student_answer):
    with open(QUESTION_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)

    correct_answer = None

    for level in questions[lo_id].values():
        for q in level:
            if q["id"] == question_id:
                correct_answer = q["answer"]

    if not correct_answer:
        raise ValueError("Invalid question ID")

    score = evaluate_answer(student_answer, correct_answer)
    feedback = generate_feedback(score)
    new_mastery = update_mastery(lo_id, score)

    return {
        "score": score,
        "feedback": feedback,
        "updated_mastery": new_mastery
    }
