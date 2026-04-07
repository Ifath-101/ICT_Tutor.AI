import os
import sys

# Add current dir to path to find agents
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.content_agent import get_content

try:
    print(get_content('lesson1', 'LO1'))
except Exception as e:
    import traceback
    traceback.print_exc()
