import json
import uuid

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destinations: {len(destinations)}")

# New beach destinations to add for South America
new_beach_destinations = [
    # South America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Florianopolis",
        "slug": "florianopolis-brazil",
        "country": "Brazil",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
        "highlights": [
            "Island Beaches",
            "Surfing Spots",
            "Brazilian Culture"
        ],
        "quick_fact": "Known as 'Magic Island', Florianopolis features over 40 beaches and is considered one of Brazil's most beautiful coastal destinations.",
        "coordinates": {
            "lat": -27.5954,
            "lng": -48.5480
        },
        "best_season": "December to March",
        "budget_tier": "mid-range",
        "local_tips": [
            "Take a boat to nearby islands for secluded beaches",
            "Try Brazilian seafood at local restaurants",
            "Visit during summer for beach festivals and events"
        ],
        "description": "Discover the stunning beaches of Florianopolis, where pristine sands meet lush Atlantic rainforest. This Brazilian island paradise offers excellent surfing, vibrant nightlife, and a relaxed atmosphere that perfectly captures the essence of Brazilian coastal culture."
    }
]

# Add new beach destinations to the list
destinations.extend(new_beach_destinations)

# Save updated destinations
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_beach_destinations)} new beach destinations")
print(f"Total destinations now: {len(destinations)}")

# Verify the update
print("\nNew totals by activity:")
activities = {
    'trekking': 0,
    'hiking': 0,
    'beach': 0,
    'cultural': 0,
    'food': 0
}

continents = {}

for dest in destinations:
    # Count by continent
    continent = dest['continent']
    if continent not in continents:
        continents[continent] = 0
    continents[continent] += 1
    
    # Check activities
    if 'highlights' in dest:
        for highlight in dest['highlights']:
            highlight_lower = highlight.lower()
            if 'trek' in highlight_lower:
                activities['trekking'] += 1
                break
            elif 'hike' in highlight_lower or 'hiking' in highlight_lower:
                activities['hiking'] += 1
                break
            elif 'beach' in highlight_lower:
                activities['beach'] += 1
                break
            elif ('culture' in highlight_lower or 'historic' in highlight_lower or 
                  'temple' in highlight_lower or 'palace' in highlight_lower or
                  'museum' in highlight_lower):
                activities['cultural'] += 1
                break
            elif ('food' in highlight_lower or 'cuisine' in highlight_lower or 
                  'coffee' in highlight_lower or 'tea' in highlight_lower or
                  'restaurant' in highlight_lower or 'market' in highlight_lower or
                  'street food' in highlight_lower or 'dining' in highlight_lower or
                  'wine' in highlight_lower or 'cocktail' in highlight_lower):
                activities['food'] += 1
                break

print("Activities distribution:")
for activity, count in activities.items():
    print(f"  {activity}: {count} destinations")

print("\nContinents distribution:")
for continent, count in continents.items():
    print(f"  {continent}: {count} destinations")