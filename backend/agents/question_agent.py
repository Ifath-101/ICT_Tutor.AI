import json
import random
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
QUESTION_PATH = BASE_DIR / "data" / "lesson1_questions.json"
PROGRESS_PATH = BASE_DIR / "data" / "student_progress.json"


def generate_question():
    # Load mastery
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    # Choose weakest LO
    lesson = progress["lesson1"]
    lo_id = min(lesson, key=lambda x: lesson[x]["mastery"])
    mastery = lesson[lo_id]["mastery"]

    # Decide difficulty
    if mastery < 0.4:
        difficulty = "easy"
    elif mastery < 0.7:
        difficulty = "medium"
    else:
        difficulty = "hard"

    # Load question bank
    with open(QUESTION_PATH, "r", encoding="utf-8") as f:
        questions = json.load(f)

    question = random.choice(questions[lo_id][difficulty])

    return {
        "learning_objective": lo_id,
        "difficulty": difficulty,
        "question_id": question["id"],
        "question": question["question"]
    }
