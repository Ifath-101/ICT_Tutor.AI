from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

try:
    for m in client.models.list_models():
        if "embedContent" in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(e)
