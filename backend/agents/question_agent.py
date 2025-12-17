import random, json

def get_question(lo_id):
    with open("backend/data/lesson1_questions.json") as f:
        data = json.load(f)
    return random.choice(data.get(lo_id))
