import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROGRESS_PATH = BASE_DIR / "data" / "student_progress.json"


def get_mastery():
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def update_mastery(lo_id: str, score: float):
    lo_id = lo_id.upper()

    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    if lo_id not in progress["lesson1"]:
        raise ValueError(f"Learning objective '{lo_id}' not found")

    lo_data = progress["lesson1"][lo_id]

    lo_data["attempts"] += 1
    if score >= 0.5:
        lo_data["correct"] += 1

    current = lo_data["mastery"]
    new_mastery = round((current * 0.7) + (score * 0.3), 2)

    lo_data["mastery"] = new_mastery

    with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=4)

    return new_mastery

def get_adaptive_lo(lesson_id):
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    lesson_progress = progress[lesson_id]
    last_lo = progress.get("last_asked_lo")

    # Sort by mastery ascending
    sorted_los = sorted(
        lesson_progress.items(),
        key=lambda x: x[1]["mastery"]
    )

    # Pick lowest that is NOT the last asked
    for lo_id, _ in sorted_los:
        if lo_id != last_lo:
            return lo_id

    # If all same, fallback to weakest
    return sorted_los[0][0]


def get_last_asked_lo():
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    return progress.get("last_asked_lo")


def set_last_asked_lo(lo_id):
    with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
        progress = json.load(f)

    progress["last_asked_lo"] = lo_id

    with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=4)




