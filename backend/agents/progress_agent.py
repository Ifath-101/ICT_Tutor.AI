from sqlalchemy.orm import Session

from database.models import Progress


def get_or_create_progress(
    db: Session, user_id: int, lesson_id: str, lo_id: str
) -> Progress:
    p = (
        db.query(Progress)
        .filter(
            Progress.user_id == user_id,
            Progress.lesson_id == lesson_id,
            Progress.lo_id == lo_id,
        )
        .first()
    )
    if not p:
        p = Progress(
            user_id=user_id,
            lesson_id=lesson_id,
            lo_id=lo_id,
            mastery=0.0,
            attempts=0,
            correct=0,
        )
        db.add(p)
        db.flush()
    return p


def get_lo_mastery(db: Session, user_id: int, lesson_id: str, lo_id: str) -> float:
    p = (
        db.query(Progress)
        .filter(
            Progress.user_id == user_id,
            Progress.lesson_id == lesson_id,
            Progress.lo_id == lo_id,
        )
        .first()
    )
    return p.mastery if p else 0.0


def get_adaptive_lo(
    db: Session, user_id: int, lesson_id: str, lo_ids: list[str]
) -> str:
    weakest = None
    lowest = float("inf")
    for lo_id in lo_ids:
        m = get_lo_mastery(db, user_id, lesson_id, lo_id)
        if m < lowest:
            lowest = m
            weakest = lo_id
    return weakest or lo_ids[0]


def update_mastery(
    db: Session, user_id: int, lesson_id: str, lo_id: str, score: float
) -> float:
    p = get_or_create_progress(db, user_id, lesson_id, lo_id)
    p.attempts += 1
    if score >= 0.6:
        p.correct += 1

    new_mastery = round((p.mastery * 0.7) + (score * 0.3), 2)
    p.mastery = new_mastery
    db.commit()
    db.refresh(p)
    return new_mastery
