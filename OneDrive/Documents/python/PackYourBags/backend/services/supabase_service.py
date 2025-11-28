"""
Supabase Service for PackYourBags
Handles authentication, database operations, and subscription management with Supabase BaaS
"""
import os
from typing import Optional, Dict, Any
from config import config
from datetime import datetime, timedelta
from supabase_config import SupabaseConfig

class SupabaseService:
    def __init__(self):
        """Initialize Supabase client"""
        self.url = SupabaseConfig.SUPABASE_URL
        self.key = SupabaseConfig.SUPABASE_KEY
        self.service_key = SupabaseConfig.SUPABASE_SERVICE_KEY
        
        # Check if Supabase is configured
        if not self.url or not self.key:
            print("Supabase URL and Key not configured. Supabase integration will be disabled.")
            self.available = False
            return
            
        # Check if supabase package is available
        try:
            __import__('supabase')
            self.available = True
            print("Supabase service ready for initialization")
        except ImportError:
            print("Supabase client not installed. Please install supabase package.")
            self.available = False
    
    def is_available(self):
        """Check if Supabase service is available"""
        return self.available and self.url and self.key
    
    def _get_client(self):
        """Get Supabase client instance"""
        if not self.is_available():
            return None
            
        try:
            # Dynamic import to avoid import errors
            import importlib
            supabase_module = importlib.import_module('supabase')
            create_client = getattr(supabase_module, 'create_client')
            return create_client(self.url, self.key)
        except:
            return None
    
    def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user with email and password"""
        if not self.is_available():
            return {
                "success": False,
                "error": "Supabase service not available"
            }
            
        try:
            client = self._get_client()
            if not client:
                return {
                    "success": False,
                    "error": "Failed to initialize Supabase client"
                }
                
            response = client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return {
                "success": True,
                "user": response.user,
                "session": response.session
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def register_user(self, email: str, password: str, name: str = "") -> Dict[str, Any]:
        """Register a new user"""
        if not self.is_available():
            return {
                "success": False,
                "error": "Supabase service not available"
            }
            
        try:
            client = self._get_client()
            if not client:
                return {
                    "success": False,
                    "error": "Failed to initialize Supabase client"
                }
                
            # Sign up the user
            response = client.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "name": name,
                        "subscription_tier": "free",
                        "ai_credits": 10,
                        "total_ai_queries": 0
                    }
                }
            })
            
            # Insert user data into users table
            if response.user:
                user_data = {
                    "id": response.user.id,
                    "email": email,
                    "name": name,
                    "subscription_tier": "free",
                    "ai_credits": 10,
                    "total_ai_queries": 0,
                    "created_at": datetime.utcnow().isoformat()
                }
                
                client.table("users").insert(user_data).execute()
            
            return {
                "success": True,
                "user": response.user,
                "session": response.session
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user profile information"""
        if not self.is_available():
            return {
                "success": False,
                "error": "Supabase service not available"
            }
            
        try:
            client = self._get_client()
            if not client:
                return {
                    "success": False,
                    "error": "Failed to initialize Supabase client"
                }
                
            response = client.table("users").select("*").eq("id", user_id).execute()
            if response.data:
                return {
                    "success": True,
                    "user": response.data[0]
                }
            else:
                return {
                    "success": False,
                    "error": "User not found"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def update_ai_credits(self, user_id: str, credits_used: int = 1) -> Dict[str, Any]:
        """Update user's AI credits"""
        if not self.is_available():
            return {
                "success": False,
                "error": "Supabase service not available"
            }
            
        try:
            client = self._get_client()
            if not client:
                return {
                    "success": False,
                    "error": "Failed to initialize Supabase client"
                }
                
            # Get current user data
            user_response = client.table("users").select("ai_credits, subscription_tier, total_ai_queries").eq("id", user_id).execute()
            
            if not user_response.data:
                return {
                    "success": False,
                    "error": "User not found"
                }
            
            user = user_response.data[0]
            
            # Check if user is premium or deepseek (unlimited credits)
            is_premium = user["subscription_tier"] == "premium"
            is_deepseek = user["subscription_tier"] == "deepseek"
            
            if is_premium or is_deepseek:
                # Just increment total queries for premium users
                new_total_queries = user["total_ai_queries"] + 1
                client.table("users").update({
                    "total_ai_queries": new_total_queries,
                    "updated_at": datetime.utcnow().isoformat()
                }).eq("id", user_id).execute()
                
                return {
                    "success": True,
                    "credits_remaining": "unlimited",
                    "total_queries": new_total_queries,
                    "is_premium": is_premium,
                    "is_deepseek": is_deepseek
                }
            
            # For free users, check and deduct credits
            current_credits = user["ai_credits"]
            if current_credits < credits_used:
                return {
                    "success": False,
                    "error": "Insufficient AI credits",
                    "credits_remaining": current_credits
                }
            
            # Update credits and total queries
            new_credits = current_credits - credits_used
            new_total_queries = user["total_ai_queries"] + 1
            
            client.table("users").update({
                "ai_credits": new_credits,
                "total_ai_queries": new_total_queries,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", user_id).execute()
            
            return {
                "success": True,
                "credits_remaining": new_credits,
                "total_queries": new_total_queries,
                "is_premium": False
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_subscription_status(self, user_id: str) -> Dict[str, Any]:
        """Get user's subscription status"""
        if not self.is_available():
            return {
                "success": False,
                "error": "Supabase service not available"
            }
            
        try:
            client = self._get_client()
            if not client:
                return {
                    "success": False,
                    "error": "Failed to initialize Supabase client"
                }
                
            response = client.table("users").select("subscription_tier, ai_credits, total_ai_queries").eq("id", user_id).execute()
            
            if response.data:
                user = response.data[0]
                is_premium = user["subscription_tier"] == "premium"
                is_deepseek = user["subscription_tier"] == "deepseek"
                
                return {
                    "success": True,
                    "subscription": {
                        "subscription_tier": user["subscription_tier"],
                        "credits": "unlimited" if (is_premium or is_deepseek) else user["ai_credits"],
                        "total_queries": user["total_ai_queries"],
                        "is_premium": is_premium,
                        "is_deepseek": is_deepseek
                    }
                }
            else:
                return {
                    "success": False,
                    "error": "User not found"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def upgrade_subscription(self, user_id: str, tier: str = "premium") -> Dict[str, Any]:
        """Upgrade user's subscription tier"""
        if not self.is_available():
            return {
                "success": False,
                "error": "Supabase service not available"
            }
            
        # Validate tier
        valid_tiers = ["free", "premium", "deepseek"]
        if tier not in valid_tiers:
            return {
                "success": False,
                "error": f"Invalid tier. Valid options: {', '.join(valid_tiers)}"
            }
            
        try:
            client = self._get_client()
            if not client:
                return {
                    "success": False,
                    "error": "Failed to initialize Supabase client"
                }
                
            update_data = {
                "subscription_tier": tier,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            # If upgrading to premium or deepseek, set credits to unlimited (we'll track as "unlimited" in logic)
            if tier in ["premium", "deepseek"]:
                update_data["subscription_expires"] = (datetime.utcnow() + timedelta(days=30)).isoformat()
                # For premium tiers, set effectively unlimited credits
                update_data["ai_credits"] = "999999"
            else:
                # Reset to default free credits if downgrading
                if tier == "free":
                    update_data["ai_credits"] = "10"
            
            client.table("users").update(update_data).eq("id", user_id).execute()
            
            return {
                "success": True,
                "message": f"Subscription upgraded to {tier}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

# Global instance - gracefully handle initialization
try:
    supabase_service = SupabaseService()
except Exception as e:
    print(f"Warning: Supabase service initialization failed: {e}")
    # Create a dummy service that's always unavailable
    class DummySupabaseService:
        def is_available(self):
            return False
        def authenticate_user(self, *args, **kwargs):
            return {"success": False, "error": "Supabase service not available"}
        def register_user(self, *args, **kwargs):
            return {"success": False, "error": "Supabase service not available"}
        def get_user_profile(self, *args, **kwargs):
            return {"success": False, "error": "Supabase service not available"}
        def update_ai_credits(self, *args, **kwargs):
            return {"success": False, "error": "Supabase service not available"}
        def get_subscription_status(self, *args, **kwargs):
            return {"success": False, "error": "Supabase service not available"}
        def upgrade_subscription(self, *args, **kwargs):
            return {"success": False, "error": "Supabase service not available"}
    supabase_service = DummySupabaseService()