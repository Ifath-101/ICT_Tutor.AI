import sys
import os
from pathlib import Path
import json

# Add backend directory to sys.path to resolve module imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import SessionLocal, engine
from database.models import Base, Lesson, LearningObjective

# Ensure all tables are created
Base.metadata.create_all(bind=engine)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def seed():
    db = SessionLocal()
    try:
        # Loop through all blueprint JSON files
        for path in sorted(DATA_DIR.glob("*_blueprint.json")):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except (OSError, json.JSONDecodeError):
                continue
                
            lesson_id = data.get("lesson_id")
            if not lesson_id:
                continue

            # Check if lesson already exists
            existing_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
            if existing_lesson:
                print(f"Lesson {lesson_id} already exists, skipping...")
                continue
            
            print(f"Migrating lesson {lesson_id}...")
            
            # Create lesson
            lesson = Lesson(
                id=lesson_id,
                title=data.get("title", lesson_id),
                grade_level=data.get("grade_level", ""),
                main_topic=data.get("main_topic", ""),
                scope=data.get("scope", "")
            )
            db.add(lesson)
            db.commit() # Commit to get the lesson in the DB or to have the ID accessible
            
            # Create learning objectives
            objectives_data = data.get("learning_objectives", {})
            for lo_id, lo_data in objectives_data.items():
                lo = LearningObjective(
                    lesson_id=lesson.id,
                    lo_id=lo_id,
                    objective=lo_data.get("objective", ""),
                    cognitive_level=lo_data.get("cognitive_level", ""),
                    question_types=lo_data.get("question_types", [])
                )
                db.add(lo)
            
            db.commit()
            print(f"Successfully migrated {lesson_id}")
            
        print("Database migration seeding completed!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
