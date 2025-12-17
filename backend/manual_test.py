from backend.agents.content_agent import get_content
from backend.agents.student_model_agent import get_student_state
from backend.agents.question_agent import generate_question

print("CONTENT AGENT:")
print(get_content())

print("\nSTUDENT MODEL:")
print(get_student_state("demo"))

print("\nQUESTION AGENT:")
print(generate_question("What is ICT?", difficulty="easy"))
