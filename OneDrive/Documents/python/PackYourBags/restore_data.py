import json
import random

# Missing destinations data to restore
missing_destinations = [
    {
        "id": "dest_restore_001",
        "name": "Seoul",
        "slug": "seoul-south-korea",
        "country": "South Korea",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80",
        "blog": "## The Soul of Asia: Seoul\n\nSeoul, the capital of South Korea, is a huge metropolis where modern skyscrapers, high-tech subways and pop culture meet Buddhist temples, palaces and street markets. Notable attractions include futuristic Dongdaemun Design Plaza, a convention hall with curving architecture and a rooftop park; Gyeongbokgung Palace, which once had more than 7,000 rooms; and Jogyesa Temple, site of ancient locust and pine trees.",
        "highlights": ["Gyeongbokgung Palace", "Myeongdong Shopping", "Bukchon Hanok Village", "N Seoul Tower", "Hongdae District"],
        "quick_fact": "Dynamic metropolis where ancient palaces meet futuristic technology and K-pop culture",
        "coordinates": {"lat": 37.5665, "lng": 126.9780},
        "best_season": "March to May, September to November",
        "budget_tier": "mid-range",
        "price_range": {"min": 1299, "max": 1799},
        "estimated_budget": 1299,
        "rating": 4.8,
        "review_count": 1542
    },
    {
        "id": "dest_restore_002",
        "name": "Paris",
        "slug": "paris-france",
        "country": "France",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
        "blog": "## The City of Light: Paris\n\nParis, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.",
        "highlights": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Seine River Cruise"],
        "quick_fact": "Global center for art, fashion, and gastronomy known as the City of Light",
        "coordinates": {"lat": 48.8566, "lng": 2.3522},
        "best_season": "June to August, September to October",
        "budget_tier": "luxury",
        "price_range": {"min": 2199, "max": 2799},
        "estimated_budget": 2199,
        "rating": 4.7,
        "review_count": 3210
    },
    {
        "id": "dest_restore_003",
        "name": "Tokyo",
        "slug": "tokyo-japan",
        "country": "Japan",
        "continent": "Asia",
        "image_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
        "blog": "## The Neon Metropolis: Tokyo\n\nTokyo, Japan’s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods. The Imperial Palace sits amid large public gardens. The city's many museums offer exhibits ranging from classical art (in the Tokyo National Museum) to a reconstructed kabuki theater (in the Edo-Tokyo Museum).",
        "highlights": ["Shibuya Crossing", "Senso-ji Temple", "Tokyo Skytree", "Meiji Shrine", "Akihabara"],
        "quick_fact": "Bustling capital mixing ultramodern neon skyscrapers with historic temples",
        "coordinates": {"lat": 35.6762, "lng": 139.6503},
        "best_season": "March to May, October to November",
        "budget_tier": "mid-range",
        "price_range": {"min": 1599, "max": 2099},
        "estimated_budget": 1599,
        "rating": 4.9,
        "review_count": 2890
    },
    {
        "id": "dest_restore_004",
        "name": "London",
        "slug": "london-uk",
        "country": "United Kingdom",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
        "blog": "## The Historic Capital: London\n\nLondon, the capital of England and the United Kingdom, is a 21st-century city with history stretching back to Roman times. At its centre stand the imposing Houses of Parliament, the iconic 'Big Ben' clock tower and Westminster Abbey, site of British monarch coronations. Across the Thames River, the London Eye observation wheel provides panoramic views of the South Bank cultural complex, and the entire city.",
        "highlights": ["Big Ben", "Tower of London", "British Museum", "Buckingham Palace", "London Eye"],
        "quick_fact": "Historic capital blending Roman history with modern culture and iconic landmarks",
        "coordinates": {"lat": 51.5074, "lng": -0.1278},
        "best_season": "May to September",
        "budget_tier": "luxury",
        "price_range": {"min": 1899, "max": 2299},
        "estimated_budget": 1899,
        "rating": 4.6,
        "review_count": 3100
    },
    {
        "id": "dest_restore_005",
        "name": "Rome",
        "slug": "rome-italy",
        "country": "Italy",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
        "blog": "## The Eternal City: Rome\n\nRome, Italy’s capital, is a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture on display. Ancient ruins such as the Forum and the Colosseum evoke the power of the former Roman Empire. Vatican City, headquarters of the Roman Catholic Church, has St. Peter’s Basilica and the Vatican Museums, which house masterpieces such as Michelangelo’s Sistine Chapel frescoes.",
        "highlights": ["Colosseum", "Vatican City", "Trevi Fountain", "Pantheon", "Roman Forum"],
        "quick_fact": "The Eternal City showcasing 3,000 years of art, architecture, and culture",
        "coordinates": {"lat": 41.9028, "lng": 12.4964},
        "best_season": "April to June, September to October",
        "budget_tier": "mid-range",
        "price_range": {"min": 1699, "max": 2199},
        "estimated_budget": 1699,
        "rating": 4.7,
        "review_count": 2950
    },
    {
        "id": "dest_restore_006",
        "name": "New York City",
        "slug": "new-york-city-usa",
        "country": "United States",
        "continent": "Americas",
        "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
        "blog": "## The City That Never Sleeps: New York City\n\nNew York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. At its core is Manhattan, a densely populated borough that’s among the world’s major commercial, financial and cultural centers. Its iconic sites include skyscrapers such as the Empire State Building and sprawling Central Park. Broadway theater is staged in neon-lit Times Square.",
        "highlights": ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Broadway"],
        "quick_fact": "Global cultural hub known for its skyline, Broadway, and 24/7 energy",
        "coordinates": {"lat": 40.7128, "lng": -74.0060},
        "best_season": "April to June, September to November",
        "budget_tier": "luxury",
        "price_range": {"min": 1399, "max": 1899},
        "estimated_budget": 1399,
        "rating": 4.8,
        "review_count": 3400
    },
    {
        "id": "dest_restore_007",
        "name": "Sydney",
        "slug": "sydney-australia",
        "country": "Australia",
        "continent": "Oceania",
        "image_url": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80",
        "blog": "## The Harbour City: Sydney\n\nSydney, capital of New South Wales and one of Australia's largest cities, is best known for its harbourfront Sydney Opera House, with a distinctive sail-like design. Massive Darling Harbour and the smaller Circular Quay port are hubs of waterside life, with the arched Harbour Bridge and esteemed Royal Botanic Garden nearby. Sydney Tower’s outdoor platform, the Skywalk, offers 360-degree views of the city and suburbs.",
        "highlights": ["Sydney Opera House", "Bondi Beach", "Harbour Bridge", "Darling Harbour", "Taronga Zoo"],
        "quick_fact": "Vibrant harbour city famous for its Opera House, surf beaches, and sunny lifestyle",
        "coordinates": {"lat": -33.8688, "lng": 151.2093},
        "best_season": "September to November, March to May",
        "budget_tier": "luxury",
        "price_range": {"min": 1499, "max": 1999},
        "estimated_budget": 1499,
        "rating": 4.7,
        "review_count": 2100
    },
    {
        "id": "dest_restore_008",
        "name": "Barcelona",
        "slug": "barcelona-spain",
        "country": "Spain",
        "continent": "Europe",
        "image_url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80",
        "blog": "## The Cosmopolitan Capital: Barcelona\n\nBarcelona, the cosmopolitan capital of Spain’s Catalonia region, is known for its art and architecture. The fantastical Sagrada Família church and other modernist landmarks designed by Antoni Gaudí dot the city. Museu Picasso and Fundació Joan Miró feature modern art by their namesakes. City history museum MUHBA, includes several Roman archaeological sites.",
        "highlights": ["Sagrada Família", "Park Güell", "La Rambla", "Gothic Quarter", "Casa Batlló"],
        "quick_fact": "Vibrant city famed for Gaudí's architecture, beaches, and world-class cuisine",
        "coordinates": {"lat": 41.3851, "lng": 2.1734},
        "best_season": "May to June, September to October",
        "budget_tier": "mid-range",
        "price_range": {"min": 899, "max": 1299},
        "estimated_budget": 899,
        "rating": 4.6,
        "review_count": 2750
    },
    {
        "id": "dest_restore_009",
        "name": "Rio de Janeiro",
        "slug": "rio-de-janeiro-brazil",
        "country": "Brazil",
        "continent": "Americas",
        "image_url": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80",
        "blog": "## The Marvelous City: Rio de Janeiro\n\nRio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop Mount Corcovado and for Sugarloaf Mountain, a granite peak with cable cars to its summit. The city is also known for its sprawling favelas (shanty towns). Its raucous Carnaval festival, featuring parade floats, flamboyant costumes and samba dancers, is considered the world’s largest.",
        "highlights": ["Christ the Redeemer", "Copacabana Beach", "Sugarloaf Mountain", "Ipanema Beach", "Tijuca National Park"],
        "quick_fact": "Vibrant city known for samba, beaches, and the iconic Christ the Redeemer statue",
        "coordinates": {"lat": -22.9068, "lng": -43.1729},
        "best_season": "December to March",
        "budget_tier": "mid-range",
        "price_range": {"min": 1199, "max": 1799},
        "estimated_budget": 1199,
        "rating": 4.5,
        "review_count": 2300
    }
]

# Load current destinations
try:
    with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
        destinations = json.load(f)
except Exception as e:
    print(f"Error loading destinations.json: {e}")
    destinations = []

# Append missing destinations if they don't exist
added_count = 0
existing_names = {d['name'] for d in destinations}

for dest in missing_destinations:
    if dest['name'] not in existing_names:
        destinations.append(dest)
        added_count += 1
        print(f"Restored: {dest['name']}")
    else:
        print(f"Skipped (already exists): {dest['name']}")

# Save updated destinations
with open('backend/data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"\n✅ Successfully restored {added_count} destinations!")
print(f"Total destinations now: {len(destinations)}")
