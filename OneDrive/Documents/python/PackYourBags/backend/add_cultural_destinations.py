import json
import uuid

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destinations: {len(destinations)}")

# New cultural destinations to add for North America
new_cultural_destinations = [
    # North America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Santa Fe",
        "slug": "santa-fe-united-states",
        "country": "United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1582213782179-e0d55f0d2d0a?w=1200&q=80",
        "highlights": [
            "Pueblo Architecture",
            "Art Galleries",
            "Native American Culture"
        ],
        "quick_fact": "Santa Fe is the oldest capital city in the United States and is renowned for its distinctive Pueblo-style architecture and vibrant arts scene.",
        "coordinates": {
            "lat": 35.6870,
            "lng": -105.9378
        },
        "best_season": "March to May, September to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Visit the historic Santa Fe Plaza and surrounding museums",
            "Explore Canyon Road's art galleries",
            "Try traditional New Mexican cuisine with green chile"
        ],
        "description": "Immerse yourself in the unique cultural blend of Santa Fe, where Native American, Hispanic, and Anglo influences create a distinctive artistic and architectural heritage. The city's adobe buildings, world-class museums, and thriving arts community make it a cultural gem in the American Southwest."
    }
]

# Add new cultural destinations to the list
destinations.extend(new_cultural_destinations)

# Save updated destinations
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_cultural_destinations)} new cultural destinations")
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