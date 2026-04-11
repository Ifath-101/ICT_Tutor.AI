import json
from lessons.catalog import load_blueprint
from services.llm_service import generate_chat_response
from services.rag_service import find_global_context

def format_blueprint(blueprint: dict) -> str:
    """Formats a single blueprint into a string context."""
    lines = []
    lines.append(f"Title: {blueprint.get('title')}")
    lines.append(f"Main Topic: {blueprint.get('main_topic')}")
    lines.append(f"Scope: {blueprint.get('scope')}")
    
    los = blueprint.get('learning_objectives', {})
    if los:
        lines.append("Learning Objectives:")
        for lo_id, lo_data in los.items():
            lines.append(f" - {lo_id}: {lo_data.get('objective')}")
    return "\n".join(lines)


def process_chat(message_history: list[dict]) -> str:
    """
    Processes the chat history, uses vector search to identify the likely topic,
    loads the specific lesson blueprint and textbook chunks, and returns the AI's response.
    """
    # 1. Identify the user's latest active query
    # Find the last message from the user
    user_query = "What are you learning today?"
    for msg in reversed(message_history):
        if msg.get("role") == "user":
            user_query = msg.get("content")
            break
            
    # 2. Semantic search against the ICT syllabus database
    rag_result = find_global_context(user_query, n_results=2)
    
    # 3. Decision routing
    DISTANCE_THRESHOLD = 1.6 # Chroma distances > 1.6 usually mean low semantic match for all-MiniLM-L6-v2
    
    dynamic_context = ""
    
    if rag_result["distance"] < DISTANCE_THRESHOLD and rag_result["lesson_id"]:
        lid = rag_result["lesson_id"]
        try:
            blueprint = load_blueprint(lid)
            bp_str = format_blueprint(blueprint)
            dynamic_context = f"\nRelevant Lesson Blueprint:\n{bp_str}\n\nRelevant Textbook Excerpts (Use to answer questions):\n{rag_result['context']}"
        except Exception:
            # If blueprint is missing, just use the RAG context
            dynamic_context = f"\nRelevant Textbook Excerpts (Use to answer questions):\n{rag_result['context']}"
    else:
        # Generic context when off-topic or greeting
        dynamic_context = "\nNote: The user request is either a greeting or outside the current database. If outside, gently redirect them to ICT subjects."

    system_prompt = f"""You are a helpful and strict AI ICT Tutor.
Your goal is to help students learn ICT concepts by chatting with them.
You must STRICTLY adhere to the provided lesson blueprint and excerpts below. 
Do not answer questions or discuss topics outside of this syllabus scope. 
If a student asks something unrelated or outside the scope, politely redirect them back to the syllabus topics.
When answering, be conversational, engaging, pedagogical, and encouraging. Ask follow-up questions to test their understanding when appropriate.
{dynamic_context}
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    # Ensure message history is valid and role/content are properly formatted
    for msg in message_history:
        role = msg.get("role")
        content = msg.get("content")
        if role in ["user", "assistant", "system"] and content:
            messages.append({"role": role, "content": content})

    return generate_chat_response(messages)
