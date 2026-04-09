from services.llm_service import generate_text
from fastapi import HTTPException
import json
import re
import logging

logger = logging.getLogger(__name__)


def assess_answer(student_answer, correct_answer):
    try:
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

        raw_text = generate_text(prompt).strip()
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
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in assess_answer: {e}", exc_info=True)
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(status_code=429, detail=f"LLM API Quota Exceeded: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))