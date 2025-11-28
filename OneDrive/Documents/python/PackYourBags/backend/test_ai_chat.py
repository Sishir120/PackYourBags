import requests
import json

def test_ai_chat():
    url = "http://localhost:5000/api/ai-chat/message"
    
    payload = {
        "message": "What are the top 3 things to do in Paris?"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data['success']}")
            print(f"Response: {data['response'][:200]}...")
            print(f"Credits remaining: {data.get('credits_remaining', 'N/A')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ai_chat()