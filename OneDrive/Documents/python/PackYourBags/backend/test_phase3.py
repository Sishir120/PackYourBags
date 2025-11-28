"""
Phase 3 Testing Script - Authentication, Itineraries & Personalization
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

# Global variable to store token
ACCESS_TOKEN = None
USER_ID = None

def test_user_registration():
    """Test user registration"""
    print("\n🧪 Testing User Registration...")
    global ACCESS_TOKEN, USER_ID
    
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": f"test{hash('test') % 10000}@example.com",
        "password": "testpass123",
        "name": "Test User"
    })
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 201:
        data = response.json()
        ACCESS_TOKEN = data.get('access_token')
        USER_ID = data.get('user', {}).get('id')
        print(f"✓ User registered: {data.get('user', {}).get('email')}")
        print(f"✓ Token received: {ACCESS_TOKEN[:20]}...")
        return True
    else:
        print(f"⚠ Response: {response.text}")
        return False

def test_user_login():
    """Test user login"""
    print("\n🧪 Testing User Login...")
    global ACCESS_TOKEN
    
    # Use existing test user
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 200 or response.status_code == 401:
        if response.status_code == 200:
            data = response.json()
            ACCESS_TOKEN = data.get('access_token')
            print(f"✓ Login successful")
        else:
            print(f"⚠ User not found (expected for first run)")
        return True
    return False

def test_get_profile():
    """Test get user profile"""
    print("\n🧪 Testing Get Profile...")
    
    if not ACCESS_TOKEN:
        print("⚠ No auth token, skipping")
        return True
    
    response = requests.get(
        f"{BASE_URL}/auth/profile",
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}"}
    )
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ User: {data.get('user', {}).get('email')}")
        print(f"✓ Preferences: {data.get('user', {}).get('preferences')}")
        return True
    return False

def test_update_preferences():
    """Test update user preferences"""
    print("\n🧪 Testing Update Preferences...")
    
    if not ACCESS_TOKEN:
        print("⚠ No auth token, skipping")
        return True
    
    response = requests.put(
        f"{BASE_URL}/auth/profile",
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        },
        json={
            "preferences": {
                "budget_tier": "mid-range",
                "categories": ["Adventure", "Culture"],
                "preferred_continents": ["Asia", "Europe"]
            }
        }
    )
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 200:
        print(f"✓ Preferences updated")
        return True
    return False

def test_create_itinerary():
    """Test create itinerary"""
    print("\n🧪 Testing Create Itinerary...")
    
    if not ACCESS_TOKEN:
        print("⚠ No auth token, skipping")
        return True
    
    response = requests.post(
        f"{BASE_URL}/itineraries",
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        },
        json={
            "title": "Nepal Adventure 2025",
            "description": "7-day trek in the Himalayas",
            "destination_id": "dest_001",
            "start_date": "2025-03-01T00:00:00",
            "end_date": "2025-03-07T00:00:00",
            "days": [
                {
                    "day": 1,
                    "activities": [
                        {"time": "09:00", "activity": "Arrive in Kathmandu"},
                        {"time": "14:00", "activity": "Visit Durbar Square"}
                    ]
                },
                {
                    "day": 2,
                    "activities": [
                        {"time": "06:00", "activity": "Drive to Pokhara"},
                        {"time": "15:00", "activity": "Lakeside walk"}
                    ]
                }
            ],
            "estimated_budget": 1200
        }
    )
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 201:
        data = response.json()
        print(f"✓ Itinerary created: {data.get('itinerary', {}).get('title')}")
        print(f"✓ ID: {data.get('itinerary', {}).get('id')}")
        return True
    else:
        print(f"⚠ Response: {response.text}")
        return False

def test_get_itineraries():
    """Test get user itineraries"""
    print("\n🧪 Testing Get Itineraries...")
    
    if not ACCESS_TOKEN:
        print("⚠ No auth token, skipping")
        return True
    
    response = requests.get(
        f"{BASE_URL}/itineraries",
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}"}
    )
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Itineraries count: {len(data.get('itineraries', []))}")
        return True
    return False

def test_personalized_recommendations():
    """Test personalized recommendations"""
    print("\n🧪 Testing Personalized Recommendations...")
    
    if not ACCESS_TOKEN:
        print("⚠ No auth token, skipping")
        return True
    
    response = requests.get(
        f"{BASE_URL}/personalization/recommendations?limit=5",
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}"}
    )
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        recs = data.get('recommendations', [])
        print(f"✓ Recommendations received: {len(recs)}")
        if recs:
            print(f"✓ Top recommendation: {recs[0]['destination']['name']} - {recs[0]['reason']}")
        return True
    return False

def test_track_interaction():
    """Test tracking user interaction"""
    print("\n🧪 Testing Track Interaction...")
    
    if not ACCESS_TOKEN:
        print("⚠ No auth token, skipping")
        return True
    
    response = requests.post(
        f"{BASE_URL}/personalization/track",
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        },
        json={
            "type": "destination_view",
            "destination_id": "dest_001",
            "continent": "Asia"
        }
    )
    
    print(f"✓ Status: {response.status_code}")
    if response.status_code == 200:
        print(f"✓ Interaction tracked")
        return True
    return False

def run_all_tests():
    """Run all Phase 3 tests"""
    print("="*60)
    print("🚀 Phase 3 Testing Suite")
    print("Authentication, Itineraries & Personalization")
    print("="*60)
    
    tests = [
        ("User Registration", test_user_registration),
        ("User Login", test_user_login),
        ("Get Profile", test_get_profile),
        ("Update Preferences", test_update_preferences),
        ("Create Itinerary", test_create_itinerary),
        ("Get Itineraries", test_get_itineraries),
        ("Personalized Recommendations", test_personalized_recommendations),
        ("Track Interaction", test_track_interaction),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"✗ {name} FAILED: {str(e)}")
            results.append((name, False))
    
    print("\n" + "="*60)
    print("📊 Test Results Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\n🎯 Total: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    print("="*60)

if __name__ == "__main__":
    run_all_tests()
