import json
import uuid

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destinations: {len(destinations)}")

# New destinations to add for better activity coverage
new_destinations = [
    # Trekking in Oceania
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Milford Track",
        "slug": "milford-track-new-zealand",
        "country": "New Zealand",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Multi-day Trekking",
            "Fiordland National Park",
            "Sutherland Falls"
        ],
        "quick_fact": "The Milford Track is considered one of the finest walks in the world, traversing through New Zealand's most stunning landscapes.",
        "coordinates": {
            "lat": -44.7917,
            "lng": 167.9583
        },
        "best_season": "October to April",
        "budget_tier": "mid-range",
        "local_tips": [
            "Book huts well in advance",
            "Pack waterproof gear",
            "Consider guided walks"
        ],
        "description": "Experience New Zealand's most famous hiking trail through pristine wilderness, cascading waterfalls, and dramatic mountain scenery. The 33-mile journey takes four days and offers some of the most spectacular views in the world."
    },
    # Trekking in North America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Pacific Crest Trail",
        "slug": "pacific-crest-trail-united-states",
        "country": "United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Long-Distance Trekking",
            "Mountain Views",
            "Desert Landscapes"
        ],
        "quick_fact": "The Pacific Crest Trail is a 2,650-mile long-distance hiking and equestrian trail that runs from the U.S.-Mexico border to the U.S.-Canada border.",
        "coordinates": {
            "lat": 34.6084,
            "lng": -116.2768
        },
        "best_season": "April to September",
        "budget_tier": "budget-friendly",
        "local_tips": [
            "Plan resupply points carefully",
            "Get a trail permit",
            "Start with shorter sections"
        ],
        "description": "Discover the legendary Pacific Crest Trail, America's premier long-distance hiking path. This iconic trail winds through California, Oregon, and Washington, offering diverse landscapes from desert landscapes to alpine vistas."
    },
    # Trekking in South America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Santa Cruz Trek",
        "slug": "santa-cruz-trek-peru",
        "country": "Peru",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "High-Altitude Trekking",
            "Cordillera Blanca",
            "Glacial Lakes"
        ],
        "quick_fact": "The Santa Cruz Trek is one of the most popular trekking routes in the Peruvian Andes, offering access to spectacular mountain scenery without requiring technical climbing skills.",
        "coordinates": {
            "lat": -9.1,
            "lng": -77.6
        },
        "best_season": "May to September",
        "budget_tier": "mid-range",
        "local_tips": [
            "Acclimatize properly in Huaraz first",
            "Pack warm layers for high altitudes",
            "Hire local guides for safety"
        ],
        "description": "Experience the breathtaking beauty of the Cordillera Blanca mountain range in Peru. The Santa Cruz Trek offers stunning views of snow-capped peaks, turquoise glacial lakes, and traditional Andean villages."
    },
    # Hiking in Asia
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Mount Fuji",
        "slug": "mount-fuji-japan",
        "country": "Japan",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Mountain Hiking",
            "Volcanic Summit",
            "Five Lakes Region"
        ],
        "quick_fact": "Mount Fuji is Japan's highest peak at 3,776 meters and is considered one of Japan's Three Holy Mountains.",
        "coordinates": {
            "lat": 35.3606,
            "lng": 138.7274
        },
        "best_season": "July to August",
        "budget_tier": "mid-range",
        "local_tips": [
            "Start the summit climb very early to avoid crowds",
            "Bring warm layers - it's much colder at the top",
            "Visit the Five Lakes region for scenic views"
        ],
        "description": "Hike Japan's iconic Mount Fuji, an active stratovolcano and cultural symbol. The mountain offers challenging trails with rewarding panoramic views from the summit. The surrounding Five Lakes region provides excellent hiking opportunities for all skill levels."
    },
    # Food in South America
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Buenos Aires",
        "slug": "buenos-aires-argentina",
        "country": "Argentina",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Argentine Cuisine",
            "Steak Houses",
            "Wine Tasting"
        ],
        "quick_fact": "Buenos Aires is known as the 'Paris of South America' and is famous for its European-influenced architecture and vibrant culinary scene.",
        "coordinates": {
            "lat": -34.6037,
            "lng": -58.3816
        },
        "best_season": "October to April",
        "budget_tier": "mid-range",
        "local_tips": [
            "Try authentic Argentine beef at traditional parrillas",
            "Experience a tango dinner show",
            "Visit San Telmo market for local flavors"
        ],
        "description": "Indulge in Buenos Aires' world-renowned culinary scene, where European traditions blend with local flavors. From succulent Argentine beef and world-class wines to traditional empanadas and dulce de leche desserts, the city offers an unforgettable gastronomic journey."
    },
    # Food in Africa
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Marrakech",
        "slug": "marrakech-morocco",
        "country": "Morocco",
        "continent": "Africa",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Moroccan Cuisine",
            "Spice Markets",
            "Traditional Tagines"
        ],
        "quick_fact": "Marrakech is known as the 'Red City' for its distinctive red sandstone buildings and is a UNESCO World Heritage site famous for its vibrant food culture.",
        "coordinates": {
            "lat": 31.6295,
            "lng": -7.9811
        },
        "best_season": "March to May, September to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Take a cooking class to learn authentic recipes",
            "Explore Jemaa el-Fnaa food stalls at night",
            "Visit the spice markets for aromatic ingredients"
        ],
        "description": "Experience the rich flavors of Moroccan cuisine in Marrakech, where aromatic spices, slow-cooked tagines, and sweet pastries create a culinary paradise. From street food in the bustling Jemaa el-Fnaa square to fine dining in riad courtyards, the city offers an authentic taste of North African culture."
    }
]

# Add new destinations to the list
destinations.extend(new_destinations)

# Save updated destinations
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"Added {len(new_destinations)} new destinations")
print(f"Total destinations now: {len(destinations)}")

# Print summary of added destinations
print("\nAdded destinations:")
for dest in new_destinations:
    print(f"  - {dest['name']} ({dest['continent']}) - {', '.join(dest['highlights'])}")