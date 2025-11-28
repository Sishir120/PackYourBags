import json

# Researched accurate pricing data for remaining destinations (7-day trips including flights)
researched_pricing = {
    "Chitwan National Park": {
        "budget": (799, 1099),
        "midrange": (1099, 1599),
        "luxury": (1599, 2299)
    },
    "Kyoto": {
        "budget": (1899, 2499),
        "midrange": (2499, 3499),
        "luxury": (3499, 5499)
    },
    "Porto": {
        "budget": (1299, 1699),
        "midrange": (1699, 2299),
        "luxury": (2299, 3299)
    },
    "Reykjavik": {
        "budget": (1999, 2599),
        "midrange": (2599, 3499),
        "luxury": (3499, 5999)
    },
    "Dubrovnik": {
        "budget": (1399, 1899),
        "midrange": (1899, 2699),
        "luxury": (2699, 3999)
    },
    "Cartagena": {
        "budget": (999, 1399),
        "midrange": (1399, 1999),
        "luxury": (1999, 2899)
    },
    "Banff": {
        "budget": (1699, 2199),
        "midrange": (2199, 3199),
        "luxury": (3199, 4999)
    },
    "Cusco": {
        "budget": (1199, 1599),
        "midrange": (1599, 2299),
        "luxury": (2299, 3499)
    },
    "Tulum": {
        "budget": (1499, 1999),
        "midrange": (1999, 2999),
        "luxury": (2999, 4999)
    },
    "Marrakech": {
        "budget": (1099, 1499),
        "midrange": (1499, 2199),
        "luxury": (2199, 3299)
    },
    "Cape Town": {
        "budget": (1599, 2099),
        "midrange": (2099, 2899),
        "luxury": (2899, 4499)
    },
    "Zanzibar": {
        "budget": (1699, 2199),
        "midrange": (2199, 3199),
        "luxury": (3199, 4999)
    },
    "Queenstown": {
        "budget": (1899, 2399),
        "midrange": (2399, 3499),
        "luxury": (3499, 5499)
    },
    "Great Barrier Reef": {
        "budget": (2199, 2799),
        "midrange": (2799, 3999),
        "luxury": (3999, 6499)
    },
    "Fiji Islands": {
        "budget": (2099, 2699),
        "midrange": (2699, 3899),
        "luxury": (3899, 6999)
    },
    "Mount Kilimanjaro": {
        "budget": (2499, 3199),
        "midrange": (3199, 4499),
        "luxury": (4499, 7999)
    },
    "Inca Trail": {
        "budget": (1599, 2099),
        "midrange": (2099, 2999),
        "luxury": (2999, 4499)
    },
    "New York City": {
        "budget": (1999, 2599),
        "midrange": (2599, 3899),
        "luxury": (3899, 6999)
    },
    "Sydney": {
        "budget": (2199, 2799),
        "midrange": (2799, 3999),
        "luxury": (3999, 6499)
    },
    "Barcelona": {
        "budget": (1399, 1899),
        "midrange": (1899, 2699),
        "luxury": (2699, 3999)
    },
    "Rio de Janeiro": {
        "budget": (1499, 1999),
        "midrange": (1999, 2799),
        "luxury": (2799, 4199)
    }
}

# Load current destinations
try:
    with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
        destinations = json.load(f)
except Exception as e:
    print(f"Error loading file: {e}")
    exit(1)

# Update pricing for destinations
updated_count = 0
for dest in destinations:
    dest_name = dest.get('name', '')
    
    # Skip if already has price_range (from batch 1) AND we don't want to overwrite (optional)
    # But here we just check if it's in our new research list
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
print(f"Total destinations: {len(destinations)}")
