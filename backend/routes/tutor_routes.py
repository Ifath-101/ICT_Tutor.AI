import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Progress, User
from auth.dependencies import get_current_user
from tutor.question_bank import QUESTION_BANK

router = APIRouter()


@router.get("/get-question")
def get_question(
    lesson_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    lesson = QUESTION_BANK.get(lesson_id)

    if not lesson:
        return {"error": "Lesson not found"}

    # Step 1: Find weakest LO
    weakest_lo = None
    lowest_mastery = 1.0

    for lo_id in lesson.keys():
        progress = db.query(Progress).filter(
            Progress.user_id == current_user.id,
            Progress.lesson_id == lesson_id,
            Progress.lo_id == lo_id
        ).first()

        mastery = progress.mastery if progress else 0.0

        if mastery < lowest_mastery:
            lowest_mastery = mastery
            weakest_lo = lo_id

    # Step 2: Determine difficulty
    if lowest_mastery < 0.4:
        difficulty = "easy"
    elif lowest_mastery < 0.7:
        difficulty = "medium"
    else:
        difficulty = "hard"

    # Step 3: Pick random question
    questions = lesson[weakest_lo][difficulty]
    selected = random.choice(questions)

    return {
        "lesson_id": lesson_id,
        "lo_id": weakest_lo,
        "difficulty": difficulty,
        "question": selected["question"]
    }