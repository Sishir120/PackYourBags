from flask import Blueprint, jsonify, request  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt  # type: ignore
from database import db  # type: ignore
from models import User  # type: ignore
from ai_service import ai_service  # Use the singleton instance
from datetime import datetime
from services.supabase_service import supabase_service
import os

ai_chat_bp = Blueprint('ai_chat', __name__, url_prefix='/api/ai-chat')

# ai_service = AIService()  # Remove this line, use the singleton

# Tourism-focused system prompt
TOURISM_SYSTEM_PROMPT = """You are TravelBot, an expert AI travel assistant for PackYourBags. You ONLY answer questions related to travel, tourism, destinations, trip planning, hotels, activities, budgets, visas, and travel tips.

**STRICT RULES:**
1. ONLY discuss travel and tourism topics
2. If asked about non-travel topics, politely redirect: "I'm a travel assistant and can only help with travel-related questions. How can I help plan your next adventure?"
3. Be enthusiastic, friendly, and concise
4. Provide practical, actionable travel advice
5. Suggest destinations when relevant
6. Include budget tips when appropriate
7. NEVER make up facts or hallucinate information - only provide information you're confident about
8. When in doubt, recommend checking official sources or travel advisories

**PERSONALIZATION:**
- Use the user's travel history to suggest new destinations
- Reference user preferences when making recommendations
- Adapt tone based on user's experience level (first-time traveler vs. seasoned explorer)
- Consider budget constraints in recommendations

**YOUR EXPERTISE:**
- Destination recommendations
- Trip itineraries
- Budget planning
- Best times to visit
- Local customs and culture
- Activities and attractions
- Accommodation suggestions
- Visa and travel requirements
- Safety tips
- Packing advice

Keep responses under 200 words unless detailed itinerary requested."""


@ai_chat_bp.route('/message', methods=['POST'])
def chat_message():
    """
    Send a message to AI chat
    Requires: message in body
    Optional: JWT token for credit tracking
    """
    try:
        # Debug: Print AI service configuration
        print(f"AI Service Config - API Key: {ai_service.api_key[:10] if ai_service.api_key else 'None'}...")
        print(f"AI Service Config - Provider: {ai_service.provider}")
        print(f"AI Service Config - Model: {os.getenv('AI_MODEL', 'default')}")
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400
        
        # Check authentication (optional)
        user = None
        credits_remaining = None
        is_premium = False
        is_travelpro = False
        user_id = None
        user_data = None
        
        try:
            # Try to get user from JWT
            user_id = get_jwt_identity()
            if user_id:
                # Try Supabase first, fallback to local database
                supabase_result = supabase_service.get_subscription_status(user_id)
                if supabase_result["success"]:
                    is_premium = supabase_result["subscription"]["is_premium"]
                    is_travelpro = supabase_result["subscription"].get("is_travelpro", False)
                    credits_remaining = supabase_result["subscription"]["credits"]
                else:
                    # Fallback to local database
                    user = User.query.get(int(user_id))
                    if user:
                        is_premium = user.subscription_tier == 'premium'
                        is_travelpro = user.subscription_tier == 'travelpro'
                        # Prepare user data for personalization
                        user_data = {
                            'preferences': user.preferences,
                            'travel_history': user.travel_history,
                            'subscription_tier': user.subscription_tier
                        }
        except:
            pass  # Anonymous users allowed with limited access
        
        # Credit check for authenticated users
        if user_id:
            # Try Supabase first
            credit_result = supabase_service.update_ai_credits(user_id)
            if credit_result["success"]:
                credits_remaining = credit_result["credits_remaining"]
                is_premium = credit_result["is_premium"]
                is_deepseek = credit_result.get("is_deepseek", False)
                if not is_premium and not is_deepseek and credits_remaining == "Insufficient AI credits":
                    return jsonify({
                        "success": False,
                        "error": "No AI credits remaining. Please subscribe for unlimited access!",
                        "credits_remaining": 0,
                        "subscription_required": True
                    }), 403
            else:
                # Fallback to local database
                if user:
                    is_premium = user.subscription_tier == 'premium'
                    is_deepseek = user.subscription_tier == 'deepseek'
                    
                    if not is_premium and not is_deepseek:
                        # Free tier - check credits
                        if user.ai_credits <= 0:
                            return jsonify({
                                "success": False,
                                "error": "No AI credits remaining. Please subscribe for unlimited access!",
                                "credits_remaining": 0,
                                "subscription_required": True
                            }), 403
                        
                        # Deduct credit
                        user.ai_credits -= 1
                        credits_remaining = user.ai_credits
                    else:
                        credits_remaining = "unlimited"
                    
                    user.total_ai_queries += 1
                    db.session.commit()
                    
                    # Prepare user data for personalization
                    user_data = {
                        'preferences': user.preferences,
                        'travel_history': user.travel_history,
                        'subscription_tier': user.subscription_tier
                    }
        else:
            # Anonymous user - limited to 3 questions per session (implement via frontend)
            credits_remaining = "login_for_credits"
        
        # Get AI response with tourism-focused prompt and user personalization
        context = {
            "user_type": "premium" if is_premium else "free",
            "platform": "PackYourBags"
        }
        
        # Check if user has access to the requested AI model
        user_has_access = False
        if is_travelpro and ai_service.provider == 'travelpro':
            user_has_access = True
        elif is_premium and ai_service.provider in ['openai', 'openrouter', 'anthropic', 'google']:
            user_has_access = True
        elif not is_premium and not is_travelpro and ai_service.provider in ['openai', 'openrouter']:
            # Free users can only use basic models
            user_has_access = True
        else:
            # Check if it's a free access model
            user_has_access = ai_service.provider in ['openai', 'openrouter'] and not is_premium and not is_travelpro
        
        if not user_has_access:
            # User doesn't have access to this model tier
            return jsonify({
                "success": False,
                "error": "Your subscription tier doesn't have access to this AI model. Please upgrade for unlimited access!",
                "subscription_required": True
            }), 403
        
        # Pass user data for personalization
        ai_response = ai_service.chat_with_ai(message, context, user_data)
        
        # Apply tourism filter check (basic validation)
        response_lower = ai_response.lower()
        if not any(keyword in response_lower for keyword in [
            'travel', 'destination', 'trip', 'visit', 'tourism', 'hotel', 
            'activity', 'budget', 'flight', 'vacation', 'adventure', 'explore',
            'country', 'city', 'beach', 'mountain', 'culture', 'food'
        ]) and len(message) > 20:
            # If response doesn't contain travel keywords, add disclaimer
            ai_response = "I'm specialized in travel advice! " + ai_response
        
        return jsonify({
            "success": True,
            "response": ai_response,
            "credits_remaining": credits_remaining,
            "is_premium": is_premium,
            "is_travelpro": is_travelpro,
            "message_id": datetime.utcnow().timestamp()
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"AI service error: {str(e)}"
        }), 500


@ai_chat_bp.route('/credits', methods=['GET'])
@jwt_required()
def get_credits():
    """Get user's AI credit balance"""
    try:
        user_id = get_jwt_identity()
        
        # Try Supabase first
        supabase_result = supabase_service.get_subscription_status(user_id)
        if supabase_result["success"]:
            subscription = supabase_result["subscription"]
            return jsonify({
                "success": True,
                "credits": subscription["credits"],
                "is_premium": subscription["is_premium"],
                "is_travelpro": subscription.get("is_travelpro", False),
                "total_queries": subscription["total_queries"],
                "subscription_tier": subscription["subscription_tier"]
            })
        
        # Fallback to local database
        user = User.query.get(int(user_id))
        
        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404
        
        is_premium = user.subscription_tier == 'premium'
        
        return jsonify({
            "success": True,
            "credits": "unlimited" if is_premium else user.ai_credits,
            "is_premium": is_premium,
            "is_travelpro": user.subscription_tier == 'travelpro',
            "total_queries": user.total_ai_queries,
            "subscription_tier": user.subscription_tier
        })
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@ai_chat_bp.route('/system-info', methods=['GET'])
def get_system_info():
    """Get AI chat system information (public endpoint)"""
    return jsonify({
        "success": True,
        "info": {
            "name": "TravelBot",
            "description": "AI-powered travel assistant trained exclusively on tourism",
            "free_credits": 10,
            "features": {
                "free": [
                    "10 free AI questions",
                    "Basic destination recommendations",
                    "Travel tips and advice",
                    "Budget suggestions"
                ],
                "premium": [
                    "Unlimited AI conversations",
                    "Detailed itinerary planning",
                    "Priority response times",
                    "Personalized recommendations",
                    "24/7 travel support"
                ]
            },
            "pricing": {
                "free": "$0/month - 10 questions",
                "premium": "$9.99/month - Unlimited"
            }
        }
    })