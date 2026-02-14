from services.llm_service import detect_misconception


def find_misconception(student_answer, correct_answer):
    return detect_misconception(student_answer, correct_answer)
