import json

# Researched accurate pricing data for Batch 4 (7-day trips or standard trek duration, including flights/travel)
researched_pricing = {
    "Inca Trail": {
        "budget": (799, 1299),
        "midrange": (1499, 2499),
        "luxury": (2999, 4999)
    },
    "Milford Track": {
        "budget": (1299, 1999),
        "midrange": (2499, 3999),
        "luxury": (4499, 6999)
    },
    "Tour du Mont Blanc": {
        "budget": (799, 1499),
        "midrange": (1699, 2799),
        "luxury": (2999, 4999)
    },
    "Appalachian Trail": {
        "budget": (499, 899),
        "midrange": (999, 1499),
        "luxury": (1999, 2999)
    },
    "Drakensberg Mountains": {
        "budget": (499, 899),
        "midrange": (999, 1699),
        "luxury": (1999, 2999)
    },
    "Torres del Paine": {
        "budget": (899, 1399),
        "midrange": (1899, 3499),
        "luxury": (3999, 5999)
    },
    "Mount Fuji": {
        "budget": (399, 699),
        "midrange": (799, 1299),
        "luxury": (1499, 2499)
    },
    "Buenos Aires": {
        "budget": (1099, 1499),
        "midrange": (1599, 2199),
        "luxury": (2499, 3999)
    }
}

# Load current destinations
with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

# Update pricing for destinations we've researched
updated_count = 0
for dest in destinations:
    dest_name = dest.get('name', '')
    
    if dest_name in researched_pricing:
        budget_tier = dest.get('budget_tier', 'mid-range')
        
        # Map budget tier to pricing key
        tier_key = 'budget' if budget_tier == 'budget-friendly' else ('luxury' if budget_tier == 'luxury' else 'midrange')
        
        price_min, price_max = researched_pricing[dest_name][tier_key]
        
        dest['price_range'] = {
            'min': price_min,
            'max': price_max
        }
        dest['estimated_budget'] = price_min
        updated_count += 1
        print(f"✓ Updated {dest_name} ({budget_tier}): ${price_min:,}-${price_max:,}")

# Save updated destinations
with open('backend/data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"\n✅ Successfully updated {updated_count} destinations with researched pricing!")
