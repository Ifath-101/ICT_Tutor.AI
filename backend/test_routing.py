import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import agents.chat_agent

def mock_generate_chat(messages):
    print("\n[MOCK LLM CALLED]")
    print(f"System Prompt Length: {len(messages[0]['content'])}")
    print("System Context snippet:")
    print(messages[0]['content'][:200] + "...\n")
    if len(messages[0]['content']) > 250:
        print("Tail of System Context:")
        print(messages[0]['content'][-250:])
    return "MOCK_RESPONSE"

agents.chat_agent.generate_chat_response = mock_generate_chat

def test():
    print("--- TEST 1: Greeting ---")
    msg1 = [{"role": "user", "content": "Hi there"}]
    agents.chat_agent.process_chat(msg1)
    
    print("\n--- TEST 2: Biology ---")
    msg2 = [{"role": "user", "content": "Tell me about Biology"}]
    agents.chat_agent.process_chat(msg2)
    
    print("\n--- TEST 3: Hardware components ---")
    msg3 = [{"role": "user", "content": "Tell me about the components of a computer system"}]
    agents.chat_agent.process_chat(msg3)

if __name__ == '__main__':
    test()
