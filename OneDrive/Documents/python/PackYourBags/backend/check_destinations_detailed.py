from app import create_app
from database import db
from models import Destination

app = create_app()

with app.app_context():
    destinations = Destination.query.all()
    print(f"Total destinations: {len(destinations)}")
    
    # Get continents
    continents = set(d.continent for d in destinations)
    print(f"Continents: {sorted(continents)}")
    
    # Get countries
    countries = set(d.country for d in destinations)
    print(f"Total countries: {len(countries)}")
    
    # Check activities distribution
    activity_destinations = {
        'trekking': [],
        'hiking': [],
        'beach': [],
        'cultural': [],
        'food': []
    }
    
    for dest in destinations:
        if dest.highlights:
            for highlight in dest.highlights:
                highlight_lower = highlight.lower()
                if 'trek' in highlight_lower and dest not in activity_destinations['trekking']:
                    activity_destinations['trekking'].append(dest)
                elif 'hike' in highlight_lower and dest not in activity_destinations['hiking']:
                    activity_destinations['hiking'].append(dest)
                elif 'beach' in highlight_lower and dest not in activity_destinations['beach']:
                    activity_destinations['beach'].append(dest)
                elif ('culture' in highlight_lower or 'historic' in highlight_lower or 
                      'temple' in highlight_lower or 'palace' in highlight_lower) and dest not in activity_destinations['cultural']:
                    activity_destinations['cultural'].append(dest)
                elif ('food' in highlight_lower or 'cuisine' in highlight_lower or 
                      'sushi' in highlight_lower or 'ramen' in highlight_lower or 
                      'mole' in highlight_lower or 'taco' in highlight_lower) and dest not in activity_destinations['food']:
                    activity_destinations['food'].append(dest)
    
    print("\nActivity distribution:")
    for activity, dests in activity_destinations.items():
        print(f"  {activity}: {len(dests)} destinations")
    
    # Get distribution by continent
    continent_destinations = {}
    for dest in destinations:
        if dest.continent in continent_destinations:
            continent_destinations[dest.continent].append(dest)
        else:
            continent_destinations[dest.continent] = [dest]
    
    print("\nDestinations by continent:")
    for continent, dests in continent_destinations.items():
        print(f"  {continent}: {len(dests)} destinations")
        
    # Show some examples for each activity
    print("\nSample destinations by activity:")
    for activity, dests in activity_destinations.items():
        print(f"\n  {activity.upper()}:")
        for dest in dests[:3]:  # Show first 3
            print(f"    - {dest.name} ({dest.country})")