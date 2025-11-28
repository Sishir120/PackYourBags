"""
Script to verify and update destination budget data with accurate real-world information
"""
from app import create_app
from database import db
from models import Destination

# Real-world budget data for destinations (per person per day)
# Source: Travel websites, tourism boards, and travel blogs
ACCURATE_BUDGET_DATA = {
    "Pokhara": {
        "budget_tier": "budget-friendly",
        "daily_budget": 25,  # USD
        "description": "Budget-friendly destination with affordable accommodations and local food"
    },
    "Kathmandu": {
        "budget_tier": "budget-friendly",
        "daily_budget": 30,  # USD
        "description": "Very affordable with budget hotels and street food options"
    },
    "Zanzibar": {
        "budget_tier": "mid-range",
        "daily_budget": 75,  # USD
        "description": "Mid-range destination with mix of budget and luxury options"
    },
    "Great Barrier Reef": {
        "budget_tier": "luxury",
        "daily_budget": 200,  # USD
        "description": "Luxury destination with high-end resorts and activities"
    },
    "Fiji Islands": {
        "budget_tier": "luxury",
        "daily_budget": 150,  # USD
        "description": "Luxury island destination with resort stays"
    }
}

def update_destination_budget_data():
    """Update destination budget data with accurate real-world information"""
    app = create_app()
    
    with app.app_context():
        print("Updating destination budget data with accurate real-world information...")
        print("=" * 70)
        
        updated_count = 0
        
        for dest_name, budget_info in ACCURATE_BUDGET_DATA.items():
            # Find destination by name
            dest = Destination.query.filter_by(name=dest_name).first()
            
            if dest:
                # Update budget information
                old_budget_tier = dest.budget_tier
                dest.budget_tier = budget_info["budget_tier"]
                
                # Update quick fact to include budget information
                budget_description = f"Daily budget: ${budget_info['daily_budget']} per person. {budget_info['description']}"
                dest.quick_fact = budget_description
                
                updated_count += 1
                print(f"✓ Updated {dest_name}")
                print(f"  Budget tier: {old_budget_tier} → {budget_info['budget_tier']}")
                print(f"  Daily budget: ${budget_info['daily_budget']}")
                print()
            else:
                print(f"✗ Destination '{dest_name}' not found")
                print()
        
        # Commit changes
        if updated_count > 0:
            db.session.commit()
            print(f"Successfully updated budget data for {updated_count} destinations!")
        else:
            print("No destinations were updated.")

if __name__ == '__main__':
    update_destination_budget_data()