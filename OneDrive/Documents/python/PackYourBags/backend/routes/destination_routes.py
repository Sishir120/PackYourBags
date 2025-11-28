from flask import Blueprint, request, jsonify
from database import db
from models import Destination
import json
import uuid
from datetime import datetime

destination_bp = Blueprint('destination_bp', __name__)

@destination_bp.route('/api/admin/destinations', methods=['GET'])
def get_all_destinations():
    """Get all destinations for admin management"""
    try:
        destinations = Destination.query.all()
        result = [dest.to_dict() for dest in destinations]
        
        return jsonify({
            "success": True,
            "count": len(result),
            "destinations": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@destination_bp.route('/api/admin/destinations/<destination_id>', methods=['GET'])
def get_destination(destination_id):
    """Get a specific destination by ID"""
    try:
        destination = Destination.query.filter_by(destination_id=destination_id).first()
        if not destination:
            return jsonify({
                "success": False,
                "error": "Destination not found"
            }), 404
            
        return jsonify({
            "success": True,
            "destination": destination.to_dict()
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@destination_bp.route('/api/admin/destinations', methods=['POST'])
def create_destination():
    """Create a new destination"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'country', 'continent']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    "success": False,
                    "error": f"{field} is required"
                }), 400
        
        # Check if destination already exists
        existing = Destination.query.filter_by(
            name=data['name'], 
            country=data['country']
        ).first()
        
        if existing:
            return jsonify({
                "success": False,
                "error": "Destination already exists"
            }), 400
        
        # Create new destination
        destination = Destination(
            destination_id=f"dest_{uuid.uuid4().hex[:8]}",
            name=data['name'],
            country=data['country'],
            continent=data['continent'],
            highlights=data.get('highlights', []),
            quick_fact=data.get('quick_fact', ''),
            best_season=data.get('best_season', ''),
            budget_tier=data.get('budget_tier', 'mid-range'),
            description=data.get('description', ''),
            local_tips=data.get('local_tips', []),
            images=data.get('images', []),
            latitude=float(data['latitude']) if data.get('latitude') else None,
            longitude=float(data['longitude']) if data.get('longitude') else None
        )
        
        db.session.add(destination)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Destination created successfully",
            "destination": destination.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@destination_bp.route('/api/admin/destinations/<destination_id>', methods=['PUT'])
def update_destination(destination_id):
    """Update an existing destination"""
    try:
        destination = Destination.query.filter_by(destination_id=destination_id).first()
        if not destination:
            return jsonify({
                "success": False,
                "error": "Destination not found"
            }), 404
        
        data = request.get_json()
        
        # Update fields if provided
        updatable_fields = [
            'name', 'country', 'continent', 'highlights', 'quick_fact',
            'best_season', 'budget_tier', 'description', 'local_tips',
            'images', 'latitude', 'longitude'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(destination, field, data[field])
        
        destination.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Destination updated successfully",
            "destination": destination.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@destination_bp.route('/api/admin/destinations/<destination_id>', methods=['DELETE'])
def delete_destination(destination_id):
    """Delete a destination"""
    try:
        destination = Destination.query.filter_by(destination_id=destination_id).first()
        if not destination:
            return jsonify({
                "success": False,
                "error": "Destination not found"
            }), 404
        
        db.session.delete(destination)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Destination deleted successfully"
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@destination_bp.route('/api/admin/destinations/<destination_id>/images', methods=['PUT'])
def update_destination_images(destination_id):
    """Update images for a specific destination"""
    try:
        destination = Destination.query.filter_by(destination_id=destination_id).first()
        if not destination:
            return jsonify({
                "success": False,
                "error": "Destination not found"
            }), 404
        
        data = request.get_json()
        images = data.get('images', [])
        
        # Validate images - should be a list of URLs
        if not isinstance(images, list):
            return jsonify({
                "success": False,
                "error": "Images must be an array of URLs"
            }), 400
        
        # Filter out empty strings and validate URLs
        valid_images = [img for img in images if img and isinstance(img, str) and img.startswith('http')]
        
        destination.images = valid_images
        destination.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Destination images updated successfully",
            "images": destination.images
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500