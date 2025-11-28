from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Itinerary, Destination
from ai_service import ai_service
from datetime import datetime

itinerary_bp = Blueprint('itinerary', __name__, url_prefix='/api/itineraries')

@itinerary_bp.route('', methods=['GET'])
@jwt_required()
def get_user_itineraries():
    """Get all itineraries for current user"""
    try:
        user_id = int(get_jwt_identity())
        itineraries = Itinerary.query.filter_by(user_id=user_id).order_by(Itinerary.created_at.desc()).all()
        
        return jsonify({
            "success": True,
            "itineraries": [itin.to_dict() for itin in itineraries]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@itinerary_bp.route('/<int:itinerary_id>', methods=['GET'])
@jwt_required()
def get_itinerary(itinerary_id):
    """Get single itinerary"""
    try:
        user_id = int(get_jwt_identity())
        itinerary = Itinerary.query.filter_by(id=itinerary_id, user_id=user_id).first()
        
        if not itinerary:
            return jsonify({"success": False, "error": "Itinerary not found"}), 404
        
        return jsonify({"success": True, "itinerary": itinerary.to_dict()})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@itinerary_bp.route('', methods=['POST'])
@jwt_required()
def create_itinerary():
    """Create new itinerary"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        # Parse dates safely
        start_date = None
        end_date = None
        
        if data.get('start_date'):
            try:
                start_date = datetime.fromisoformat(data['start_date'])
            except (ValueError, TypeError):
                pass
                
        if data.get('end_date'):
            try:
                end_date = datetime.fromisoformat(data['end_date'])
            except (ValueError, TypeError):
                pass
        
        itinerary = Itinerary(
            user_id=user_id,
            destination_id=data.get('destination_id'),
            title=data['title'],
            description=data.get('description'),
            start_date=start_date,
            end_date=end_date,
            days=data.get('days', []),
            estimated_budget=data.get('estimated_budget'),
            budget_breakdown=data.get('budget_breakdown', {}),
            notes=data.get('notes'),
            tags=data.get('tags', []),
            is_public=data.get('is_public', False),
            ai_generated=data.get('ai_generated', False),
            ai_prompt=data.get('ai_prompt')
        )
        
        db.session.add(itinerary)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Itinerary created",
            "itinerary": itinerary.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@itinerary_bp.route('/<int:itinerary_id>', methods=['PUT'])
@jwt_required()
def update_itinerary(itinerary_id):
    """Update itinerary"""
    try:
        user_id = int(get_jwt_identity())
        itinerary = Itinerary.query.filter_by(id=itinerary_id, user_id=user_id).first()
        
        if not itinerary:
            return jsonify({"success": False, "error": "Itinerary not found"}), 404
        
        data = request.get_json()
        
        # Parse dates safely
        if 'start_date' in data:
            if data['start_date']:
                try:
                    itinerary.start_date = datetime.fromisoformat(data['start_date'])
                except (ValueError, TypeError):
                    itinerary.start_date = None
            else:
                itinerary.start_date = None
                
        if 'end_date' in data:
            if data['end_date']:
                try:
                    itinerary.end_date = datetime.fromisoformat(data['end_date'])
                except (ValueError, TypeError):
                    itinerary.end_date = None
            else:
                itinerary.end_date = None
        
        # Update other fields
        if 'title' in data: itinerary.title = data['title']
        if 'description' in data: itinerary.description = data['description']
        if 'destination_id' in data: itinerary.destination_id = data['destination_id']
        if 'days' in data: itinerary.days = data['days']
        if 'estimated_budget' in data: itinerary.estimated_budget = data['estimated_budget']
        if 'budget_breakdown' in data: itinerary.budget_breakdown = data['budget_breakdown']
        if 'notes' in data: itinerary.notes = data['notes']
        if 'tags' in data: itinerary.tags = data['tags']
        if 'is_public' in data: itinerary.is_public = data['is_public']
        if 'ai_generated' in data: itinerary.ai_generated = data['ai_generated']
        if 'ai_prompt' in data: itinerary.ai_prompt = data['ai_prompt']
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Itinerary updated",
            "itinerary": itinerary.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@itinerary_bp.route('/<int:itinerary_id>', methods=['DELETE'])
@jwt_required()
def delete_itinerary(itinerary_id):
    """Delete itinerary"""
    try:
        user_id = int(get_jwt_identity())
        itinerary = Itinerary.query.filter_by(id=itinerary_id, user_id=user_id).first()
        
        if not itinerary:
            return jsonify({"success": False, "error": "Itinerary not found"}), 404
        
        db.session.delete(itinerary)
        db.session.commit()
        
        return jsonify({"success": True, "message": "Itinerary deleted"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@itinerary_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_ai_itinerary():
    """Generate AI-powered itinerary"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        destination_id = data.get('destination_id')
        duration = data.get('duration', 5)
        preferences = data.get('preferences', {})
        
        # Get destination
        destination = Destination.query.filter_by(destination_id=destination_id).first()
        if not destination:
            return jsonify({"success": False, "error": "Destination not found"}), 404
        
        # Generate itinerary with AI
        plan = ai_service.generate_travel_plan(destination.to_dict(), {
            'duration': duration,
            **preferences
        })
        
        if not plan.get('success'):
            return jsonify(plan), 500
        
        # Create itinerary
        itinerary = Itinerary(
            user_id=user_id,
            destination_id=destination_id,
            title=f"{duration}-Day {destination.name} Adventure",
            description=f"AI-generated itinerary for {destination.name}",
            days=plan.get('plan', {}).get('itinerary', []),
            estimated_budget=plan.get('plan', {}).get('budget', {}).get('total', 0),
            budget_breakdown=plan.get('plan', {}).get('budget', {}).get('breakdown', {}),
            ai_generated=True,
            ai_prompt=str(preferences),
            tags=['ai-generated', destination.continent.lower(), destination.budget_tier]
        )
        
        db.session.add(itinerary)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "AI itinerary generated",
            "itinerary": itinerary.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500