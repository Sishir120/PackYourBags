import json

# Load destinations
with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

# Researched price ranges (7-day trip per person including flights)
researched_ranges = {
    'Paris': {'budget': (2199, 2799), 'midrange': (2899, 3699), 'luxury': (4199, 5299)},
    'Tokyo': {'budget': (1599, 2099), 'midrange': (2299, 2999), 'luxury': (3099, 3899)},
    'Bali': {'budget': (699, 1099), 'midrange': (1099, 1499), 'luxury': (1399, 1799)},
    'Santorini': {'budget': (1999, 2499), 'midrange': (3499, 4299), 'luxury': (6499, 7999)},
    'Dubai': {'budget': (1499, 1999), 'midrange': (2199, 2799), 'luxury': (3099, 3899)},
    'Maldives': {'budget': (3699, 4499), 'midrange': (6999, 8499), 'luxury': (13999, 16999)},
    'Iceland': {'budget': (1899, 2399), 'midrange': (2599, 3199), 'luxury': (3699, 4499)}
}

# Regional multipliers
region_multipliers = {
    'Asia': 0.7,
    'Africa': 0.75,
    'South America': 0.8,
    'Oceania': 1.1,
    'Europe': 1.0,
    'North America': 0.95
}

# Budget tier base price ranges - FULLY SEPARATED
budget_ranges = {
    'budget-friendly': (699, 1399),      # $699-$1,399
    'mid-range': (1599, 3299),           # $1,599-$3,299
    'luxury': (3899, 8999)               # $3,899-$8,999
}

def get_price_range_for_destination(dest):
    """Calculate personalized price range for a destination"""
    name = dest.get('name', '')
    continent = dest.get('continent', 'Europe')
    budget_tier = dest.get('budget_tier', 'mid-range')
    
    # Check if we have researched price
    if name in researched_ranges:
        tier_map = {
            'budget-friendly': 'budget',
            'mid-range': 'midrange',
            'luxury': 'luxury'
        }
        return researched_ranges[name][tier_map.get(budget_tier, 'midrange')]
    
    # Calculate based on budget tier and region
    base_range = budget_ranges[budget_tier]
    multiplier = region_multipliers.get(continent, 1.0)
    
    # Calculate min and max with regional adjustment
    min_price = int(base_range[0] * multiplier)
    max_price = int(base_range[1] * multiplier)
    
    # Round to nearest 99/49/79/89 ending
    min_price = (min_price // 100) * 100 + 99
    max_price = (max_price // 100) * 100 + 99
    
    # Ensure proper range
    if max_price <= min_price:
        max_price = min_price + 500
    
    return (min_price, max_price)

# Add price_range to each destination
for dest in destinations:
    min_price, max_price = get_price_range_for_destination(dest)
    dest['price_range'] = {
        'min': min_price,
        'max': max_price
    }
    # Keep estimated_budget as the minimum for backward compatibility
    dest['estimated_budget'] = min_price

# Save updated destinations
with open('backend/data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"✅ Added price ranges to {len(destinations)} destinations!")
print("\nSample price ranges by tier:")

budget_samples = [d for d in destinations if d.get('budget_tier') == 'budget-friendly'][:2]
mid_samples = [d for d in destinations if d.get('budget_tier') == 'mid-range'][:2]
luxury_samples = [d for d in destinations if d.get('budget_tier') == 'luxury'][:2]

print("\nBUDGET-FRIENDLY:")
for d in budget_samples:
    pr = d.get('price_range', {})
    print(f"  {d['name']}: ${pr.get('min', 0):,} - ${pr.get('max', 0):,}")

print("\nMID-RANGE:")
for d in mid_samples:
    pr = d.get('price_range', {})
    print(f"  {d['name']}: ${pr.get('min', 0):,} - ${pr.get('max', 0):,}")

print("\nLUXURY:")
for d in luxury_samples:
    pr = d.get('price_range', {})
    print(f"  {d['name']}: ${pr.get('min', 0):,} - ${pr.get('max', 0):,}")
