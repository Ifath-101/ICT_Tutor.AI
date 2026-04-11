import json
from lessons.catalog import list_lessons, load_blueprint
from services.llm_service import generate_chat_response

def get_syllabus_context() -> str:
    """Loads all available lesson blueprints and formats them as a string context."""
    lessons = list_lessons()
    context_lines = ["Available ICT Syllabus Context:"]
    
    for lesson in lessons:
        lid = lesson["lesson_id"]
        try:
            blueprint = load_blueprint(lid)
            # Summarize blueprint to save tokens and maintain focus
            context_lines.append(f"\nLesson ID: {lid}")
            context_lines.append(f"Title: {blueprint.get('title')}")
            context_lines.append(f"Main Topic: {blueprint.get('main_topic')}")
            context_lines.append(f"Scope: {blueprint.get('scope')}")
            
            los = blueprint.get('learning_objectives', {})
            for lo_id, lo_data in los.items():
                context_lines.append(f" - {lo_id}: {lo_data.get('objective')}")
        except Exception:
            pass

    return "\n".join(context_lines)


def process_chat(message_history: list[dict]) -> str:
    """
    Processes the chat history, injects system prompts constraining the AI
    to the syllabus, and returns the AI's string response.
    """
    syllabus_context = get_syllabus_context()

    system_prompt = f"""You are a helpful and strict AI ICT Tutor.
Your goal is to help students learn ICT concepts by chatting with them.
You must STRICTLY adhere to the lesson blueprints provided below. 
Do not answer questions or discuss topics outside of this syllabus scope. 
If a student asks something unrelated or outside the scope, politely redirect them back to the syllabus topics.
When answering, be conversational, engaging, pedagogical, and encouraging. Ask follow-up questions to test their understanding when appropriate.

{syllabus_context}
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Ensure message history is valid and role/content are properly formatted
    for msg in message_history:
        role = msg.get("role")
        content = msg.get("content")
        if role in ["user", "assistant", "system"] and content:
            messages.append({"role": role, "content": content})

    return generate_chat_response(messages)
