from agents.assessment_agent import assess_answer
from agents.progress_agent import update_mastery


def process_answer(lesson_id, lo_id, student_answer, correct_answer):
    result = assess_answer(student_answer, correct_answer)

    score = result["score"]
    new_mastery = update_mastery(lesson_id, lo_id, score)

    return {
        "score": score,
        "updated_mastery": new_mastery,
        "explanation": result["explanation"],
        "strengths": result["strengths"],
        "improvements": result["improvements"]
    }