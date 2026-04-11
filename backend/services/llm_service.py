import os
import re
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Create OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPEN_ROUTER_API_KEY")
)

# You can change the model name in your .env file
MODEL_NAME = os.getenv("OPEN_ROUTER_MODEL", "openrouter/free")


def generate_text(prompt: str) -> str:
    """Helper function to generate content using OpenRouter."""
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


def generate_chat_response(messages: list[dict]) -> str:
    """Generates a response from a multi-turn conversation."""
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages
    )
    return response.choices[0].message.content


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

    text = generate_text(prompt).strip()

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

    return generate_text(prompt).strip()


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

    return generate_text(prompt).strip()
