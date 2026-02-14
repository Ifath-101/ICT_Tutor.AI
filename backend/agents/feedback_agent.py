from agents.misconception_agent import find_misconception
from services.llm_service import generate_explanatory_feedback


def generate_feedback(score, student_answer, correct_answer):

    if score >= 0.9:
        return "Excellent understanding of the concept."

    misconception = find_misconception(student_answer, correct_answer)

    if misconception != "None":
        return f"Misconception detected: {misconception}"

    # AI-generated personalized feedback
    return generate_explanatory_feedback(
        student_answer,
        correct_answer,
        score
    )
