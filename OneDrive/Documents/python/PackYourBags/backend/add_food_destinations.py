import json
import uuid

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destinations: {len(destinations)}")

# New food destinations to add for each missing continent
new_food_destinations = [
    # Oceania
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Melbourne",
        "slug": "melbourne-australia",
        "country": "Australia",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Coffee Culture",
            "Food Markets",
            "Fine Dining"
        ],
        "quick_fact": "Melbourne is consistently ranked as one of the world's most livable cities and a culinary capital of Australia.",
        "coordinates": {
            "lat": -37.8136,
            "lng": 144.9631
        },
        "best_season": "March to May, September to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Try the famous Melbourne coffee scene in laneways",
            "Visit Queen Victoria Market for fresh produce",
            "Explore diverse neighborhoods like Fitzroy and Carlton"
        ],
        "description": "Indulge in Melbourne's world-renowned food scene, where laneway cafes serve exceptional coffee and multicultural influences create innovative cuisine. From trendy brunch spots to acclaimed restaurants, Melbourne offers a culinary adventure for every palate."
    },
    # North America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "New Orleans",
        "slug": "new-orleans-united-states",
        "country": "United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Creole Cuisine",
            "French Quarter Dining",
            "Music and Food Tours"
        ],
        "quick_fact": "New Orleans is the birthplace of Creole cuisine, blending French, Spanish, African, and Native American culinary traditions.",
        "coordinates": {
            "lat": 29.9511,
            "lng": -90.0715
        },
        "best_season": "February to May, October to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Try authentic beignets at Cafe du Monde",
            "Take a culinary tour to learn about Creole history",
            "Visit local markets like Crescent City Farmers Market"
        ],
        "description": "Experience the unique flavors of New Orleans, where Creole and Cajun cuisines create a distinctive culinary identity. From spicy jambalaya and gumbo to decadent bread pudding, the city's food scene is as rich and diverse as its culture."
    },
    # Africa
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Cape Winelands",
        "slug": "cape-winelands-south-africa",
        "country": "South Africa",
        "continent": "Africa",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Wine Tasting",
            "Farm-to-Table Dining",
            "Culinary Experiences"
        ],
        "quick_fact": "The Cape Winelands produce some of the world's finest wines and offer exceptional culinary experiences with breathtaking mountain and vineyard views.",
        "coordinates": {
            "lat": -33.9249,
            "lng": 18.8486
        },
        "best_season": "November to April",
        "budget_tier": "luxury",
        "local_tips": [
            "Book wine tastings in advance during peak season",
            "Try wine and chocolate pairings",
            "Stay at boutique wine estates for full experience"
        ],
        "description": "Discover the world-class wines and gourmet cuisine of South Africa's Cape Winelands. This region combines stunning landscapes with exceptional wines, farm-fresh ingredients, and innovative culinary experiences that showcase the best of South African flavors."
    },
    # South America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Lima",
        "slug": "lima-peru",
        "country": "Peru",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Ceviche Specialties",
            "UNESCO Gastronomy",
            "Pisco Sour Cocktails"
        ],
        "quick_fact": "Lima is recognized by UNESCO as a City of Gastronomy, home to some of the world's best restaurants and innovative Peruvian cuisine.",
        "coordinates": {
            "lat": -12.0464,
            "lng": -77.0428
        },
        "best_season": "May to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Try authentic ceviche at local markets like Mercado de Surquillo",
            "Take a cooking class to learn Peruvian techniques",
            "Visit Barranco district for trendy restaurants"
        ],
        "description": "Experience Lima's revolutionary culinary scene, where traditional Peruvian ingredients meet modern techniques. From world-famous ceviche to innovative fusion dishes, Lima offers an extraordinary gastronomic journey that has earned it recognition as one of the world's great food capitals."
    }
]

# Add new food destinations to the list
destinations.extend(new_food_destinations)

# Save updated destinations
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_food_destinations)} new food destinations")
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