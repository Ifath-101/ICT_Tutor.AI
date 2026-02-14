import os
import re
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-2.5-flash"


def semantic_similarity(student_answer, correct_answer):
    prompt = f"""
    Compare the student's answer with the correct answer.
    Give ONLY a similarity score between 0 and 1.
    Return ONLY the number.

    Correct Answer:
    {correct_answer}

    Student Answer:
    {student_answer}
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    text = response.text.strip()

    # Extract first float safely
    match = re.search(r"\d*\.?\d+", text)
    if match:
        return float(match.group())

    return 0.0


def detect_misconception(student_answer, correct_answer):
    prompt = f"""
    Identify whether the student's answer shows a misconception.
    If yes, explain briefly.
    If no misconception, return 'None'.

    Correct Answer:
    {correct_answer}

    Student Answer:
    {student_answer}
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    return response.text.strip()


def generate_explanatory_feedback(student_answer, correct_answer, score):
    prompt = f"""
    A student answered a question incorrectly or partially correctly.

    Correct Answer:
    {correct_answer}

    Student Answer:
    {student_answer}

    Score: {score}

    Provide:
    1. What was correct in the student's answer (if anything)
    2. What was missing or wrong
    3. A short explanation of the correct concept
    4. Encouraging tone

    Keep response under 120 words.
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    return response.text.strip()
