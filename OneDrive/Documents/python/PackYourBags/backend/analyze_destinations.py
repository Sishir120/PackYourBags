import json

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Total destinations: {len(destinations)}")

# Analyze activities by checking highlights
activities = {
    'trekking': [],
    'hiking': [],
    'beach': [],
    'cultural': [],
    'food': []
}

continents = {}

for dest in destinations:
    # Count by continent
    continent = dest['continent']
    if continent not in continents:
        continents[continent] = []
    continents[continent].append(dest)
    
    # Check activities
    if 'highlights' in dest:
        for highlight in dest['highlights']:
            highlight_lower = highlight.lower()
            if 'trek' in highlight_lower and dest not in activities['trekking']:
                activities['trekking'].append(dest)
            elif 'hike' in highlight_lower and dest not in activities['hiking']:
                activities['hiking'].append(dest)
            elif 'beach' in highlight_lower and dest not in activities['beach']:
                activities['beach'].append(dest)
            elif ('culture' in highlight_lower or 'historic' in highlight_lower or 
                  'temple' in highlight_lower or 'palace' in highlight_lower or
                  'museum' in highlight_lower) and dest not in activities['cultural']:
                activities['cultural'].append(dest)
            elif ('food' in highlight_lower or 'cuisine' in highlight_lower or 
                  'coffee' in highlight_lower or 'tea' in highlight_lower or
                  'restaurant' in highlight_lower or 'market' in highlight_lower or
                  'street food' in highlight_lower) and dest not in activities['food']:
                activities['food'].append(dest)

print("\nActivities distribution:")
for activity, dests in activities.items():
    print(f"  {activity}: {len(dests)} destinations")

print("\nContinents distribution:")
for continent, dests in continents.items():
    print(f"  {continent}: {len(dests)} destinations")
    
# Show what we're missing by activity
print("\nMissing coverage analysis:")
all_continents = set(continents.keys())
activity_continents = {}

for activity, dests in activities.items():
    covered_continents = set(dest['continent'] for dest in dests)
    missing_continents = all_continents - covered_continents
    activity_continents[activity] = missing_continents
    print(f"  {activity}: Missing in {', '.join(missing_continents) if missing_continents else 'None'}")