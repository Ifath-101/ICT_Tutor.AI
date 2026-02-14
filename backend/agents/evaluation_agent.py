from services.llm_service import semantic_similarity


def evaluate_answer(student_answer, correct_answer):
    student_answer = student_answer.lower().strip()
    correct_answer = correct_answer.lower().strip()

    # Rule-based score
    rule_score = 1.0 if student_answer == correct_answer else 0.0

    # Gemini semantic score
    semantic_score = semantic_similarity(student_answer, correct_answer)

    # Hybrid weighted score
    final_score = (0.6 * semantic_score) + (0.4 * rule_score)

    return round(final_score, 2)
