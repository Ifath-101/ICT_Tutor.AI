import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.llm_service import client
try:
    for model in client.models.list():
        if "flash" in model.name:
            print(model.name)
except Exception as e:
    print("Error:", e)
