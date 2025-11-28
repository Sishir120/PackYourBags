"""
Test all AI endpoints to verify they're working with your API key
"""
import requests
import json

def test_ai_chat_message():
    """Test the AI chat message endpoint"""
    url = "http://localhost:5000/api/ai-chat/message"
    
    payload = {
        "message": "Create a 3-day itinerary for Paris"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print("AI Chat Message Test:")
        print(f"  Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Success: {data['success']}")
            print(f"  Response: {data['response'][:100]}...")
            print(f"  Is Premium: {data['is_premium']}")
        else:
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"  Error: {e}")

def test_ai_travel_plan():
    """Test the AI travel plan endpoint"""
    url = "http://localhost:5000/api/ai/travel-plan"
    
    payload = {
        "destination_id": "dest_001"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print("\nAI Travel Plan Test:")
        print(f"  Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Success: {data.get('success', 'N/A')}")
            if 'plan' in data:
                print(f"  Plan Type: {type(data['plan'])}")
            elif 'fallback' in data:
                print(f"  Fallback Plan: {type(data['fallback'])}")
        else:
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"  Error: {e}")

def test_ai_blog_generation():
    """Test the AI blog generation endpoint"""
    url = "http://localhost:5000/api/ai/blogs/generate"
    
    payload = {
        "destination_name": "Tokyo",
        "category": "Adventure",
        "keywords": "technology, culture, food"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print("\nAI Blog Generation Test:")
        print(f"  Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Success: {data['success']}")
            if 'content' in data:
                print(f"  Content Length: {len(data['content'])} characters")
        elif response.status_code == 401:
            print("  Authentication required (expected for admin endpoints)")
        else:
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"  Error: {e}")

if __name__ == '__main__':
    test_ai_chat_message()
    test_ai_travel_plan()
    test_ai_blog_generation()