def generate_feedback(score):
    if score >= 0.8:
        return "Excellent answer. You have understood this concept well."
    elif score >= 0.5:
        return "Good attempt. Review the concept for better clarity."
    else:
        return "This concept needs improvement. Please revisit the lesson."
