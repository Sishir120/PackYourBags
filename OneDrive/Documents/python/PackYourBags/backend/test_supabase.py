"""
Test script for Supabase integration
"""
import os
import sys

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from services.supabase_service import supabase_service

def test_supabase_integration():
    """Test Supabase integration"""
    print("Testing Supabase integration...")
    
    # Check if Supabase is available
    if not supabase_service.is_available():
        print("❌ Supabase service is not available")
        print("Please check your configuration and ensure the supabase package is installed")
        return False
    
    print("✅ Supabase service is available")
    print(f"Supabase URL: {supabase_service.url}")
    
    # Test client initialization
    try:
        client = supabase_service._get_client()
        if client:
            print("✅ Supabase client initialized successfully")
        else:
            print("❌ Failed to initialize Supabase client")
            return False
    except Exception as e:
        print(f"❌ Error initializing Supabase client: {e}")
        return False
    
    print("✅ Supabase integration test completed successfully")
    return True

if __name__ == "__main__":
    test_supabase_integration()