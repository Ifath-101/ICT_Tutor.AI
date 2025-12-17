import json

def get_content(lo_id):
    with open("backend/data/lesson1_content.json") as f:
        data = json.load(f)
    return data.get(lo_id)
