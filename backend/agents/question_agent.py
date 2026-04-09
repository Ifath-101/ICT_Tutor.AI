import json
import re
import logging

from fastapi import HTTPException

logger = logging.getLogger(__name__)

from sqlalchemy.orm import Session

from agents.progress_agent import get_adaptive_lo, get_lo_mastery
from lessons.catalog import load_blueprint
from services.llm_service import generate_text
from services.rag_service import retrieve_context


def generate_question(lesson_id: str, db: Session, user_id: int):
    try:
        blueprint = load_blueprint(lesson_id)

        lo_ids = list(blueprint["learning_objectives"].keys())
        lo_id = get_adaptive_lo(db, user_id, lesson_id, lo_ids)
        lo = blueprint["learning_objectives"][lo_id]

        mastery = get_lo_mastery(db, user_id, lesson_id, lo_id)

        if mastery < 0.4:
            difficulty = "easy"
        elif mastery < 0.7:
            difficulty = "moderate"
        else:
            difficulty = "application-level"
            
        context = retrieve_context(lesson_id, lo.get("objective"))

        prompt = f"""
        You are an AI tutor.

        Generate EXACTLY ONE {difficulty} question.
        
        Source Material Context (Formulate your question base strictly on facts from this provided context):
        {context if context else "(No textbook material available, rely on basic facts within scope)"}

        IMPORTANT RULES:
        - The context is provided only for you to create the question. So do not firectly refer to it in questions.
        - Generate ONLY ONE question.
        - Do NOT combine multiple questions.
        - Question must test ONLY this objective:
          {lo["objective"]}
        - Stay strictly within this scope and use the Source Material provided:
          {blueprint["scope"]}

        Return ONLY valid JSON:
        {{
            "learning_objective": "{lo_id}",
            "question": "One clear question only.",
            "correct_answer": "Clear model answer."
        }}
        """

        raw_text = generate_text(prompt).strip()
        cleaned = re.sub(r"```json|```", "", raw_text).strip()

        return json.loads(cleaned)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in generate_question: {e}", exc_info=True)
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(status_code=429, detail=f"LLM API Quota Exceeded: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_hint(question: str, correct_answer: str):
    try:
        prompt = f"""
        You are an AI tutor helping a student with a question.

        Question: {question}
        Correct Answer: {correct_answer}

        Provide a short, helpful hint to guide the student towards the correct answer without directly revealing it.
        Return plain text, no markdown.
        """

        return generate_text(prompt).strip()
    except Exception as e:
        logger.error(f"Error in generate_hint: {e}", exc_info=True)
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(status_code=429, detail=f"LLM API Quota Exceeded: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))