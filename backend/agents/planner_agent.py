from agents.student_model_agent import get_mastery

def next_lo():
    mastery = get_mastery()
    for lo, score in mastery.items():
        if score < 0.7:
            return lo
    return "DONE"
