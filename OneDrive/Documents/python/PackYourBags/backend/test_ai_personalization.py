"""
Test script for AI personalization and hallucination reduction
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_service import ai_service

def test_personalized_response():
    """Test AI with user personalization data"""
    
    # Sample user data for testing
    user_data = {
        "preferences": {
            "budget": "mid-range",
            "travel_style": ["adventure", "culture"],
            "preferred_activities": ["hiking", "museums", "local_food"],
            "continents": ["Asia", "Europe"]
        },
        "travel_history": ["Thailand", "Italy", "Japan"],
        "subscription_tier": "premium"
    }
    
    # Test message
    message = "I want to plan a trip to a new destination. What would you recommend based on my travel history?"
    
    print("Testing AI personalization...")
    print("=" * 50)
    print(f"User Preferences: {user_data['preferences']}")
    print(f"Travel History: {user_data['travel_history']}")
    print(f"Subscription Tier: {user_data['subscription_tier']}")
    print("-" * 50)
    print(f"Message: {message}")
    print("-" * 50)
    
    # Test the AI response with personalization
    response = ai_service.chat_with_ai(
        message=message,
        context={"user_type": "premium", "platform": "PackYourBags"},
        user_data=user_data
    )
    
    print("AI Response:")
    print(response)
    print("=" * 50)
    
    # Check for personalization elements
    response_lower = response.lower()
    personalization_indicators = [
        "based on your travel history",
        "considering your preferences",
        "since you've visited",
        "similar to",
        "recommend",
        "adventure",
        "culture",
        "asia",
        "europe"
    ]
    
    print("Personalization Check:")
    for indicator in personalization_indicators:
        if indicator in response_lower:
            print(f"✓ Found: '{indicator}'")
        else:
            print(f"○ Not found: '{indicator}'")
    
    print("=" * 50)

def test_hallucination_prevention():
    """Test AI to ensure it doesn't hallucinate facts"""
    
    # Test with a question that might lead to hallucination
    message = "What is the population of the city Xyzzyx in country Blorgonia?"
    
    print("Testing hallucination prevention...")
    print("=" * 50)
    print(f"Message: {message}")
    print("-" * 50)
    
    response = ai_service.chat_with_ai(
        message=message,
        context={"user_type": "free", "platform": "PackYourBags"}
    )
    
    print("AI Response:")
    print(response)
    print("-" * 50)
    
    # Check for hallucination prevention
    response_lower = response.lower()
    hallucination_indicators = [
        "i don't have information",
        "i'm not certain",
        "i cannot verify",
        "official sources",
        "travel advisories",
        "recommend checking"
    ]
    
    print("Hallucination Prevention Check:")
    found_prevention = False
    for indicator in hallucination_indicators:
        if indicator in response_lower:
            print(f"✓ Found prevention phrase: '{indicator}'")
            found_prevention = True
        else:
            print(f"○ Not found: '{indicator}'")
    
    if not found_prevention:
        print("⚠ WARNING: No hallucination prevention phrases detected!")
    
    print("=" * 50)

def test_travel_focus():
    """Test that AI stays focused on travel topics"""
    
    # Test with a non-travel question
    message = "What is the best recipe for chocolate cake?"
    
    print("Testing travel focus...")
    print("=" * 50)
    print(f"Message: {message}")
    print("-" * 50)
    
    response = ai_service.chat_with_ai(
        message=message,
        context={"user_type": "free", "platform": "PackYourBags"}
    )
    
    print("AI Response:")
    print(response)
    print("-" * 50)
    
    # Check for travel redirection
    response_lower = response.lower()
    redirection_indicators = [
        "travel assistant",
        "travel-related",
        "adventure",
        "trip",
        "destination",
        "travel plan"
    ]
    
    print("Travel Focus Check:")
    found_redirection = False
    for indicator in redirection_indicators:
        if indicator in response_lower:
            print(f"✓ Found redirection phrase: '{indicator}'")
            found_redirection = True
        else:
            print(f"○ Not found: '{indicator}'")
    
    if not found_redirection:
        print("⚠ WARNING: No travel redirection detected!")
    
    print("=" * 50)

if __name__ == "__main__":
    print("AI Personalization and Hallucination Prevention Test")
    print("=" * 60)
    
    # Run all tests
    test_personalized_response()
    test_hallucination_prevention()
    test_travel_focus()
    
    print("All tests completed!")