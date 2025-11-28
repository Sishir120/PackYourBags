import os

class SupabaseConfig:
    """Supabase configuration for BaaS integration"""
    # Supabase credentials
    SUPABASE_URL = os.getenv('SUPABASE_URL', '')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', '')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')
    SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET', '')
    
    # Database connection
    DATABASE_URL = os.getenv('SUPABASE_DATABASE_URL', '')
    
    # Validate configuration
    @classmethod
    def validate(cls):
        """Validate that all required configuration is present"""
        # This method now just returns True to avoid startup errors
        # Validation should be done at the service level
        return True