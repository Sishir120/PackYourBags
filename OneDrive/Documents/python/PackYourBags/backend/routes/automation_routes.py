from flask import Blueprint, request, jsonify
import logging
from datetime import datetime

# Create blueprint
automation_bp = Blueprint('automation', __name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@automation_bp.route('/api/start-automation', methods=['POST'])
def start_automation():
    """
    Handle automation service requests from the frontend
    Expected JSON payload:
    {
        "destination": "Destination Name",
        "destinationId": "destination_id",
        "travelDates": "YYYY-MM-DD",
        "numberOfTravelers": 2,
        "email": "user@example.com"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['destination', 'destinationId', 'travelDates', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate number of travelers
        if 'numberOfTravelers' in data:
            try:
                number_of_travelers = int(data['numberOfTravelers'])
                if number_of_travelers < 1:
                    return jsonify({
                        'success': False,
                        'error': 'Number of travelers must be at least 1'
                    }), 400
            except (ValueError, TypeError):
                return jsonify({
                    'success': False,
                    'error': 'Invalid number of travelers'
                }), 400
        
        # Validate email format
        email = data['email']
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'error': 'Invalid email address'
            }), 400
        
        # Log the automation request
        logger.info(f"Automation request received: {data}")
        
        # In a real implementation, you would:
        # 1. Save the request to a database
        # 2. Send an email notification
        # 3. Trigger an AI process to handle booking
        # 4. Add to a queue for processing
        # 5. Generate a unique cancellation link
        
        # For now, we'll just log it and return a success response
        return jsonify({
            'success': True,
            'message': 'Booking Automation Started! Your reservation confirmation and a unique cancellation link will be emailed to you within 24 hours.',
            'requestId': f"AUT-{int(datetime.now().timestamp())}",
            'estimatedResponseTime': '24 hours'
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing automation request: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to start automation service'
        }), 500

# Health check endpoint
@automation_bp.route('/api/automation/health', methods=['GET'])
def automation_health():
    """Health check endpoint for automation service"""
    return jsonify({
        'status': 'healthy',
        'service': 'automation-service',
        'timestamp': datetime.now().isoformat()
    }), 200