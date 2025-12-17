student_mastery = {
    "LO1": 0.0,
    "LO2": 0.0
}

def update_mastery(lo_id, correct):
    if correct:
        student_mastery[lo_id] += 0.2
    else:
        student_mastery[lo_id] -= 0.1

    student_mastery[lo_id] = min(max(student_mastery[lo_id], 0), 1)

def get_mastery():
    return student_mastery
