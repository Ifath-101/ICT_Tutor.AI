from fastapi import HTTPException
from sqlalchemy.orm import Session
from database.models import Lesson

def load_blueprint(lesson_id: str, db: Session) -> dict:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Reconstruct the blueprint dictionary expected by the frontend
    blueprint = {
        "lesson_id": lesson.id,
        "title": lesson.title,
        "grade_level": lesson.grade_level,
        "main_topic": lesson.main_topic,
        "scope": lesson.scope,
        "learning_objectives": {}
    }

    for lo in lesson.learning_objectives:
        blueprint["learning_objectives"][lo.lo_id] = {
            "objective": lo.objective,
            "cognitive_level": lo.cognitive_level,
            "question_types": lo.question_types
        }

    return blueprint

def list_lessons(db: Session) -> list[dict]:
    lessons = db.query(Lesson).order_by(Lesson.id).all()
    items = []
    
    for lesson in lessons:
        items.append({
            "lesson_id": lesson.id,
            "title": lesson.title,
            "grade_level": lesson.grade_level,
            "main_topic": lesson.main_topic,
        })
        
    return items
