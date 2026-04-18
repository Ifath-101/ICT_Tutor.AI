from database.database import SessionLocal
from database.models import Lesson, LearningObjective

def seed():
    db = SessionLocal()

    try:
        # Check if already exists (avoid duplicates)
        existing = db.query(Lesson).filter(Lesson.id == "lesson1").first()
        if existing:
            print("Lesson already exists. Skipping...")
            return

        # Create Lesson
        lesson = Lesson(
            id="lesson1",
            title="Basic concepts of ICT",
            grade_level="A/L",
            main_topic="Basic concepts of ICT",
            scope="Data and information, Basic components of a computer system, Activities of data processing"
        )

        db.add(lesson)

        # Create Learning Objectives
        learning_objectives = [
            {
                "lo_id": "LO1",
                "objective": "Explain what is data and information,charcteristics of information, types of data, golden rule of information",
                "cognitive_level": "Understand",
                "question_types": ["short_answer", "conceptual"]
            },
            {
                "lo_id": "LO2",
                "objective": "Explain the components of a computer system and their functions in detail (Hardware, Software, Liveware, Firmware",
                "cognitive_level": "Remember",
                "question_types": ["short_answer", "MCQ"]
            },
            {
                "lo_id": "LO3",
                "objective": "Explain the activities of data processing in detail",
                "cognitive_level": "Understand",
                "question_types": ["explanatory"]
            },
            {
                "lo_id": "LO4",
                "objective": "Explain the applications of ICT in different domains",
                "cognitive_level": "Understand",
                "question_types": ["explanatory"]
            },
            {
                "lo_id": "LO5",
                "objective": "Explain the impact of ICT in the society",
                "cognitive_level": "Understand",
                "question_types": ["explanatory"]
            }
        ]

        for lo in learning_objectives:
            db.add(LearningObjective(
                lesson_id="lesson1",
                lo_id=lo["lo_id"],
                objective=lo["objective"],
                cognitive_level=lo["cognitive_level"],
                question_types=lo["question_types"]
            ))

        db.commit()
        print("✅ Seed data inserted successfully!")

    except Exception as e:
        db.rollback()
        print("❌ Error:", e)

    finally:
        db.close()


if __name__ == "__main__":
    seed()