import json
from pathlib import Path

# Get absolute path to project root
BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "data" / "lesson1_content.json"

def get_content(lo_id: str):
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data
