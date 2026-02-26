from services.llm_service import client, MODEL_NAME
import json
import re


def assess_answer(student_answer, correct_answer):
    prompt = f"""
    You are an AI tutor evaluating a student's answer.

    Correct Answer:
    {correct_answer}

    Student Answer:
    {student_answer}

    Evaluate the answer and return JSON format:

    {{
        "score": float between 0 and 1,
        "explanation": "short explanation for score",
        "strengths": "what student did correctly",
        "improvements": "what was missing or incorrect"
    }}

    Rules:
    - Score must be fair and conceptual.
    - Do NOT return markdown.
    - Return ONLY valid JSON.
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    raw_text = response.text.strip()
    cleaned = re.sub(r"```json|```", "", raw_text).strip()

    try:
        return json.loads(cleaned)
    except:
        return {
            "score": 0.0,
            "explanation": "Evaluation failed.",
            "strengths": "",
            "improvements": "Could not parse evaluation."
        }