"""
Test the AI endpoint directly
"""
import requests
import json

def test_ai_endpoint():
    """Test the AI chat endpoint"""
    url = "http://localhost:5000/api/ai/chat"
    
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
    test_ai_endpoint()