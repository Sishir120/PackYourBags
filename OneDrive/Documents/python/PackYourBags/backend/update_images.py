"""
Update destinations with real Unsplash images
"""
from app import create_app
from database import db
from models import Destination

app = create_app()

# High-quality travel images from Unsplash
image_mappings = {
    "Pokhara": ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
    "Zanzibar": ["https://images.unsplash.com/photo-1612532275214-e4ca76d0d9a3?w=800", "https://images.unsplash.com/photo-1590521305068-4e1d5e812c55?w=800"],
    "Kyoto": ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800", "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800"],
    "Reykjavik": ["https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800", "https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=800"],
    "Porto": ["https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800"],
    "Cartagena": ["https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800", "https://images.unsplash.com/photo-1582719366702-4e0c9c0c1d16?w=800"],
    "Dubrovnik": ["https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800", "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800"],
    "Prague": ["https://images.unsplash.com/photo-1541849546-216549ae216d?w=800", "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800"],
    "Banff": ["https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"],
    "Cusco": ["https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800", "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800"],
    "Marrakech": ["https://images.unsplash.com/photo-1539020618540-9c1e4b0f6d0a?w=800", "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800"],
    "Cape Town": ["https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800", "https://images.unsplash.com/photo-1563656157432-67560011e209?w=800"],
    "Queenstown": ["https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"],
    "Great Barrier Reef": ["https://images.unsplash.com/photo-1587139223877-04cb899fa3e8?w=800", "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800"],
    "Fiji Islands": ["https://images.unsplash.com/photo-1571117891515-95f75f8c83cd?w=800", "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
    "Tulum": ["https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800", "https://images.unsplash.com/photo-1512813498716-52184f752b3e?w=800"],
    "Bali": ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", "https://images.unsplash.com/photo-1555400428-5a7c738faf33?w=800"],
    "Hanoi": ["https://images.unsplash.com/photo-1528127269322-539801943592?w=800", "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?w=800"],
    "Kathmandu": ["https://images.unsplash.com/photo-1558461557-6b47e7865df8?w=800", "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800"],
    "Chitwan National Park": ["https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800", "https://images.unsplash.com/photo-1551127808-9cd47b8960d5?w=800"]
}

with app.app_context():
    print("Updating destination images...")
    
    destinations = Destination.query.all()
    updated_count = 0
    
    for dest in destinations:
        if dest.name in image_mappings:
            dest.images = image_mappings[dest.name]
            updated_count += 1
            print(f"✓ Updated {dest.name} with {len(dest.images)} images")
    
    db.session.commit()
    print(f"\n✅ Updated {updated_count} destinations with real images!")
