from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from database.models import Progress, User
from auth.dependencies import get_current_user

router = APIRouter()


@router.post("/update-progress")
def update_progress(
    lesson_id: str,
    lo_id: str,
    correct: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.lesson_id == lesson_id,
        Progress.lo_id == lo_id
    ).first()

    if not progress:
        progress = Progress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            lo_id=lo_id,
            mastery=0.0,
            attempts=0,
            correct=0
        )
        db.add(progress)

    progress.attempts += 1

    if correct:
        progress.correct += 1

    progress.mastery = progress.correct / progress.attempts

    db.commit()
    db.refresh(progress)

    return {
        "lesson_id": lesson_id,
        "lo_id": lo_id,
        "mastery": progress.mastery,
        "attempts": progress.attempts,
        "correct": progress.correct
    }

@router.get("/my-progress")
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    progress_records = db.query(Progress).filter(
        Progress.user_id == current_user.id
    ).all()

    return progress_records