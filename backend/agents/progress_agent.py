import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROGRESS_PATH = BASE_DIR / "data" / "student_progress.json"


def get_mastery():
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def update_mastery(lesson_id, lo_id, score):
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    lo_data = progress[lesson_id][lo_id]

    lo_data["attempts"] += 1
    if score >= 0.6:
        lo_data["correct"] += 1

    current = lo_data["mastery"]

    # Reinforcement update (Weighted moving average)
    new_mastery = round((current * 0.7) + (score * 0.3), 2)

    lo_data["mastery"] = new_mastery
    progress["last_asked_lo"] = lo_id

    with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=4)

    return new_mastery


def get_adaptive_lo(lesson_id):
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    lesson_progress = progress[lesson_id]

    sorted_los = sorted(
        lesson_progress.items(),
        key=lambda x: x[1]["mastery"]
    )

    return sorted_los[0][0]


