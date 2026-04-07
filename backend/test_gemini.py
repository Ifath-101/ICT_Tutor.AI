import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.llm_service import client, MODEL_NAME
from google.genai import errors

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents="Hello"
    )
    print("SUCCESS")
    print(response.text)
except errors.APIError as e:
    print(f"APIERROR: {e.message}")
    print(e)
except Exception as e:
    import traceback
    traceback.print_exc()
