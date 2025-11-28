"""
Test the AI chat endpoint directly
"""
import requests
import json
import os
# from dotenv import load_dotenv
from ai_service import AIService

def test_ai_service_directly():
    """Test the AI service directly"""
    print("Testing AI Service Directly:")
    # load_dotenv()
    
    # Create new AI service instance
    ai_service = AIService()
    
    print(f"API Key: {ai_service.api_key[:10] if ai_service.api_key else 'None'}...")
    print(f"Provider: {ai_service.provider}")
    
    if ai_service.api_key and ai_service.api_key != 'your_api_key_here':
        try:
            response = ai_service.chat_with_ai("What are the top 3 things to do in Bali?")
            print("Direct AI Response:")
            print(response[:300] + "..." if len(response) > 300 else response)
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("AI service not properly configured")

def test_ai_chat_endpoint():
    """Test the AI chat system info endpoint"""
    url = "http://localhost:5000/api/ai-chat/system-info"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_ai_chat_message():
    """Test the AI chat message endpoint"""
    url = "http://localhost:5000/api/ai-chat/message"
    
    payload = {
        "message": "What are the top 3 things to do in Bali?"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_ai_service_directly()
    print("\n" + "="*50)
    print("Testing AI Chat System Info Endpoint:")
    test_ai_chat_endpoint()
    print("\nTesting AI Chat Message Endpoint:")
    test_ai_chat_message()