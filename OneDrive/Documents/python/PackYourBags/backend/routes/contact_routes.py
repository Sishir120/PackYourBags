from flask import Blueprint, jsonify, request  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity  # type: ignore
from database import db  # type: ignore
from models import User  # type: ignore
from datetime import datetime  # type: ignore
import re  # type: ignore

contact_bp = Blueprint('contact', __name__, url_prefix='/api/contact')

@contact_bp.route('/submit', methods=['POST'])
def submit_contact_form():
    """Submit contact form"""
    try:
        data = request.get_json()
        
        # Validate required fields
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not name:
            return jsonify({
                "success": False,
                "error": "Name is required"
            }), 400
        
        if not email or not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            return jsonify({
                "success": False,
                "error": "Valid email is required"
            }), 400
        
        if not subject:
            return jsonify({
                "success": False,
                "error": "Subject is required"
            }), 400
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        # In a real application, you would:
        # 1. Save to database
        # 2. Send email notification
        # 3. Integrate with CRM system
        # 4. Add to support ticket system
        
        # For now, we'll just log it and return success
        print(f"Contact Form Submission: {name} ({email}) - {subject}")
        
        # If user is logged in, associate with their account
        user_id = None
        try:
            user_id = get_jwt_identity()
        except:
            pass  # Not logged in, which is fine
        
        # Save to database (in a real app)
        # contact_entry = ContactMessage(
        #     name=name,
        #     email=email,
        #     subject=subject,
        #     message=message,
        #     user_id=user_id if user_id else None
        # )
        # db.session.add(contact_entry)
        # db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Thank you for your message! We'll get back to you within 24 hours."
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "An error occurred while processing your request. Please try again."
        }), 500


@contact_bp.route('/support-ticket', methods=['POST'])
@jwt_required()
def create_support_ticket():
    """Create a support ticket for logged in users"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        data = request.get_json()
        
        # Validate required fields
        subject = data.get('subject', '').strip()
        description = data.get('description', '').strip()
        category = data.get('category', 'general')
        
        # Validation
        if not subject:
            return jsonify({
                "success": False,
                "error": "Subject is required"
            }), 400
        
        if not description:
            return jsonify({
                "success": False,
                "error": "Description is required"
            }), 400
        
        # In a real application, you would:
        # 1. Save to database as support ticket
        # 2. Send email notification to support team
        # 3. Assign ticket ID
        # 4. Integrate with support system
        
        # For now, we'll just log it and return success
        print(f"Support Ticket: {user.email} - {subject} ({category})")
        
        return jsonify({
            "success": True,
            "message": "Support ticket created successfully",
            "ticket_id": f"TICKET-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "estimated_response_time": "24 hours"
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": "An error occurred while creating your support ticket. Please try again."
        }), 500