"""
Migration script to move data from SQLite to Supabase
"""
import os
import sys

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__)))

from services.supabase_service import supabase_service
from database import db, init_db
from models import User, Destination, Blog, Subscriber, Itinerary
from app import create_app
from datetime import datetime

def migrate_users_to_supabase():
    """Migrate users from SQLite to Supabase"""
    if not supabase_service.is_available():
        print("❌ Supabase service not available")
        return False
    
    app = create_app()
    
    with app.app_context():
        # Get all users from SQLite
        users = User.query.all()
        print(f"Found {len(users)} users to migrate")
        
        migrated_count = 0
        for user in users:
            try:
                # Prepare user data for Supabase
                user_data = {
                    "id": str(user.id),  # Supabase uses UUID, SQLite uses integer
                    "email": user.email,
                    "name": user.name or "",
                    "subscription_tier": user.subscription_tier or "free",
                    "ai_credits": user.ai_credits or 10,
                    "total_ai_queries": user.total_ai_queries or 0,
                    "preferences": user.preferences or {},
                    "travel_history": user.travel_history or [],
                    "created_at": user.created_at.isoformat() if user.created_at else datetime.utcnow().isoformat()
                }
                
                # Insert into Supabase
                client = supabase_service._get_client()
                if client:
                    result = client.table("users").insert(user_data).execute()
                    if result:
                        migrated_count += 1
                        print(f"✅ Migrated user: {user.email}")
                
            except Exception as e:
                print(f"❌ Error migrating user {user.email}: {e}")
                continue
        
        print(f"✅ Migrated {migrated_count}/{len(users)} users to Supabase")
        return True

def migrate_subscribers_to_supabase():
    """Migrate subscribers from SQLite to Supabase"""
    if not supabase_service.is_available():
        print("❌ Supabase service not available")
        return False
    
    app = create_app()
    
    with app.app_context():
        # Get all subscribers from SQLite
        subscribers = Subscriber.query.all()
        print(f"Found {len(subscribers)} subscribers to migrate")
        
        migrated_count = 0
        for subscriber in subscribers:
            try:
                # Prepare subscriber data for Supabase
                subscriber_data = {
                    "id": subscriber.subscriber_id,
                    "email": subscriber.email,
                    "preferences": subscriber.preferences or {},
                    "tier": subscriber.tier or "free",
                    "subscription_status": subscriber.subscription_status or "active",
                    "email_subscribed": subscriber.email_subscribed or True,
                    "engagement_score": subscriber.engagement_score or 0,
                    "subscribed_at": subscriber.subscribed_at.isoformat() if subscriber.subscribed_at else datetime.utcnow().isoformat()
                }
                
                # Insert into Supabase (you might need a subscribers table in Supabase)
                # This is just an example - adjust based on your Supabase schema
                print(f"ℹ️  Would migrate subscriber: {subscriber.email} (implement your Supabase table)")
                migrated_count += 1
                
            except Exception as e:
                print(f"❌ Error migrating subscriber {subscriber.email}: {e}")
                continue
        
        print(f"✅ Processed {migrated_count}/{len(subscribers)} subscribers")
        return True

def main():
    """Main migration function"""
    print("🚀 Starting migration from SQLite to Supabase...")
    
    # Test Supabase connection first
    if not supabase_service.is_available():
        print("❌ Supabase service is not available. Please check your configuration.")
        return
    
    print("✅ Supabase connection successful")
    
    # Migrate users
    print("\n👥 Migrating users...")
    migrate_users_to_supabase()
    
    # Migrate subscribers
    print("\n📧 Migrating subscribers...")
    migrate_subscribers_to_supabase()
    
    print("\n✅ Migration process completed!")
    print("\n📝 Next steps:")
    print("1. Verify data in your Supabase dashboard")
    print("2. Update your application to use Supabase for new operations")
    print("3. Optionally, keep SQLite as backup during transition")

if __name__ == "__main__":
    main()