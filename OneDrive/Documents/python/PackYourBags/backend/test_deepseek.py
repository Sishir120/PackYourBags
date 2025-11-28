"""
Test script for DeepSeek API integration
"""
import os
import sys
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from ai_service import ai_service

def test_deepseek_integration():
    """Test DeepSeek API integration"""
    print("Testing DeepSeek API integration...")
    
    # Check if DeepSeek is configured
    if ai_service.provider != 'deepseek':
        print(f"Current provider: {ai_service.provider}")
        print("Please set AI_PROVIDER=deepseek in your .env file to test DeepSeek")
        return
    
    print(f"Provider: {ai_service.provider}")
    print(f"API Key: {ai_service.api_key[:10]}..." if ai_service.api_key else "None")
    print(f"Model: {ai_service.model}")
    
    try:
        # Test a simple travel question
        message = "What are the top 3 things to do in Paris?"
        print(f"\nTesting with message: {message}")
        
        response = ai_service.chat_with_ai(message)
        print(f"Response: {response}")
        print("\nDeepSeek integration test completed successfully!")
        
    except Exception as e:
        print(f"Error testing DeepSeek integration: {str(e)}")
        print("Please check your API key and network connection.")

if __name__ == "__main__":
    test_deepseek_integration()