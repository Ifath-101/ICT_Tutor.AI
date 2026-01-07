import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROGRESS_PATH = BASE_DIR / "data" / "student_progress.json"

def get_mastery():
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def update_mastery(lo_id, score):
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    current = progress["lesson1"][lo_id]["mastery"]

    # Simple moving update
    new_mastery = round((current * 0.7) + (score * 0.3), 2)

    progress["lesson1"][lo_id]["mastery"] = new_mastery

    with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=4)

    return new_mastery