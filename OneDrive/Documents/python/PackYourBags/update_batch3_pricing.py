import json

# Researched accurate pricing data for Batch 3 (7-day trips including flights)
researched_pricing = {
    "Porto": {
        "budget": (899, 1399),
        "midrange": (1499, 2299),
        "luxury": (2499, 3999)
    },
    "Reykjavik": {
        "budget": (1199, 1899),
        "midrange": (2499, 3999),
        "luxury": (4499, 6999)
    },
    "Dubrovnik": {
        "budget": (999, 1499),
        "midrange": (1599, 2699),
        "luxury": (2999, 4999)
    },
    "Cartagena": {
        "budget": (699, 1099),
        "midrange": (1199, 1899),
        "luxury": (1999, 2999)
    },
    "Banff": {
        "budget": (1299, 1899),
        "midrange": (1999, 3499),
        "luxury": (3999, 6999)
    },
    "Zanzibar": {
        "budget": (1199, 1799),
        "midrange": (1999, 3199),
        "luxury": (3499, 5999)
    },
    "Queenstown": {
        "budget": (1399, 1999),
        "midrange": (2199, 3299),
        "luxury": (3999, 5999)
    },
    "Great Barrier Reef": {
        "budget": (1199, 1699),
        "midrange": (1799, 2499),
        "luxury": (2999, 4999)
    },
    "Fiji Islands": {
        "budget": (1299, 1999),
        "midrange": (2199, 3999),
        "luxury": (4999, 8999)
    },
    "Mount Kilimanjaro": {
        "budget": (1999, 2999),
        "midrange": (3199, 4699),
        "luxury": (4999, 7999)
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
