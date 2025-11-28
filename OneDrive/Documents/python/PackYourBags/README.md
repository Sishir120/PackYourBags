# PackYourBags - AI-Powered Tourism Roulette Web App

## Project Overview

PackYourBags is a modern travel discovery web application that combines gamification with AI-powered travel recommendations. The platform uses a roulette-style interface to help users discover random or curated destinations worldwide.

## Features (Phase 1 - MVP)

✅ **Interactive Roulette Wheel**: Spin to discover random destinations with smooth 3-5 second animation
✅ **Smart Filtering**: Filter destinations by Global, Continent, or Country
✅ **Destination Cards**: Beautiful, responsive cards with highlights and travel facts
✅ **Featured Destinations**: Explore popular destinations from around the world
✅ **Subscription System**: Email subscription with personalized travel preferences
✅ **Responsive Design**: Mobile-first design that works on all devices
✅ **Nature-Inspired Theme**: Green and blue aesthetic with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Port**: 3000

### Backend
- **Framework**: Python Flask
- **Database**: JSON files (lightweight prototype)
- **API**: RESTful endpoints
- **Port**: 5000

## Project Structure

```
PackYourBags/
├── backend/
│   ├── api/                    # API modules (future expansion)
│   ├── data/
│   │   ├── destinations.json   # 20 curated destinations
│   │   └── subscribers.json    # User subscriptions
│   ├── app.py                  # Flask application
│   └── requirements.txt        # Python dependencies
│
├── frontend_temp/              # React frontend (use this)
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── RouletteSection.jsx
│   │   │   ├── RouletteWheel.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── FeaturedDestinations.jsx
│   │   │   ├── Benefits.jsx
│   │   │   ├── Subscription.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- Git (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend_temp
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### GET /api/destinations
Retrieve destinations with optional filtering.

**Query Parameters:**
- `filter`: "global", "continent", or "country"
- `value`: filter value (continent/country name)
- `limit`: maximum results (default: 20)

**Example:**
```
GET /api/destinations?filter=continent&value=Asia
```

### POST /api/subscribe
Register user email and preferences.

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "continents": ["Asia", "Europe"],
    "budget_tier": "budget-friendly",
    "travel_style": ["adventure", "culture"]
  }
}
```

### GET /api/destination/:id/details
Get comprehensive details for a specific destination.

### GET /api/offers
Generate AI-powered personalized travel offers.

## Color Palette

- **Sky Blue**: #4A90E2 (Primary buttons, links)
- **Forest Green**: #2ECC71 (Success states, CTAs)
- **Deep Ocean**: #1A5F7A (Headings, navigation)
- **Meadow Light**: #E8F5E9 (Background sections)
- **Himalayan White**: #F5F7FA (Page background)
- **Sunset Accent**: #F39C12 (Highlights, special offers)

## Features Roadmap

### Phase 1: Foundation ✅ (Current)
- Interactive roulette with filtering
- Destination database (20 destinations)
- Basic API endpoints
- Responsive frontend
- Subscription module

### Phase 2: Content & SEO (Next)
- Blog system with SEO optimization
- Meta tags and structured data
- XML sitemap
- 10-15 AI-generated blog posts

### Phase 3: AI Features
- AI Travel Assistant popup
- Personalized itinerary generation
- Budget optimization recommendations

### Phase 4: Maps & Polish
- Google Maps integration
- Performance optimization
- Cross-browser testing
- Accessibility improvements

### Phase 5: Launch
- Production deployment
- Analytics setup
- SEO submission

## Development Notes

### Current Status
- ✅ Backend server with 20 destinations (5 continents)
- ✅ Frontend with all Phase 1 components
- ✅ Subscription system functional
- ✅ Roulette animation working
- ⏳ Testing in progress

### Known Issues
- Google Maps integration pending (Phase 4)
- Blog system placeholder (Phase 2)
- AI assistant popup pending (Phase 3)

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Lighthouse Performance Score: > 90

## Contributing

This is a prototype project. Future enhancements include:
- User authentication
- Saved destinations
- Travel planner tools
- Affiliate integrations
- User reviews and ratings

## License

Private project - All rights reserved.

## Contact

For questions or support, please refer to the project documentation.

---

**Built with ❤️ for travel enthusiasts worldwide**
# PackYourBags - AI-Powered Tourism Roulette Web App

## Project Overview

PackYourBags is a modern travel discovery web application that combines gamification with AI-powered travel recommendations. The platform uses a roulette-style interface to help users discover random or curated destinations worldwide.

## Features (Phase 1 - MVP)

✅ **Interactive Roulette Wheel**: Spin to discover random destinations with smooth 3-5 second animation
✅ **Smart Filtering**: Filter destinations by Global, Continent, or Country
✅ **Destination Cards**: Beautiful, responsive cards with highlights and travel facts
✅ **Featured Destinations**: Explore popular destinations from around the world
✅ **Subscription System**: Email subscription with personalized travel preferences
✅ **Responsive Design**: Mobile-first design that works on all devices
✅ **Nature-Inspired Theme**: Green and blue aesthetic with Tailwind CSS

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Port**: 3000

### Backend
- **Framework**: Python Flask
- **Database**: JSON files (lightweight prototype)
- **API**: RESTful endpoints
- **Port**: 5000

## Project Structure

```
PackYourBags/
├── backend/
│   ├── api/                    # API modules (future expansion)
│   ├── data/
│   │   ├── destinations.json   # 20 curated destinations
│   │   └── subscribers.json    # User subscriptions
│   ├── app.py                  # Flask application
│   └── requirements.txt        # Python dependencies
│
├── frontend_temp/              # React frontend (use this)
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── RouletteSection.jsx
│   │   │   ├── RouletteWheel.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── FeaturedDestinations.jsx
│   │   │   ├── Benefits.jsx
│   │   │   ├── Subscription.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- Git (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend_temp
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### GET /api/destinations
Retrieve destinations with optional filtering.

**Query Parameters:**
- `filter`: "global", "continent", or "country"
- `value`: filter value (continent/country name)
- `limit`: maximum results (default: 20)

**Example:**
```
GET /api/destinations?filter=continent&value=Asia
```

### POST /api/subscribe
Register user email and preferences.

**Request Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "continents": ["Asia", "Europe"],
    "budget_tier": "budget-friendly",
    "travel_style": ["adventure", "culture"]
  }
}
```

### GET /api/destination/:id/details
Get comprehensive details for a specific destination.

### GET /api/offers
Generate AI-powered personalized travel offers.

## Color Palette

- **Sky Blue**: #4A90E2 (Primary buttons, links)
- **Forest Green**: #2ECC71 (Success states, CTAs)
- **Deep Ocean**: #1A5F7A (Headings, navigation)
- **Meadow Light**: #E8F5E9 (Background sections)
- **Himalayan White**: #F5F7FA (Page background)
- **Sunset Accent**: #F39C12 (Highlights, special offers)

## Features Roadmap

### Phase 1: Foundation ✅ (Current)
- Interactive roulette with filtering
- Destination database (20 destinations)
- Basic API endpoints
- Responsive frontend
- Subscription module

### Phase 2: Content & SEO (Next)
- Blog system with SEO optimization
- Meta tags and structured data
- XML sitemap
- 10-15 AI-generated blog posts

### Phase 3: AI Features
- AI Travel Assistant popup
- Personalized itinerary generation
- Budget optimization recommendations

### Phase 4: Maps & Polish
- Google Maps integration
- Performance optimization
- Cross-browser testing
- Accessibility improvements

### Phase 5: Launch
- Production deployment
- Analytics setup
- SEO submission

## Development Notes

### Current Status
- ✅ Backend server with 20 destinations (5 continents)
- ✅ Frontend with all Phase 1 components
- ✅ Subscription system functional
- ✅ Roulette animation working
- ⏳ Testing in progress

### Known Issues
- Google Maps integration pending (Phase 4)
- Blog system placeholder (Phase 2)
- AI assistant popup pending (Phase 3)

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Lighthouse Performance Score: > 90

## Contributing

This is a prototype project. Future enhancements include:
- User authentication
- Saved destinations
- Travel planner tools
- Affiliate integrations
- User reviews and ratings

## License

Private project - All rights reserved.

## Contact

For questions or support, please refer to the project documentation.

---

**Built with ❤️ for travel enthusiasts worldwide**
