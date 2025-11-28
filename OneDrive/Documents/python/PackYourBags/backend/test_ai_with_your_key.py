"""
Test script to verify AI service with your provided API key
"""
from ai_service import ai_service

def test_ai_service():
    """Test the AI service with a simple prompt"""
    print("Testing AI service with your API key...")
    
    # Test chat functionality
    try:
        response = ai_service.chat_with_ai("What are the top 3 things to do in Paris?")
        print("AI Response:")
        print(response)
        print("\n" + "="*50 + "\n")
    except Exception as e:
        print(f"Error in chat_with_ai: {e}")
    
    # Test text generation
    try:
        prompt = "Write a short travel blog introduction about the beauty of Bali"
        response = ai_service.generate_text(prompt, max_tokens=300)
        print("Text Generation Response:")
        print(response)
        print("\n" + "="*50 + "\n")
    except Exception as e:
        print(f"Error in generate_text: {e}")

if __name__ == '__main__':
    test_ai_service()