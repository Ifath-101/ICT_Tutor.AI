from lessons.catalog import load_blueprint
from services.llm_service import generate_text
from services.rag_service import retrieve_context
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)


def get_content(lesson_id: str, lo_id: str):
    try:
        blueprint = load_blueprint(lesson_id)

        # Validate LO existence
        learning_objectives = blueprint.get("learning_objectives", {})
        if lo_id not in learning_objectives:
            raise HTTPException(status_code=404, detail="Learning Objective not found")

        lo = learning_objectives[lo_id]
        
        # Retrieve context from vector db
        context = retrieve_context(lesson_id, lo.get("objective"))

        # Build prompt
        prompt = f"""
        You are an AI tutor creating lesson content.

        Lesson Title: {blueprint.get("title")}
        Grade Level: {blueprint.get("grade_level")}
        Scope: {blueprint.get("scope")}

        Learning Objective:
        {lo.get("objective")}
        
        Source Material Context (Use ONLY facts from this material to explain the concept):
        {context if context else "(No specific textbook material available, rely on general knowledge within scope)"}

        Generate structured lesson content:
        - Clear explanation
        - Simple language for Grade {blueprint.get("grade_level", 8)}
        - Include examples
        - Stay within scope and EXCLUSIVELY use the Source Material provided above.
        - 200-300 words
        """

        # Generate content
        content_text = generate_text(prompt)

        return {
            "lesson_id": lesson_id,
            "lesson_title": blueprint.get("title"),
            "learning_objective_id": lo_id,
            "learning_objective": lo.get("objective"),
            "content": content_text
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_content: {e}", exc_info=True)
        if "quota" in str(e).lower() or "429" in str(e):
            raise HTTPException(status_code=429, detail=f"LLM API Quota Exceeded: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
