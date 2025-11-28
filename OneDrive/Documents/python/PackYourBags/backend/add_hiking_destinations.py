import json
import uuid

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destinations: {len(destinations)}")

# New hiking destinations to add for each missing continent
new_hiking_destinations = [
    # Africa
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Atlas Mountains",
        "slug": "atlas-mountains-morocco",
        "country": "Morocco",
        "continent": "Africa",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Mountain Hiking",
            "Berber Villages",
            "Toubkal Peak"
        ],
        "quick_fact": "The Atlas Mountains span across Morocco, Algeria, and Tunisia, offering diverse hiking opportunities through Berber villages and dramatic peaks.",
        "coordinates": {
            "lat": 31.0000,
            "lng": -7.0000
        },
        "best_season": "March to May, September to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Hire local Berber guides for authentic experience",
            "Pack layers for temperature changes",
            "Respect local village customs"
        ],
        "description": "Explore the rugged beauty of the Atlas Mountains, home to North Africa's highest peak, Mount Toubkal. Hike through traditional Berber villages, enjoy mint tea with local families, and experience the diverse landscapes from arid valleys to snow-capped peaks."
    },
    # South America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Patagonia",
        "slug": "patagonia-argentina-chile",
        "country": "Argentina/Chile",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Glacier Hiking",
            "Mountain Trails",
            "Wild Patagonia"
        ],
        "quick_fact": "Patagonia spans southern Argentina and Chile, featuring some of the world's most dramatic landscapes including glaciers, mountains, and steppes.",
        "coordinates": {
            "lat": -50.0000,
            "lng": -70.0000
        },
        "best_season": "October to April",
        "budget_tier": "luxury",
        "local_tips": [
            "Weather can change rapidly - pack accordingly",
            "Book accommodations well in advance",
            "Consider guided tours for remote areas"
        ],
        "description": "Discover the untamed wilderness of Patagonia, where massive glaciers calve into turquoise lakes and granite peaks pierce the sky. This region offers some of the world's most challenging and rewarding hiking experiences."
    },
    # Oceania
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Blue Mountains",
        "slug": "blue-mountains-australia",
        "country": "Australia",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Eucalyptus Forests",
            "Waterfall Walks",
            "Aboriginal Heritage"
        ],
        "quick_fact": "The Blue Mountains get their name from the blue haze created by eucalyptus oil in the atmosphere.",
        "coordinates": {
            "lat": -33.8651,
            "lng": 150.6449
        },
        "best_season": "September to November, March to May",
        "budget_tier": "mid-range",
        "local_tips": [
            "Take the scenic railway for dramatic views",
            "Visit during weekdays to avoid crowds",
            "Try bushwalking for authentic Australian hiking"
        ],
        "description": "Explore the stunning Blue Mountains, a UNESCO World Heritage area just two hours from Sydney. Hike through ancient eucalyptus forests, discover Aboriginal rock art, and marvel at spectacular waterfalls and dramatic cliff lines."
    },
    # North America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Rocky Mountains",
        "slug": "rocky-mountains-canada-united-states",
        "country": "Canada/United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Alpine Hiking",
            "Wildlife Viewing",
            "Mountain Peaks"
        ],
        "quick_fact": "The Rocky Mountains stretch over 3,000 miles from British Columbia to New Mexico, offering endless hiking opportunities.",
        "coordinates": {
            "lat": 40.0000,
            "lng": -105.0000
        },
        "best_season": "June to September",
        "budget_tier": "mid-range",
        "local_tips": [
            "Check trail conditions before heading out",
            "Carry bear spray in grizzly country",
            "Start early to avoid afternoon thunderstorms"
        ],
        "description": "Experience the majestic beauty of the Rocky Mountains, where alpine meadows bloom with wildflowers and snow-capped peaks tower above pristine lakes. This continental mountain range offers hiking trails for every skill level."
    },
    # Asia
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Himalayas",
        "slug": "himalayas-nepal-india-bhutan",
        "country": "Nepal/India/Bhutan",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "High-Altitude Trekking",
            "Buddhist Monasteries",
            "Snowy Peaks"
        ],
        "quick_fact": "The Himalayas contain the world's highest peaks, including Mount Everest and K2, and are sacred to millions of people.",
        "coordinates": {
            "lat": 28.0000,
            "lng": 84.0000
        },
        "best_season": "October to November, March to May",
        "budget_tier": "luxury",
        "local_tips": [
            "Acclimatize properly to prevent altitude sickness",
            "Respect local religious customs and traditions",
            "Hire experienced local guides for high-altitude treks"
        ],
        "description": "Journey into the roof of the world in the Himalayas, where ancient Buddhist monasteries perch on dramatic ridges and prayer flags flutter in the thin air. Hike through rhododendron forests and experience the spiritual and physical challenge of high-altitude trekking."
    },
    # Europe
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Dolomites",
        "slug": "dolomites-italy",
        "country": "Italy",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Limestone Peaks",
            "Via Ferrata Routes",
            "Alpine Meadows"
        ],
        "quick_fact": "The Dolomites are a UNESCO World Heritage site known for their distinctive pale limestone peaks that glow pink and gold at sunrise and sunset.",
        "coordinates": {
            "lat": 46.5000,
            "lng": 11.7500
        },
        "best_season": "June to September",
        "budget_tier": "mid-range",
        "local_tips": [
            "Try via ferrata (iron path) climbing with guides",
            "Visit mountain huts for authentic Alpine cuisine",
            "Take the cable cars for panoramic views"
        ],
        "description": "Discover the dramatic beauty of the Dolomites, where jagged limestone peaks rise from lush alpine meadows. This UNESCO World Heritage site offers world-class hiking, via ferrata climbing, and breathtaking views that change with the light throughout the day."
    }
]

# Add new hiking destinations to the list
destinations.extend(new_hiking_destinations)

# Save updated destinations
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_hiking_destinations)} new hiking destinations")
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
            elif 'hike' in highlight_lower:
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
                  'street food' in highlight_lower):
                activities['food'] += 1
                break

print("Activities distribution:")
for activity, count in activities.items():
    print(f"  {activity}: {count} destinations")

print("\nContinents distribution:")
for continent, count in continents.items():
    print(f"  {continent}: {count} destinations")