"""
Feature Flags Service
"""
import os
import logging
from typing import Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FeatureFlagsService:
    """Service for managing feature flags"""
    
    def __init__(self):
        # In a real implementation, this would integrate with a feature flag service like PostHog
        # For now, we'll use environment variables
        self.flags = {
            'weekend_wizard_enabled': os.getenv('WEEKEND_WIZARD_ENABLED', 'true').lower() == 'true',
            'price_pulse_enabled': os.getenv('PRICE_PULSE_ENABLED', 'true').lower() == 'true'
        }
        
        logger.info(f"Feature flags initialized: {self.flags}")
    
    def is_enabled(self, flag_name: str, user_id: int = None) -> bool:
        """
        Check if a feature flag is enabled
        
        Args:
            flag_name: Name of the feature flag
            user_id: Optional user ID for user-specific flags
            
        Returns:
            bool: True if enabled, False otherwise
        """
        # For user-specific flags, we could implement more complex logic
        # For now, we'll just return the global flag value
        return self.flags.get(flag_name, False)
    
    def get_all_flags(self) -> Dict[str, bool]:
        """
        Get all feature flags
        
        Returns:
            Dict[str, bool]: Dictionary of all feature flags
        """
        return self.flags.copy()

# Initialize service
feature_flags_service = FeatureFlagsService()