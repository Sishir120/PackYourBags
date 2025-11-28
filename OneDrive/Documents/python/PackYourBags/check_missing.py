import json

current_destinations = []
try:
    with open('backend/data/destinations.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        current_destinations = [d['name'] for d in data]
except Exception as e:
    print(f"Error reading file: {e}")

expected_destinations = [
    # Batch 1
    'Pokhara', 'Kathmandu', 'Seoul', 'Paris', 'Tokyo', 'Bali', 'Prague', 'Hanoi', 'London', 'Rome',
    # Batch 2
    'Chitwan National Park', 'Kyoto', 'New York City', 'Cusco', 'Tulum', 'Marrakech', 'Cape Town', 'Sydney', 'Barcelona', 'Rio de Janeiro',
    # Batch 3
    'Porto', 'Reykjavik', 'Dubrovnik', 'Cartagena', 'Banff', 'Zanzibar', 'Queenstown', 'Great Barrier Reef', 'Fiji Islands', 'Mount Kilimanjaro',
    # Batch 4
    'Inca Trail', 'Milford Track', 'Tour du Mont Blanc', 'Appalachian Trail', 'Drakensberg Mountains', 'Torres del Paine', 'Mount Fuji', 'Buenos Aires'
]

missing = [d for d in expected_destinations if d not in current_destinations]

print(f"Current count: {len(current_destinations)}")
print(f"Missing count: {len(missing)}")
print("Missing destinations:")
for m in missing:
    print(f"- {m}")
