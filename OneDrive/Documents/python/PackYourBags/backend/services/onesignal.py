"""
OneSignal Push Notification Service
"""
import os
import requests
import logging
from typing import Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OneSignalService:
    """Service for sending push notifications via OneSignal"""
    
    def __init__(self):
        self.app_id = os.getenv('ONESIGNAL_APP_ID')
        self.api_key = os.getenv('ONESIGNAL_API_KEY')
        self.base_url = 'https://onesignal.com/api/v1'
        
        if not self.app_id or not self.api_key:
            logger.warning("OneSignal credentials not configured")
    
    def send_notification(self, user_id: int, title: str, message: str, 
                         data: Dict[str, Any] = None, url: str = None) -> bool:
        """
        Send a push notification to a specific user
        
        Args:
            user_id: The user ID to send notification to
            title: Notification title
            message: Notification message
            data: Additional data to send with notification
            url: URL to open when notification is tapped
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            if not self.app_id or not self.api_key:
                logger.error("OneSignal credentials not configured")
                return False
            
            # In a real implementation, we would map user_id to OneSignal player IDs
            # For now, we'll just log the notification
            logger.info(f"Sending push notification to user {user_id}: {title} - {message}")
            
            # Example OneSignal API call (commented out for now)
            """
            payload = {
                'app_id': self.app_id,
                'include_player_ids': [self._get_player_id(user_id)],
                'headings': {'en': title},
                'contents': {'en': message},
                'data': data or {},
                'url': url
            }
            
            headers = {
                'Authorization': f'Basic {self.api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f'{self.base_url}/notifications',
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                logger.info(f"Notification sent successfully to user {user_id}")
                return True
            else:
                logger.error(f"Failed to send notification: {response.status_code} - {response.text}")
                return False
            """
            
            # For now, just return True to simulate success
            return True
            
        except Exception as e:
            logger.error(f"Error sending notification to user {user_id}: {str(e)}")
            return False
    
    def send_weekend_alert(self, user_id: int, date: str, city: str, price: int) -> bool:
        """
        Send a weekend alert notification
        
        Args:
            user_id: The user ID to send notification to
            date: The date of the weekend
            city: The destination city
            price: The flight price
            
        Returns:
            bool: True if successful, False otherwise
        """
        title = f"You have 3 days off {date}"
        message = f"Flights to {city} are ${price} rtn. Tap to lock."
        data = {
            'type': 'weekend',
            'city': city,
            'price': price,
            'date': date
        }
        url = f"packyourbags://city/{city}?source=push"
        
        return self.send_notification(user_id, title, message, data, url)
    
    def send_price_drop_alert(self, user_id: int, city: str, pct_drop: int, total_price: int) -> bool:
        """
        Send a price drop alert notification
        
        Args:
            user_id: The user ID to send notification to
            city: The destination city
            pct_drop: Percentage drop in price
            total_price: New total price
            
        Returns:
            bool: True if successful, False otherwise
        """
        title = "Price drop 🎉"
        message = f"{city} is {pct_drop} % cheaper than last week. Flight + stay now ${total_price}."
        data = {
            'type': 'price_drop',
            'city': city,
            'pct_drop': pct_drop,
            'total_price': total_price
        }
        url = f"packyourbags://city/{city}?source=push"
        
        return self.send_notification(user_id, title, message, data, url)
    
    def _get_player_id(self, user_id: int) -> str:
        """
        Get OneSignal player ID for a user
        In a real implementation, this would query a mapping table
        
        Args:
            user_id: The user ID
            
        Returns:
            str: OneSignal player ID
        """
        # This is a placeholder - in a real implementation, we would store
        # the mapping between user IDs and OneSignal player IDs in the database
        return f"player_{user_id}"

# Initialize service
onesignal_service = OneSignalService()