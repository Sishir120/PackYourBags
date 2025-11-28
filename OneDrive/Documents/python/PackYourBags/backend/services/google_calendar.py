"""
Google Calendar Integration Service for Weekend Wizard
"""
import os
import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import requests
from cryptography.fernet import Fernet  # pyright: ignore[reportMissingImports]
from models import User
from database import db

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get encryption key from environment (should be stored securely)
ENCRYPTION_KEY = os.getenv('GOOGLE_CALENDAR_ENCRYPTION_KEY', Fernet.generate_key())
fernet = Fernet(ENCRYPTION_KEY)

class GoogleCalendarService:
    """Service for interacting with Google Calendar API"""
    
    def __init__(self):
        self.base_url = "https://www.googleapis.com/calendar/v3"
        self.serpapi_key = os.getenv('SERPAPI_KEY')
        
    def encrypt_token(self, token: str) -> bytes:
        """Encrypt Google OAuth token"""
        return fernet.encrypt(token.encode())
    
    def decrypt_token(self, encrypted_token: bytes) -> str:
        """Decrypt Google OAuth token"""
        return fernet.decrypt(encrypted_token).decode()
    
    def store_user_token(self, user_id: int, token: str) -> bool:
        """Store encrypted user Google Calendar token"""
        try:
            user = User.query.get(user_id)
            if not user:
                return False
                
            encrypted_token = self.encrypt_token(token)
            # In a real implementation, we would store this in a separate table
            # For now, we'll store it in user preferences
            if not user.preferences:
                user.preferences = {}
            
            user.preferences['google_calendar_token'] = encrypted_token.decode('utf-8')
            db.session.commit()
            return True
        except Exception as e:
            logger.error(f"Error storing user token: {str(e)}")
            return False
    
    def get_user_token(self, user_id: int) -> Optional[str]:
        """Retrieve and decrypt user Google Calendar token"""
        try:
            user = User.query.get(user_id)
            if not user or not user.preferences:
                return None
                
            encrypted_token = user.preferences.get('google_calendar_token')
            if not encrypted_token:
                return None
                
            return self.decrypt_token(encrypted_token.encode('utf-8'))
        except Exception as e:
            logger.error(f"Error retrieving user token: {str(e)}")
            return None
    
    def get_calendar_events(self, user_id: int, days_ahead: int = 120) -> List[Dict]:
        """Get user's calendar events for the next specified days"""
        try:
            token = self.get_user_token(user_id)
            if not token:
                raise Exception("No Google Calendar token found for user")
            
            # Calculate time range
            now = datetime.utcnow()
            end_time = now + timedelta(days=days_ahead)
            
            # Format times for Google Calendar API
            time_min = now.isoformat() + 'Z'  # 'Z' indicates UTC time
            time_max = end_time.isoformat() + 'Z'
            
            # Make API request to Google Calendar
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            params = {
                'timeMin': time_min,
                'timeMax': time_max,
                'singleEvents': True,
                'orderBy': 'startTime'
            }
            
            response = requests.get(
                f"{self.base_url}/calendars/primary/events",
                headers=headers,
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('items', [])
            else:
                logger.error(f"Google Calendar API error: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            logger.error(f"Error fetching calendar events: {str(e)}")
            return []
    
    def cache_calendar_events(self, user_id: int, events: List[Dict]) -> bool:
        """Cache calendar events for 6 hours to avoid rate limiting"""
        try:
            # In a real implementation, we would use Redis or similar caching
            # For now, we'll store in user preferences with expiration
            user = User.query.get(user_id)
            if not user:
                return False
                
            if not user.preferences:
                user.preferences = {}
            
            cache_data = {
                'events': events,
                'cached_at': datetime.utcnow().isoformat(),
                'expires_at': (datetime.utcnow() + timedelta(hours=6)).isoformat()
            }
            
            user.preferences['calendar_cache'] = cache_data
            db.session.commit()
            return True
        except Exception as e:
            logger.error(f"Error caching calendar events: {str(e)}")
            return False
    
    def get_cached_events(self, user_id: int) -> Optional[List[Dict]]:
        """Get cached calendar events if still valid"""
        try:
            user = User.query.get(user_id)
            if not user or not user.preferences:
                return None
                
            cache_data = user.preferences.get('calendar_cache')
            if not cache_data:
                return None
                
            # Check if cache is still valid
            expires_at = datetime.fromisoformat(cache_data['expires_at'])
            if datetime.utcnow() > expires_at:
                return None
                
            return cache_data['events']
        except Exception as e:
            logger.error(f"Error retrieving cached events: {str(e)}")
            return None
    
    def find_free_weekend(self, user_id: int) -> Optional[Dict]:
        """Find the first 3-day weekend with >= 54 hours free"""
        try:
            # Check cache first
            events = self.get_cached_events(user_id)
            if not events:
                # Fetch fresh events
                events = self.get_calendar_events(user_id)
                # Cache for 6 hours
                self.cache_calendar_events(user_id, events)
            
            # Parse events into datetime objects
            busy_times = []
            for event in events:
                start = event.get('start', {}).get('dateTime')
                end = event.get('end', {}).get('dateTime')
                
                if start and end:
                    try:
                        start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
                        end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
                        busy_times.append((start_dt, end_dt))
                    except Exception as e:
                        logger.warning(f"Error parsing event time: {str(e)}")
                        continue
            
            # Find free weekends
            now = datetime.utcnow()
            end_period = now + timedelta(days=120)
            
            # Check each weekend in the period
            current_date = now
            while current_date < end_period:
                # Find next Friday
                days_until_friday = (4 - current_date.weekday()) % 7
                if days_until_friday == 0:
                    days_until_friday = 7
                friday = current_date + timedelta(days=days_until_friday)
                
                # Weekend is Friday to Sunday (3 days)
                weekend_start = friday
                weekend_end = friday + timedelta(days=2)
                
                # Calculate busy time during weekend
                busy_hours = 0
                for start_dt, end_dt in busy_times:
                    # Check if event overlaps with weekend
                    if start_dt < weekend_end and end_dt > weekend_start:
                        # Calculate overlap
                        overlap_start = max(start_dt, weekend_start)
                        overlap_end = min(end_dt, weekend_end)
                        overlap_hours = (overlap_end - overlap_start).total_seconds() / 3600
                        busy_hours += overlap_hours
                
                # Total weekend hours = 72 (3 days * 24 hours)
                free_hours = 72 - busy_hours
                
                if free_hours >= 54:
                    return {
                        'start_date': weekend_start.isoformat(),
                        'end_date': weekend_end.isoformat(),
                        'free_hours': free_hours,
                        'total_hours': 72
                    }
                
                # Move to next day
                current_date = friday + timedelta(days=1)
            
            return None
            
        except Exception as e:
            logger.error(f"Error finding free weekend: {str(e)}")
            return None
    
    def get_flight_prices(self, home_airport: str, destinations: List[str], 
                         start_date: str, end_date: str) -> List[Dict]:
        """Get flight prices using SerpAPI (Google Flights proxy)"""
        try:
            if not self.serpapi_key:
                logger.error("SERPAPI_KEY not configured")
                return []
            
            prices = []
            
            for destination in destinations:
                try:
                    # Call SerpAPI for flight prices
                    params = {
                        'api_key': self.serpapi_key,
                        'engine': 'google_flights',
                        'departure_id': home_airport,
                        'arrival_id': destination,
                        'outbound_date': start_date.split('T')[0],  # YYYY-MM-DD format
                        'return_date': end_date.split('T')[0],
                        'currency': 'USD',
                        'hl': 'en'
                    }
                    
                    response = requests.get('https://serpapi.com/search', params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        best_flights = data.get('best_flights', [])
                        
                        if best_flights:
                            # Get the cheapest flight
                            cheapest_flight = min(best_flights, key=lambda x: x.get('price', float('inf')))
                            prices.append({
                                'destination': destination,
                                'price': cheapest_flight.get('price'),
                                'airline': cheapest_flight.get('airline'),
                                'departure_time': cheapest_flight.get('departure_time'),
                                'arrival_time': cheapest_flight.get('arrival_time')
                            })
                    else:
                        logger.warning(f"SerpAPI error for {destination}: {response.status_code}")
                        
                except Exception as e:
                    logger.error(f"Error getting flight price for {destination}: {str(e)}")
                    continue
            
            return prices
            
        except Exception as e:
            logger.error(f"Error getting flight prices: {str(e)}")
            return []

# Initialize service
google_calendar_service = GoogleCalendarService()