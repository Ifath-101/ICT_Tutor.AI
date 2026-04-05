from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from agents.progress_agent import update_mastery
from auth.dependencies import get_current_user
from database.database import get_db
from database.models import Progress, User

router = APIRouter()


@router.post("/update-progress")
def update_progress(
    lesson_id: str,
    lo_id: str,
    correct: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    score = 1.0 if correct else 0.0
    new_mastery = update_mastery(db, current_user.id, lesson_id, lo_id, score)

    row = (
        db.query(Progress)
        .filter(
            Progress.user_id == current_user.id,
            Progress.lesson_id == lesson_id,
            Progress.lo_id == lo_id,
        )
        .first()
    )

    return {
        "lesson_id": lesson_id,
        "lo_id": lo_id,
        "mastery": new_mastery,
        "attempts": row.attempts,
        "correct": row.correct,
    }


@router.get("/my-progress")
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    progress_records = (
        db.query(Progress).filter(Progress.user_id == current_user.id).all()
    )

    return [
        {
            "id": p.id,
            "lesson_id": p.lesson_id,
            "lo_id": p.lo_id,
            "mastery": p.mastery,
            "attempts": p.attempts,
            "correct": p.correct,
        }
        for p in progress_records
    ]
