import json
import random

# New destinations to add (11 more to reach 50)
new_destinations = [
    {
        "id": "dest_new_001",
        "name": "Santorini",
        "slug": "santorini-greece",
        "country": "Greece",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80",
        "blog": "## The Jewel of the Aegean: Santorini\n\nSantorini is a volcanic island in the Cyclades group of the Greek islands. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater). They overlook the sea, small islands to the west and beaches made up of black, red and white lava pebbles.",
        "highlights": ["Oia Sunset", "Red Beach", "Akrotiri Archaeological Site", "Wine Tasting", "Caldera Views"],
        "quick_fact": "Famous for stunning sunsets, white-washed buildings, and blue-domed churches overlooking the Aegean Sea",
        "coordinates": {"lat": 36.3932, "lng": 25.4615},
        "best_season": "April to November",
        "budget_tier": "luxury",
        "price_range": {"min": 2299, "max": 3999},
        "estimated_budget": 2299,
        "rating": 4.8,
        "review_count": 2890,
        "local_tips": [
            "Book sunset viewing spots in Oia well in advance",
            "Try local wines from volcanic soil vineyards",
            "Visit during shoulder season (April-May, Sept-Oct) for fewer crowds"
        ],
        "description": "Santorini is one of the most romantic and picturesque destinations in the world, known for its dramatic cliffs, stunning sunsets, and iconic blue-domed churches."
    },
    {
        "id": "dest_new_002",
        "name": "Dubai",
        "slug": "dubai-uae",
        "country": "United Arab Emirates",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
        "blog": "## The City of Gold: Dubai\n\nDubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene. Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline. At its foot lies Dubai Fountain, with jets and lights choreographed to music. On artificial islands just offshore is Atlantis, The Palm, a resort with water and marine-animal parks.",
        "highlights": ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari", "Gold Souk"],
        "quick_fact": "Home to the world's tallest building and largest shopping mall, Dubai is a modern marvel in the desert",
        "coordinates": {"lat": 25.2048, "lng": 55.2708},
        "best_season": "November to March",
        "budget_tier": "luxury",
        "price_range": {"min": 2499, "max": 4999},
        "estimated_budget": 2499,
        "rating": 4.7,
        "review_count": 3210,
        "local_tips": [
            "Dress modestly when visiting mosques and traditional areas",
            "Use the metro for affordable transportation",
            "Book desert safari tours in advance for best prices"
        ],
        "description": "Dubai offers a unique blend of traditional Arabian culture and cutting-edge modernity, with world-class shopping, dining, and entertainment."
    },
    {
        "id": "dest_new_003",
        "name": "Amsterdam",
        "slug": "amsterdam-netherlands",
        "country": "Netherlands",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
        "blog": "## The Venice of the North: Amsterdam\n\nAmsterdam is the Netherlands' capital, known for its artistic heritage, elaborate canal system and narrow houses with gabled facades, legacies of the city's 17th-century Golden Age. Its Museum District houses the Van Gogh Museum, works by Rembrandt and Vermeer at the Rijksmuseum, and modern art at the Stedelijk. Cycling is key to the city's character, and there are numerous bike paths.",
        "highlights": ["Canal Cruise", "Anne Frank House", "Van Gogh Museum", "Rijksmuseum", "Vondelpark"],
        "quick_fact": "Amsterdam has more bicycles than people and over 100 kilometers of canals",
        "coordinates": {"lat": 52.3676, "lng": 4.9041},
        "best_season": "April to May, September to November",
        "budget_tier": "mid-range",
        "price_range": {"min": 1799, "max": 2899},
        "estimated_budget": 1799,
        "rating": 4.6,
        "review_count": 2650,
        "local_tips": [
            "Rent a bike to explore the city like a local",
            "Book museum tickets online to skip long queues",
            "Try stroopwafels and Dutch cheese at local markets"
        ],
        "description": "Amsterdam is a charming city of canals, world-class museums, and vibrant culture, perfect for art lovers and cycling enthusiasts."
    },
    {
        "id": "dest_new_004",
        "name": "Maldives",
        "slug": "maldives",
        "country": "Maldives",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80",
        "blog": "## Paradise on Earth: Maldives\n\nThe Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It's known for its beaches, blue lagoons and extensive reefs. The capital, Malé, has a busy fish market, restaurants and shops on the main road, Majeedhee Magu, and 17th-century Hukuru Miskiy (also known as Friday Mosque) made of carved white coral.",
        "highlights": ["Overwater Bungalows", "Snorkeling & Diving", "Bioluminescent Beaches", "Island Hopping", "Spa Resorts"],
        "quick_fact": "The Maldives is the world's lowest-lying country with crystal-clear waters and pristine beaches",
        "coordinates": {"lat": 3.2028, "lng": 73.2207},
        "best_season": "November to April",
        "budget_tier": "luxury",
        "price_range": {"min": 3499, "max": 7999},
        "estimated_budget": 3499,
        "rating": 4.9,
        "review_count": 2340,
        "local_tips": [
            "Book all-inclusive resorts for best value",
            "Visit local islands for authentic Maldivian culture",
            "Bring reef-safe sunscreen to protect marine life"
        ],
        "description": "The Maldives offers the ultimate tropical paradise experience with luxurious overwater villas, world-class diving, and pristine beaches."
    },
    {
        "id": "dest_new_005",
        "name": "Iceland",
        "slug": "iceland",
        "country": "Iceland",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=1200&q=80",
        "blog": "## Land of Fire and Ice: Iceland\n\nIceland, a Nordic island nation, is defined by its dramatic landscape with volcanoes, geysers, hot springs and lava fields. Massive glaciers are protected in Vatnajökull and Snæfellsjökull national parks. Most of the population lives in the capital, Reykjavik, which runs on geothermal power and is home to the National and Saga museums, tracing Iceland's Viking history.",
        "highlights": ["Blue Lagoon", "Golden Circle", "Northern Lights", "Jökulsárlón Glacier Lagoon", "Waterfalls"],
        "quick_fact": "Iceland has no mosquitoes and is one of the best places to see the Northern Lights",
        "coordinates": {"lat": 64.9631, "lng": -19.0208},
        "best_season": "June to August (summer), September to March (Northern Lights)",
        "budget_tier": "luxury",
        "price_range": {"min": 2799, "max": 4999},
        "estimated_budget": 2799,
        "rating": 4.8,
        "review_count": 1890,
        "local_tips": [
            "Rent a 4x4 vehicle for exploring the countryside",
            "Try traditional Icelandic hot dogs and skyr",
            "Book Blue Lagoon tickets well in advance"
        ],
        "description": "Iceland offers otherworldly landscapes with glaciers, volcanoes, geysers, and the magical Northern Lights."
    },
    {
        "id": "dest_new_006",
        "name": "Singapore",
        "slug": "singapore",
        "country": "Singapore",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
        "blog": "## The Lion City: Singapore\n\nSingapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population. Its colonial core centers on the Padang, a cricket field since the 1830s and now flanked by grand buildings such as City Hall. In Singapore's circa-1820 Chinatown stands the red-and-gold Buddha Tooth Relic Temple, said to house one of Buddha's teeth.",
        "highlights": ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Hawker Centers", "Universal Studios"],
        "quick_fact": "Singapore is one of the world's cleanest and safest cities with incredible food culture",
        "coordinates": {"lat": 1.3521, "lng": 103.8198},
        "best_season": "February to April",
        "budget_tier": "mid-range",
        "price_range": {"min": 1899, "max": 3299},
        "estimated_budget": 1899,
        "rating": 4.7,
        "review_count": 2780,
        "local_tips": [
            "Try hawker center food for authentic and affordable meals",
            "Use the efficient MRT system for transportation",
            "Visit during the Great Singapore Sale (June-July) for shopping deals"
        ],
        "description": "Singapore is a vibrant city-state blending modern architecture, lush gardens, diverse cuisine, and rich cultural heritage."
    },
    {
        "id": "dest_new_007",
        "name": "Machu Picchu",
        "slug": "machu-picchu-peru",
        "country": "Peru",
        "continent": "South America",
        "image_url": "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200&q=80",
        "blog": "## The Lost City of the Incas: Machu Picchu\n\nMachu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it's renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments and panoramic views. Its exact former use remains a mystery.",
        "highlights": ["Inca Citadel", "Huayna Picchu Hike", "Sun Gate", "Sacred Valley", "Aguas Calientes"],
        "quick_fact": "Machu Picchu was voted one of the New Seven Wonders of the World in 2007",
        "coordinates": {"lat": -13.1631, "lng": -72.5450},
        "best_season": "April to October",
        "budget_tier": "mid-range",
        "price_range": {"min": 1699, "max": 2899},
        "estimated_budget": 1699,
        "rating": 4.9,
        "review_count": 3450,
        "local_tips": [
            "Book entrance tickets months in advance",
            "Acclimatize in Cusco before visiting to avoid altitude sickness",
            "Take the early morning train for fewer crowds"
        ],
        "description": "Machu Picchu is one of the world's most iconic archaeological sites, offering breathtaking views and ancient Incan history."
    },
    {
        "id": "dest_new_008",
        "name": "Venice",
        "slug": "venice-italy",
        "country": "Italy",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&q=80",
        "blog": "## The Floating City: Venice\n\nVenice, the capital of northern Italy's Veneto region, is built on more than 100 small islands in a lagoon in the Adriatic Sea. It has no roads, just canals – including the Grand Canal thoroughfare – lined with Renaissance and Gothic palaces. The central square, Piazza San Marco, contains St. Mark's Basilica, which is tiled with Byzantine mosaics, and the Campanile bell tower offering views of the city's red roofs.",
        "highlights": ["Grand Canal", "St. Mark's Basilica", "Rialto Bridge", "Gondola Rides", "Murano Glass"],
        "quick_fact": "Venice is built on 118 islands connected by over 400 bridges",
        "coordinates": {"lat": 45.4408, "lng": 12.3155},
        "best_season": "April to June, September to November",
        "budget_tier": "luxury",
        "price_range": {"min": 2199, "max": 3999},
        "estimated_budget": 2199,
        "rating": 4.7,
        "review_count": 2990,
        "local_tips": [
            "Get lost in the backstreets away from tourist crowds",
            "Try cicchetti (Venetian tapas) at local bacari",
            "Visit early morning or late evening for the best atmosphere"
        ],
        "description": "Venice is a unique floating city of canals, art, and romance, offering unforgettable gondola rides and Renaissance architecture."
    },
    {
        "id": "dest_new_009",
        "name": "Petra",
        "slug": "petra-jordan",
        "country": "Jordan",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1200&q=80",
        "blog": "## The Rose City: Petra\n\nPetra is a famous archaeological site in Jordan's southwestern desert. Dating to around 300 B.C., it was the capital of the Nabatean Kingdom. Accessed via a narrow canyon called Al Siq, it contains tombs and temples carved into pink sandstone cliffs, earning its nickname, the 'Rose City.' Perhaps its most famous structure is 45m-high Al Khazneh, a temple with an ornate, Greek-style facade, and known as The Treasury.",
        "highlights": ["The Treasury", "Monastery", "Siq Canyon", "Royal Tombs", "High Place of Sacrifice"],
        "quick_fact": "Petra is one of the New Seven Wonders of the World and was featured in Indiana Jones",
        "coordinates": {"lat": 30.3285, "lng": 35.4444},
        "best_season": "March to May, September to November",
        "budget_tier": "mid-range",
        "price_range": {"min": 1599, "max": 2699},
        "estimated_budget": 1599,
        "rating": 4.8,
        "review_count": 2120,
        "local_tips": [
            "Wear comfortable hiking shoes for exploring",
            "Visit early morning to avoid heat and crowds",
            "Consider a 2-day pass to fully explore the site"
        ],
        "description": "Petra is an ancient city carved into rose-red cliffs, offering one of the world's most spectacular archaeological experiences."
    },
    {
        "id": "dest_new_010",
        "name": "Bora Bora",
        "slug": "bora-bora-french-polynesia",
        "country": "French Polynesia",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1589197331516-e4d9e6d0e8e6?w=1200&q=80",
        "blog": "## The Pearl of the Pacific: Bora Bora\n\nBora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus (islets) and a turquoise lagoon protected by a coral reef, it's known for its scuba diving. It's also a popular luxury resort destination where some guest bungalows are perched over the water on stilts. At the island's center rises Mt. Otemanu, a 727m dormant volcano.",
        "highlights": ["Overwater Bungalows", "Lagoon Tours", "Mount Otemanu", "Coral Gardens", "Matira Beach"],
        "quick_fact": "Bora Bora's lagoon is one of the most beautiful in the world with stunning turquoise waters",
        "coordinates": {"lat": -16.5004, "lng": -151.7415},
        "best_season": "May to October",
        "budget_tier": "luxury",
        "price_range": {"min": 4999, "max": 9999},
        "estimated_budget": 4999,
        "rating": 4.9,
        "review_count": 1680,
        "local_tips": [
            "Book overwater bungalows well in advance",
            "Try poisson cru (Tahitian ceviche)",
            "Take a lagoon tour to see manta rays and sharks"
        ],
        "description": "Bora Bora is the ultimate luxury tropical paradise with crystal-clear lagoons, overwater villas, and world-class resorts."
    },
    {
        "id": "dest_new_011",
        "name": "Edinburgh",
        "slug": "edinburgh-scotland",
        "country": "United Kingdom",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80",
        "blog": "## The Athens of the North: Edinburgh\n\nEdinburgh is Scotland's compact, hilly capital. It has a medieval Old Town and elegant Georgian New Town with gardens and neoclassical buildings. Looming over the city is Edinburgh Castle, home to Scotland's crown jewels and the Stone of Destiny, used in the coronation of Scottish rulers. Arthur's Seat is an imposing peak in Holyrood Park with sweeping views, and Calton Hill is topped with monuments and memorials.",
        "highlights": ["Edinburgh Castle", "Royal Mile", "Arthur's Seat", "Holyrood Palace", "Edinburgh Festival"],
        "quick_fact": "Edinburgh hosts the world's largest arts festival every August",
        "coordinates": {"lat": 55.9533, "lng": -3.1883},
        "best_season": "May to September",
        "budget_tier": "mid-range",
        "price_range": {"min": 1699, "max": 2799},
        "estimated_budget": 1699,
        "rating": 4.6,
        "review_count": 2450,
        "local_tips": [
            "Book accommodation early if visiting during the Festival in August",
            "Climb Arthur's Seat for panoramic city views",
            "Try haggis and Scottish whisky at traditional pubs"
        ],
        "description": "Edinburgh is a historic and cultural gem with medieval architecture, stunning castles, and vibrant festivals."
    }
]

# Load current destinations
with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

print(f"Current destination count: {len(destinations)}")

# Add new destinations
for dest in new_destinations:
    # Check if destination already exists
    if not any(d['name'] == dest['name'] for d in destinations):
        destinations.append(dest)
        print(f"✓ Added: {dest['name']}")
    else:
        print(f"⊘ Skipped (already exists): {dest['name']}")

# Save updated destinations
with open('backend/data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"\n✅ Successfully updated destinations!")
print(f"New destination count: {len(destinations)}")
