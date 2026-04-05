from lessons.catalog import load_blueprint
from services.llm_service import client, MODEL_NAME
from fastapi import HTTPException


def get_content(lesson_id: str, lo_id: str):
    try:
        blueprint = load_blueprint(lesson_id)

        # Validate LO existence
        learning_objectives = blueprint.get("learning_objectives", {})
        if lo_id not in learning_objectives:
            raise HTTPException(status_code=404, detail="Learning Objective not found")

        lo = learning_objectives[lo_id]

        # Build prompt
        prompt = f"""
        You are an AI tutor creating lesson content.

        Lesson Title: {blueprint.get("title")}
        Grade Level: {blueprint.get("grade_level")}
        Scope: {blueprint.get("scope")}

        Learning Objective:
        {lo.get("objective")}

        Generate structured lesson content:
        - Clear explanation
        - Simple language for Grade 8
        - Include examples
        - Stay within scope
        - 200-300 words
        """

        # Generate content
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return {
            "lesson_id": lesson_id,
            "lesson_title": blueprint.get("title"),
            "learning_objective_id": lo_id,
            "learning_objective": lo.get("objective"),
            "content": response.text
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
