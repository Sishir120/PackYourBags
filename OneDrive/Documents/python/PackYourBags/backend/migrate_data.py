"""
Data migration script to import existing JSON data into PostgreSQL/SQLite database
"""
import json
import os
from database import db
from models import Destination, Subscriber
from app import create_app

def migrate_destinations():
    """Migrate destinations from JSON to database"""
    print("Migrating destinations...")
    
    json_file = os.path.join(os.path.dirname(__file__), 'data', 'destinations.json')
    
    with open(json_file, 'r', encoding='utf-8') as f:
        destinations_data = json.load(f)
    
    migrated = 0
    skipped = 0
    
    for dest_data in destinations_data:
        # Check if destination already exists
        existing = Destination.query.filter_by(destination_id=dest_data['id']).first()
        
        if existing:
            print(f"  Skipping {dest_data['name']} (already exists)")
            skipped += 1
            continue
        
        # Create new destination
        destination = Destination(
            destination_id=dest_data['id'],
            name=dest_data['name'],
            country=dest_data['country'],
            continent=dest_data['continent'],
            highlights=dest_data.get('highlights', []),
            quick_fact=dest_data.get('quick_fact', ''),
            best_season=dest_data.get('best_season', ''),
            budget_tier=dest_data.get('budget_tier', ''),
            description=dest_data.get('description', ''),
            local_tips=dest_data.get('local_tips', []),
            images=dest_data.get('images', []),
            latitude=dest_data.get('latitude'),
            longitude=dest_data.get('longitude')
        )
        
        db.session.add(destination)
        migrated += 1
        print(f"  ✓ Migrated {dest_data['name']}")
    
    db.session.commit()
    print(f"\nDestinations migration complete: {migrated} migrated, {skipped} skipped")

def migrate_subscribers():
    """Migrate subscribers from JSON to database"""
    print("\nMigrating subscribers...")
    
    json_file = os.path.join(os.path.dirname(__file__), 'data', 'subscribers.json')
    
    if not os.path.exists(json_file):
        print("  No subscribers file found. Skipping.")
        return
    
    with open(json_file, 'r', encoding='utf-8') as f:
        subscribers_data = json.load(f)
    
    migrated = 0
    skipped = 0
    
    for sub_data in subscribers_data:
        # Check if subscriber already exists
        existing = Subscriber.query.filter_by(email=sub_data['email']).first()
        
        if existing:
            print(f"  Skipping {sub_data['email']} (already exists)")
            skipped += 1
            continue
        
        # Create new subscriber
        subscriber = Subscriber(
            subscriber_id=sub_data['subscriber_id'],
            email=sub_data['email'],
            preferences=sub_data.get('preferences', {}),
            engagement_score=sub_data.get('engagement_score', 0),
            last_offer_sent=sub_data.get('last_offer_sent')
        )
        
        db.session.add(subscriber)
        migrated += 1
        print(f"  ✓ Migrated {sub_data['email']}")
    
    db.session.commit()
    print(f"\nSubscribers migration complete: {migrated} migrated, {skipped} skipped")

def run_migration():
    """Run all migrations"""
    app = create_app()
    
    with app.app_context():
        print("="*50)
        print("Starting data migration...")
        print("="*50)
        
        # Create tables if they don't exist
        db.create_all()
        print("✓ Database tables created/verified\n")
        
        # Run migrations
        migrate_destinations()
        migrate_subscribers()
        
        print("\n" + "="*50)
        print("Migration complete!")
        print("="*50)

if __name__ == '__main__':
    run_migration()