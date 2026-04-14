from sqlalchemy.orm import Session

from agents.assessment_agent import assess_answer
from agents.progress_agent import update_mastery
from database.models import Submission


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
    is_correct = score >= 0.7  # Assuming >= 0.7 is passing/correct

    # Record the submission
    submission = Submission(
        user_id=user_id,
        lesson_id=lesson_id,
        lo_id=lo_id,
        student_answer=student_answer,
        correct_answer=correct_answer,
        is_correct=is_correct
    )
    db.add(submission)
    
    new_mastery = update_mastery(db, user_id, lesson_id, lo_id, score)

    db.commit()

    return {
        "score": score,
        "updated_mastery": new_mastery,
        "explanation": result.get("explanation", ""),
        "strengths": result.get("strengths", ""),
        "improvements": result.get("improvements", "")
    }