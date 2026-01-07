import re

def normalize(text):
    text = text.lower()
    text = re.sub(r"[^a-z\s]", "", text)
    return set(text.split())


def evaluate_answer(student_answer, correct_answer):
    student_tokens = normalize(student_answer)
    correct_tokens = normalize(correct_answer)

    if not correct_tokens:
        return 0.0

    overlap = student_tokens.intersection(correct_tokens)
    score = len(overlap) / len(correct_tokens)

    return round(score, 2)
