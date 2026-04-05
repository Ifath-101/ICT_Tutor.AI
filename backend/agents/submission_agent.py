from sqlalchemy.orm import Session

from agents.assessment_agent import assess_answer
from agents.progress_agent import update_mastery


def process_answer(
    lesson_id: str,
    lo_id: str,
    student_answer: str,
    correct_answer: str,
    db: Session,
    user_id: int,
):
    result = assess_answer(student_answer, correct_answer)

    score = result["score"]
    new_mastery = update_mastery(db, user_id, lesson_id, lo_id, score)

    return {
        "score": score,
        "updated_mastery": new_mastery,
        "explanation": result["explanation"],
        "strengths": result["strengths"],
        "improvements": result["improvements"]
    }