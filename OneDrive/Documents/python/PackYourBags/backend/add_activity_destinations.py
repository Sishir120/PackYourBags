import json
import uuid

# Load current destinations
with open('data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destinations: {len(destinations)}")

# New destinations to add for each activity and continent
new_destinations = [
    # Trekking destinations
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Mount Kilimanjaro",
        "slug": "mount-kilimanjaro-tanzania",
        "country": "Tanzania",
        "continent": "Africa",
        "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
        "highlights": [
            "Kilimanjaro Trek",
            "Uhuru Peak",
            "Diverse Ecosystems"
        ],
        "quick_fact": "Mount Kilimanjaro is Africa's highest peak and the world's tallest free-standing mountain.",
        "coordinates": {
            "lat": -3.066389,
            "lng": 37.355
        },
        "best_season": "January to March and June to October",
        "budget_tier": "luxury",
        "local_tips": [
            "Acclimatize properly to avoid altitude sickness",
            "Pack warm layers for summit night",
            "Choose a reputable guide service"
        ],
        "description": "Experience the ultimate African adventure with a trek to the summit of Mount Kilimanjaro. This iconic climb takes you through five distinct climate zones, from rainforest to arctic conditions, culminating in breathtaking views from Africa's highest peak."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Inca Trail",
        "slug": "inca-trail-peru",
        "country": "Peru",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=80",
        "highlights": [
            "Machu Picchu Approach",
            "Ancient Inca Ruins",
            "Andes Mountain Views"
        ],
        "quick_fact": "The classic Inca Trail is a 26-mile trek that ends at the Sun Gate overlooking Machu Picchu.",
        "coordinates": {
            "lat": -13.1631,
            "lng": -72.545
        },
        "best_season": "May to September",
        "budget_tier": "mid-range",
        "local_tips": [
            "Book permits well in advance",
            "Train your body before arrival",
            "Bring good hiking boots"
        ],
        "description": "Walk in the footsteps of the ancient Incas on this legendary four-day trek to the lost city of Machu Picchu. Experience breathtaking mountain scenery, ancient ruins, and diverse ecosystems."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Milford Track",
        "slug": "milford-track-new-zealand",
        "country": "New Zealand",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Fiordland National Park",
            "Sutherland Falls",
            "Mackinnon Pass"
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
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Tour du Mont Blanc",
        "slug": "tour-du-mont-blanc-france-italy-switzerland",
        "country": "France/Italy/Switzerland",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1516144651102-3965c700c4ae?w=1200&q=80",
        "highlights": [
            "Alpine Trekking",
            "Glacier Views",
            "Mountain Huts"
        ],
        "quick_fact": "This circular trek around Mont Blanc passes through three countries and covers approximately 170km.",
        "coordinates": {
            "lat": 45.8333,
            "lng": 6.8667
        },
        "best_season": "June to September",
        "budget_tier": "mid-range",
        "local_tips": [
            "Book accommodations early",
            "Bring layers for changing weather",
            "Consider guided tours"
        ],
        "description": "Experience the grandeur of the Alps on this classic multi-day trek around Western Europe's highest peak. The route passes through charming villages, alpine meadows, and offers stunning views of snow-capped peaks."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Appalachian Trail",
        "slug": "appalachian-trail-united-states",
        "country": "United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Long-Distance Hiking",
            "Forest Wilderness",
            "Mountain Views"
        ],
        "quick_fact": "The Appalachian Trail is approximately 2,190 miles long, stretching from Georgia to Maine.",
        "coordinates": {
            "lat": 34.6084,
            "lng": -84.2768
        },
        "best_season": "March to October",
        "budget_tier": "budget-friendly",
        "local_tips": [
            "Plan resupply points carefully",
            "Get a trail map and guidebook",
            "Start with shorter sections"
        ],
        "description": "Discover the legendary Appalachian Trail, America's most famous long-distance hiking path. This iconic trail winds through 14 states, offering diverse landscapes from dense forests to panoramic mountain vistas."
    },
    
    # Hiking destinations
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Drakensberg Mountains",
        "slug": "drakensberg-mountains-south-africa",
        "country": "South Africa",
        "continent": "Africa",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Blyde River Canyon",
            "Amphitheatre Hiking",
            "Ancient Rock Art"
        ],
        "quick_fact": "The Drakensberg range contains the highest mountain in South Africa and offers some of the country's most spectacular hiking.",
        "coordinates": {
            "lat": -29.1455,
            "lng": 29.2144
        },
        "best_season": "April to October",
        "budget_tier": "mid-range",
        "local_tips": [
            "Hire local guides for safety",
            "Pack warm layers for high altitudes",
            "Respect local cultural sites"
        ],
        "description": "Explore the dramatic peaks and valleys of South Africa's Drakensberg Mountains. This UNESCO World Heritage site offers challenging hikes with breathtaking views, ancient San rock art, and diverse wildlife."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Torres del Paine",
        "slug": "torres-del-paine-chile",
        "country": "Chile",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Granite Towers",
            "Glacier Hiking",
            "Wildlife Viewing"
        ],
        "quick_fact": "Torres del Paine is one of the most spectacular national parks in South America.",
        "coordinates": {
            "lat": -51.0000,
            "lng": -73.0000
        },
        "best_season": "October to April",
        "budget_tier": "mid-range",
        "local_tips": [
            "Weather can change quickly",
            "Book campsites in advance",
            "Bring windproof gear"
        ],
        "description": "Explore the dramatic landscapes of Patagonia with its iconic granite towers, turquoise lakes, and massive glaciers. This diverse hiking region offers trails for all skill levels."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Milford Sound",
        "slug": "milford-sound-new-zealand",
        "country": "New Zealand",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Fiordland Hiking",
            "Waterfall Trails",
            "Coastal Walks"
        ],
        "quick_fact": "Milford Sound is actually a fiord, carved by glaciers, and is one of New Zealand's most iconic natural attractions.",
        "coordinates": {
            "lat": -44.6414,
            "lng": 167.8919
        },
        "best_season": "October to April",
        "budget_tier": "mid-range",
        "local_tips": [
            "Take the Milford Track for multi-day hiking",
            "Visit during shoulder season for fewer crowds",
            "Consider boat tours for different perspectives"
        ],
        "description": "Experience the breathtaking beauty of Milford Sound with its towering peaks, cascading waterfalls, and pristine wilderness. The area offers numerous hiking trails from easy walks to challenging multi-day treks."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Cinque Terre",
        "slug": "cinque-terre-italy",
        "country": "Italy",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Coastal Hiking",
            "Colorful Villages",
            "Vineyard Trails"
        ],
        "quick_fact": "The Cinque Terre hiking trail connects five picturesque coastal villages through ancient paths carved into cliffs.",
        "coordinates": {
            "lat": 44.0800,
            "lng": 9.7800
        },
        "best_season": "April to June, September to October",
        "budget_tier": "mid-range",
        "local_tips": [
            "Purchase the Cinque Terre Card for hiking access",
            "Start early to avoid crowds",
            "Try local pesto and seafood"
        ],
        "description": "Hike the legendary coastal trails of Cinque Terre, connecting five charming Italian villages perched on dramatic cliffs overlooking the Mediterranean Sea. The UNESCO World Heritage site offers stunning views and authentic Italian culture."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Yosemite National Park",
        "slug": "yosemite-national-park-united-states",
        "country": "United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        "highlights": [
            "Granite Cliffs",
            "Waterfall Hiking",
            "Giant Sequoias"
        ],
        "quick_fact": "Yosemite National Park is home to some of the world's tallest waterfalls and largest trees.",
        "coordinates": {
            "lat": 37.8651,
            "lng": -119.5383
        },
        "best_season": "May to September",
        "budget_tier": "budget-friendly",
        "local_tips": [
            "Use the shuttle system to reduce traffic",
            "Start popular hikes early",
            "Check for permit requirements"
        ],
        "description": "Discover the iconic landscapes of Yosemite National Park, from towering granite cliffs like El Capitan and Half Dome to pristine waterfalls and ancient giant sequoias. The park offers over 750 miles of trails for all skill levels."
    },
    
    # Cultural destinations (additional for missing continents)
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Yellowstone National Park",
        "slug": "yellowstone-national-park-united-states",
        "country": "United States",
        "continent": "North America",
        "image_url": "https://images.unsplash.com/photo-1582213782179-e0d55f0d2d0a?w=1200&q=80",
        "highlights": [
            "Geothermal Features",
            "Wildlife Viewing",
            "Native American Heritage"
        ],
        "quick_fact": "Yellowstone was the world's first national park, established in 1872.",
        "coordinates": {
            "lat": 44.4280,
            "lng": -110.5885
        },
        "best_season": "May to September",
        "budget_tier": "mid-range",
        "local_tips": [
            "Stay in park lodges for authentic experience",
            "Watch wildlife from safe distances",
            "Visit geysers at different times for variety"
        ],
        "description": "Experience America's first national park, famous for its geothermal features like Old Faithful geyser, colorful hot springs, and diverse wildlife including bison, wolves, and grizzly bears. The park also preserves important Native American heritage sites."
    },
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Great Ocean Road",
        "slug": "great-ocean-road-australia",
        "country": "Australia",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1582213782179-e0d55f0d2d0a?w=1200&q=80",
        "highlights": [
            "Twelve Apostles",
            "Aboriginal Culture",
            "Coastal Scenery"
        ],
        "quick_fact": "The Great Ocean Road is one of the world's longest coastal drives, stretching 243 kilometers along Australia's southeastern coast.",
        "coordinates": {
            "lat": -38.6667,
            "lng": 143.1000
        },
        "best_season": "December to March",
        "budget_tier": "mid-range",
        "local_tips": [
            "Allow 3-4 days for the full experience",
            "Visit the Twelve Apostles at sunrise or sunset",
            "Learn about Aboriginal history at cultural centers"
        ],
        "description": "Discover the stunning coastal landscapes of Victoria, Australia, along the iconic Great Ocean Road. This UNESCO World Heritage area features dramatic limestone cliffs, pristine beaches, and important Aboriginal cultural sites."
    },
    
    # Food destinations (additional for missing continents)
    {
        "id": f"dest_{uuid.uuid4().hex[:6]}",
        "name": "Istanbul",
        "slug": "istanbul-turkey",
        "country": "Turkey",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "highlights": [
            "Turkish Cuisine",
            "Bazaar Food Tours",
            "Traditional Mezes"
        ],
        "quick_fact": "Istanbul straddles Europe and Asia, offering a unique blend of culinary traditions.",
        "coordinates": {
            "lat": 41.0082,
            "lng": 28.9784
        },
        "best_season": "April to June, September to November",
        "budget_tier": "mid-range",
        "local_tips": [
            "Try authentic Turkish breakfast at local cafes",
            "Explore the spice markets for culinary souvenirs",
            "Experience traditional Turkish tea culture"
        ],
        "description": "Indulge in Istanbul's rich culinary heritage, where European and Asian flavors blend seamlessly. From aromatic spices in the Grand Bazaar to traditional mezes and fresh seafood by the Bosphorus, Istanbul offers an unforgettable gastronomic journey."
    }
]

# --- Start of suggested change ---

# Create a set of existing slugs for efficient lookup
existing_slugs = {dest['slug'] for dest in destinations}

# Filter out destinations that already exist
destinations_to_add = [
    dest for dest in new_destinations if dest['slug'] not in existing_slugs
]
# --- End of suggested change ---

# Add new destinations to the list
destinations.extend(destinations_to_add)

# Save updated destinations
with open('data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"Added {len(destinations_to_add)} new destinations")
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