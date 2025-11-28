from app import create_app
from models import Destination

app = create_app()
with app.app_context():
    destinations = Destination.query.all()
    print(f"Total destinations: {len(destinations)}")