import json
from pathlib import Path

from fastapi import HTTPException

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def blueprint_path(lesson_id: str) -> Path:
    return DATA_DIR / f"{lesson_id}_blueprint.json"


def load_blueprint(lesson_id: str) -> dict:
    path = blueprint_path(lesson_id)
    if not path.is_file():
        raise HTTPException(status_code=404, detail="Lesson not found")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if data.get("lesson_id") != lesson_id:
        raise HTTPException(
            status_code=500,
            detail="Blueprint lesson_id does not match filename",
        )
    return data


def list_lessons() -> list[dict]:
    items: list[dict] = []
    for path in sorted(DATA_DIR.glob("*_blueprint.json")):
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError):
            continue
        lid = data.get("lesson_id")
        if not lid:
            continue
        items.append(
            {
                "lesson_id": lid,
                "title": data.get("title", lid),
                "grade_level": data.get("grade_level"),
                "main_topic": data.get("main_topic"),
            }
        )
    return sorted(items, key=lambda x: x["lesson_id"])
