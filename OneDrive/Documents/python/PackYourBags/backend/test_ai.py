"""Test AI service functionality"""
import os
from dotenv import load_dotenv  # type: ignore

# Load environment
load_dotenv()

print("=" * 60)
print("AI SERVICE TEST")
print("=" * 60)

# Check environment
api_key = os.getenv('AI_API_KEY', '')
provider = os.getenv('AI_PROVIDER', 'openai')
model = os.getenv('AI_MODEL', 'gpt-3.5-turbo')

print(f"\n✓ Provider: {provider}")
print(f"✓ Model: {model}")
print(f"✓ API Key configured: {'Yes' if api_key and api_key != 'your_api_key_here' else 'No'}")
print(f"✓ API Key length: {len(api_key)} characters")

# Test AI service import
try:
    from ai_service import ai_service
    print(f"\n✓ AI Service imported successfully")
    print(f"✓ Service provider: {ai_service.provider}")
    print(f"✓ Service API key set: {bool(ai_service.api_key)}")
except Exception as e:
    print(f"\n✗ Failed to import AI service: {e}")
    exit(1)

# Test simple chat
print("\n" + "-" * 60)
print("Testing AI Chat...")
print("-" * 60)

try:
    response = ai_service.chat_with_ai(
        message="What are the top 3 things to do in Bali?",
        context={"destination": "Bali", "budget": "mid-range"}
    )
    print(f"\n✓ Chat response received:")
    print(f"{response[:200]}..." if len(response) > 200 else response)
except Exception as e:
    print(f"\n✗ Chat test failed: {e}")

# Test blog generation
print("\n" + "-" * 60)
print("Testing Blog Generator...")
print("-" * 60)

try:
    from services.blog_generator import blog_generator
    print("✓ Blog generator imported")
    
    # Test with mock data
    mock_dest = {
        'name': 'Bali',
        'country': 'Indonesia',
        'continent': 'Asia',
        'highlights': ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach'],
        'best_season': 'April to October',
        'budget_tier': 'mid-range',
        'quick_fact': 'Island of gods'
    }
    
    print("\nGenerating sample blog post...")
    result = blog_generator.generate_blog_post(
        destination_name='Bali',
        category='Adventure',
        destination_data=mock_dest
    )
    
    if result['success']:
        print(f"✓ Blog generated successfully!")
        print(f"  Title: {result['blog']['title']}")
        print(f"  Excerpt: {result['blog']['excerpt'][:100]}...")
    else:
        print(f"✗ Blog generation failed: {result.get('error')}")
        
except Exception as e:
    print(f"✗ Blog generator test failed: {e}")

print("\n" + "=" * 60)
print("AI TEST COMPLETE")
print("=" * 60)
