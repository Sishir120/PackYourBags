from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.personalization import personalization_engine

personalization_bp = Blueprint('personalization', __name__, url_prefix='/api/personalization')

@personalization_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get personalized destination recommendations"""
    try:
        user_id = int(get_jwt_identity())
        limit = int(request.args.get('limit', 10))
        
        recommendations = personalization_engine.get_personalized_recommendations(user_id, limit)
        
        return jsonify({
            "success": True,
            "recommendations": recommendations
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@personalization_bp.route('/blogs', methods=['GET'])
@jwt_required()
def get_personalized_blogs():
    """Get personalized blog recommendations"""
    try:
        user_id = int(get_jwt_identity())
        limit = int(request.args.get('limit', 6))
        
        blogs = personalization_engine.get_personalized_blogs(user_id, limit)
        
        return jsonify({
            "success": True,
            "blogs": blogs
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@personalization_bp.route('/track', methods=['POST'])
@jwt_required()
def track_interaction():
    """Track user interaction for personalization"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        success = personalization_engine.update_user_preferences(user_id, data)
        
        return jsonify({
            "success": success,
            "message": "Interaction tracked"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
