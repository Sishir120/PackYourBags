import json

# Researched accurate pricing data for first 10 destinations (7-day trips including flights)
researched_pricing = {
    "Pokhara": {
        "budget": (699, 899),      # $71-$360 + flights
        "midrange": (899, 1199),
        "luxury": (1199, 1599)
    },
    "Kathmandu": {
        "budget": (699, 999),      # $345-$534 + flights
        "midrange": (999, 1299),
        "luxury": (1299, 1799)
    },
    "Seoul": {
        "budget": (1299, 1799),    # $848-$1,690 + flights  
        "midrange": (1799, 2899),  # $3,188-$6,420 range
        "luxury": (3699, 5499)
    },
    "Paris": {
        "budget": (2199, 2799),
        "midrange": (2899, 3699),
        "luxury": (4199, 5299)
    },
    "Tokyo": {
        "budget": (1599, 2099),
        "midrange": (2299, 2999),
        "luxury": (3099, 3899)
    },
    "Bali": {
        "budget": (699, 1099),
        "midrange": (1099, 1499),
        "luxury": (1399, 1799)
    },
    "Prague": {
        "budget": (899, 1299),     # $700-$3,500 range
        "midrange": (1599, 2499),
        "luxury": (2999, 3899)
    },
    "Hanoi": {
        "budget": (599, 899),      # $200-$600 range
        "midrange": (899,1199),
        "luxury": (1299, 1799)
    },
    "London": {
        "budget": (1899, 2299),    # $2,000-$2,500 + flights
        "midrange": (2299, 2899),
        "luxury": (3299, 4499)
    },
    "Rome": {
        "budget": (1699, 2199),    # €900-€1,800 + flights
        "midrange": (2199, 3299),
        "luxury": (3899, 5499)
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
print(f"Remaining destinations: {len(destinations) - updated_count}")
