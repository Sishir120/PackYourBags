import json
import random

# Load destinations
with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
    destinations = json.load(f)

updated_count = 0
for dest in destinations:
    # Generate realistic ratings for popular destinations
    # Weighted towards 4.5 - 4.9 range
    base_rating = random.choice([4.5, 4.6, 4.7, 4.8, 4.9])
    
    # Add some variation
    rating = base_rating + random.uniform(-0.1, 0.05)
    rating = round(min(5.0, max(4.0, rating)), 1)
    
    # Generate realistic review counts (between 500 and 3500)
    review_count = random.randint(500, 3500)
    
    dest['rating'] = rating
    dest['review_count'] = review_count
    updated_count += 1

# Save updated destinations
with open('backend/data/destinations.json', 'w', encoding='utf-8') as f:
    json.dump(destinations, f, indent=2, ensure_ascii=False)

print(f"✅ Successfully added ratings and review counts to {updated_count} destinations!")
