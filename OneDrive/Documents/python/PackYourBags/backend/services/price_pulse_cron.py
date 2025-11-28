import logging
from datetime import datetime, timedelta
from models import PriceWatch, User
from database import db
from services.google_calendar import google_calendar_service
from services.onesignal import onesignal_service
from services.posthog import posthog_service
import requests
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for rate limiting (in production, use Redis)
user_notification_counts = {}

def check_price_drops():
    """
    Check for price drops on all watched destinations
    This function should be called every 6 hours by a cron job
    """
    try:
        logger.info("Starting price drop check...")
        
        # Get all price watches
        all_watches = PriceWatch.query.all()
        
        # Group by user for efficiency
        user_watches = {}
        for watch in all_watches:
            if watch.user_id not in user_watches:
                user_watches[watch.user_id] = []
            user_watches[watch.user_id].append(watch)
        
        alerts_sent = 0
        
        # Check each user's watches
        for user_id, watches in user_watches.items():
            try:
                # Rate limiting: max 3 push notifications per week per user
                if _is_user_rate_limited(user_id):
                    logger.info(f"User {user_id} has reached notification limit for this week, skipping")
                    continue
                
                # Get user
                user = User.query.get(user_id)
                if not user:
                    continue
                
                # Check if user has muted alerts globally (rate limiting)
                # In a real implementation, this would use Redis
                last_alert_time = user.preferences.get('last_price_alert_time') if user.preferences else None
                if last_alert_time:
                    last_alert = datetime.fromisoformat(last_alert_time)
                    if datetime.utcnow() - last_alert < timedelta(weeks=1):
                        # User has received alerts recently, skip
                        continue
                
                # Check each watch for this user
                for watch in watches:
                    try:
                        # Check if watch is muted
                        if watch.muted_until and watch.muted_until > datetime.utcnow().date():
                            continue
                        
                        # Get user's home airport
                        home_airport = user.preferences.get('home_airport_iata') if user.preferences else None
                        if not home_airport:
                            continue
                        
                        # Get current flight price using SerpAPI
                        serpapi_key = os.getenv('SERPAPI_KEY')
                        if not serpapi_key:
                            logger.error("SERPAPI_KEY not configured")
                            continue
                        
                        # Calculate dates for next weekend (mock implementation)
                        # In a real implementation, we would get the actual dates from the watch
                        start_date = (datetime.utcnow() + timedelta(days=30)).strftime('%Y-%m-%d')
                        end_date = (datetime.utcnow() + timedelta(days=33)).strftime('%Y-%m-%d')
                        
                        # Get flight price
                        flight_params = {
                            'api_key': serpapi_key,
                            'engine': 'google_flights',
                            'departure_id': home_airport,
                            'arrival_id': watch.destination,
                            'outbound_date': start_date,
                            'return_date': end_date,
                            'currency': 'USD',
                            'hl': 'en'
                        }
                        
                        flight_response = requests.get('https://serpapi.com/search', params=flight_params)
                        flight_price = None
                        
                        if flight_response.status_code == 200:
                            flight_data = flight_response.json()
                            best_flights = flight_data.get('best_flights', [])
                            if best_flights:
                                cheapest_flight = min(best_flights, key=lambda x: x.get('price', float('inf')))
                                flight_price = cheapest_flight.get('price')
                        
                        # Get Airbnb price (mock implementation)
                        # In a real implementation, we would scrape Airbnb or use their API
                        airbnb_price = 300  # Mock price
                        
                        # Calculate total price
                        if flight_price:
                            total_price = flight_price + airbnb_price
                            
                            # Check if there's a price drop of at least 8%
                            if watch.target_price and total_price < watch.target_price:
                                pct_drop = int(((watch.target_price - total_price) / watch.target_price) * 100)
                                
                                if pct_drop >= 8:
                                    # Send alert (in real implementation, use OneSignal)
                                    logger.info(f"Price drop alert for user {user_id}: {watch.destination} is {pct_drop}% cheaper")
                                    
                                    # Check rate limiting before sending notification
                                    if _is_user_rate_limited(user_id):
                                        logger.info(f"User {user_id} has reached notification limit for this week, skipping notification")
                                        continue
                                    
                                    # Send push notification
                                    success = onesignal_service.send_price_drop_alert(
                                        user_id,
                                        watch.destination,
                                        pct_drop,
                                        total_price
                                    )
                                    
                                    if success:
                                        # Track analytics event
                                        posthog_service.track_price_drop_push_sent(
                                            user_id,
                                            watch.destination,
                                            pct_drop,
                                            total_price
                                        )
                                        
                                        # Update rate limiting counter
                                        _increment_user_notification_count(user_id)
                                        alerts_sent += 1
                                    
                                    # Update watch
                                    watch.last_price = watch.target_price
                                    watch.target_price = total_price
                                    watch.pct_drop = pct_drop
                                    db.session.commit()
                                    
                                    # Update user's last alert time
                                    if not user.preferences:
                                        user.preferences = {}
                                    user.preferences['last_price_alert_time'] = datetime.utcnow().isoformat()
                                    db.session.commit()
                        
                    except Exception as e:
                        logger.error(f"Error checking price for {watch.destination}: {str(e)}")
                        continue
                        
            except Exception as e:
                logger.error(f"Error processing watches for user {user_id}: {str(e)}")
                continue
        
        logger.info(f"Price drop check completed. Sent {alerts_sent} alerts.")
        return alerts_sent
        
    except Exception as e:
        logger.error(f"Error in price drop check: {str(e)}")
        return 0

def _is_user_rate_limited(user_id: int) -> bool:
    """
    Check if a user has reached their notification limit for the week
    
    Args:
        user_id: The user ID to check
        
    Returns:
        bool: True if user is rate limited, False otherwise
    """
    # Get the current week number
    current_week = datetime.utcnow().isocalendar()[1]
    current_year = datetime.utcnow().year
    
    # Create a key for this user and week
    key = f"{user_id}_{current_year}_{current_week}"
    
    # Check if user has exceeded limit (3 notifications per week)
    count = user_notification_counts.get(key, 0)
    return count >= 3

def _increment_user_notification_count(user_id: int) -> None:
    """
    Increment the notification count for a user for the current week
    
    Args:
        user_id: The user ID to increment count for
    """
    # Get the current week number
    current_week = datetime.utcnow().isocalendar()[1]
    current_year = datetime.utcnow().year
    
    # Create a key for this user and week
    key = f"{user_id}_{current_year}_{current_week}"
    
    # Increment count
    user_notification_counts[key] = user_notification_counts.get(key, 0) + 1

def run_price_pulse_check():
    """
    Main function to run the price pulse check
    """
    try:
        alerts_sent = check_price_drops()
        logger.info(f"Price pulse check completed. Sent {alerts_sent} alerts.")
        return alerts_sent
    except Exception as e:
        logger.error(f"Error running price pulse check: {str(e)}")
        return 0

if __name__ == "__main__":
    run_price_pulse_check()