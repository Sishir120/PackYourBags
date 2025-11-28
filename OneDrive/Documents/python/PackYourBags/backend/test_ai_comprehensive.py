"""
Comprehensive test script to verify AI service with your provided API key
"""
import os
from dotenv import load_dotenv
from ai_service import AIService

def test_ai_service_comprehensive():
    """Test the AI service with a comprehensive approach"""
    print("Loading environment variables...")
    load_dotenv()
    
    # Check environment variables
    api_key = os.getenv('AI_API_KEY')
    provider = os.getenv('AI_PROVIDER')
    model = os.getenv('AI_MODEL')
    
    print(f"AI_API_KEY: {api_key[:10]}...{api_key[-10:] if api_key else 'None'}")
    print(f"AI_PROVIDER: {provider}")
    print(f"AI_MODEL: {model}")
    
    # Create AI service instance
    ai_service = AIService()
    
    print(f"\nAI Service attributes:")
    print(f"  api_key: {ai_service.api_key[:10]}...{ai_service.api_key[-10:] if ai_service.api_key else 'None'}")
    print(f"  provider: {ai_service.provider}")
    
    # Test if API key is properly loaded
    if not ai_service.api_key or ai_service.api_key == 'your_api_key_here':
        print("❌ AI service not properly configured - API key not loaded")
        return
    
    if ai_service.api_key.startswith('sk-or-'):
        print("✅ Using OpenRouter API key")
    else:
        print("⚠️  Not using OpenRouter API key")
    
    # Test chat functionality
    try:
        print("\nTesting chat_with_ai...")
        response = ai_service.chat_with_ai("What are the top 3 things to do in Paris?")
        print("✅ AI Response received:")
        print(response[:200] + "..." if len(response) > 200 else response)
        print("\n" + "="*50 + "\n")
    except Exception as e:
        print(f"❌ Error in chat_with_ai: {e}")
    
    # Test text generation
    try:
        print("Testing generate_text...")
        prompt = "Write a short travel blog introduction about the beauty of Bali"
        response = ai_service.generate_text(prompt, max_tokens=300)
        print("✅ Text Generation Response received:")
        print(response[:200] + "..." if len(response) > 200 else response)
        print("\n" + "="*50 + "\n")
    except Exception as e:
        print(f"❌ Error in generate_text: {e}")

if __name__ == '__main__':
    test_ai_service_comprehensive()