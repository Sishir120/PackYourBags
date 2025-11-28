"""
AI Service for generating travel recommendations and itineraries
Supports multiple AI providers: OpenAI, Anthropic, Google, Ollama
"""

import os
import json
import requests  # pyright: ignore[reportMissingModuleSource]
from typing import Dict, List, Optional

# Security: Request timeout to prevent hanging
REQUEST_TIMEOUT = 30  # seconds

class AIService:
    def __init__(self):
        # Import config to get environment variables
        from config import config
        import os
        
        # Load environment variables from config
        self.api_key = config['default'].AI_API_KEY or os.getenv('AI_API_KEY', '')
        self.provider = (config['default'].AI_PROVIDER or os.getenv('AI_PROVIDER', 'openai')).lower()
        self.model = config['default'].AI_MODEL or os.getenv('AI_MODEL', 'gpt-3.5-turbo')
        
    def generate_travel_plan(self, destination: Dict, user_preferences: Optional[Dict] = None) -> Dict:
        """Generate a personalized travel plan for a destination"""
        
        if not self.api_key or self.api_key == 'your_api_key_here':
            return self._generate_mock_travel_plan(destination)
        
        # Build the prompt
        prompt = self._build_travel_plan_prompt(destination, user_preferences)
        
        try:
            if self.provider == 'openai':
                response = self._call_openai_direct(prompt)
            elif self.provider == 'anthropic':
                response = self._call_anthropic(prompt)
            elif self.provider == 'google':
                response = self._call_google(prompt)
            elif self.provider == 'ollama':
                response = self._call_ollama(prompt)
            elif self.provider == 'openrouter':
                response = self._call_openrouter(prompt)
            else:
                response = self._generate_mock_travel_plan(destination)
            
            return {
                'success': True,
                'plan': response,
                'destination': destination['name']
            }
        except Exception as e:
            print(f"Error calling AI service: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'fallback': self._generate_mock_travel_plan(destination)
            }
    
    def chat_with_ai(self, message: str, context: Optional[Dict] = None, user_data: Optional[Dict] = None) -> str:
        """General AI chat for travel questions - Tourism focused with personalization"""
        
        if not self.api_key or self.api_key == 'your_api_key_here':
            return self._generate_mock_response(message, context)
        
        try:
            # Enhanced tourism-focused system prompt with personalization
            system_prompt = """You are TravelBot, an expert AI travel assistant for PackYourBags. You ONLY answer questions related to travel, tourism, destinations, trip planning, hotels, activities, budgets, visas, and travel tips.

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
            
            # Add user personalization context if available
            if user_data:
                personalization_context = "\n\n**USER PROFILE FOR PERSONALIZATION:**"
                if user_data.get('preferences'):
                    personalization_context += f"\nPreferences: {json.dumps(user_data['preferences'])}"
                if user_data.get('travel_history'):
                    personalization_context += f"\nTravel History: {', '.join(user_data['travel_history']) if isinstance(user_data['travel_history'], list) else user_data['travel_history']}"
                if user_data.get('subscription_tier'):
                    personalization_context += f"\nSubscription Tier: {user_data['subscription_tier']}"
                system_prompt += personalization_context
            
            if context:
                system_prompt += f"\n\nAdditional Context: {json.dumps(context)}"
            
            if self.provider == 'openai':
                return self._call_openai_direct(message, system_prompt)
            elif self.provider == 'openrouter':
                return self._call_openrouter(message, system_prompt)
            elif self.provider == 'anthropic':
                return self._call_anthropic(message, system_prompt)
            elif self.provider == 'google':
                return self._call_google(message, system_prompt)
            elif self.provider == 'ollama':
                return self._call_ollama(message, system_prompt)
            elif self.provider == 'deepseek':
                return self._call_deepseek(message, system_prompt)
            else:
                return self._generate_mock_response(message, context)
                
        except Exception as e:
            print(f"Error in AI chat: {str(e)}")
            return self._generate_mock_response(message, context)
    
    def generate_text(self, prompt: str, max_tokens: int = 1500, temperature: float = 0.7) -> str:
        """Generate text using AI (for blog generation, etc.)"""
        
        if not self.api_key or self.api_key == 'your_api_key_here':
            return "AI service not configured. Please set AI_API_KEY in .env file."
        
        try:
            if self.provider == 'openai':
                return self._call_openai_completion_direct(prompt, max_tokens, temperature)
            elif self.provider == 'openrouter':
                return self._call_openrouter_completion(prompt, max_tokens, temperature)
            elif self.provider == 'anthropic':
                return self._call_anthropic(prompt)
            elif self.provider == 'google':
                return self._call_google(prompt)
            elif self.provider == 'ollama':
                return self._call_ollama(prompt)
            elif self.provider == 'deepseek':
                return self._call_deepseek_completion(prompt, max_tokens, temperature)
            else:
                return "Unsupported AI provider"
                
        except Exception as e:
            raise Exception(f"AI text generation error: {str(e)}")
    
    def _call_openai_completion_direct(self, prompt: str, max_tokens: int = 1500, temperature: float = 0.7) -> str:
        """Call OpenAI directly with HTTP requests for text completion"""
        try:
            # Check if using OpenRouter
            if self.api_key.startswith('sk-or-'):
                return self._call_openrouter_completion(prompt, max_tokens, temperature)
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _build_travel_plan_prompt(self, destination: Dict, preferences: Optional[Dict] = None) -> str:
        """Build a detailed prompt for travel plan generation"""
        
        prompt = f"""Create a detailed 5-day travel itinerary for {destination['name']}, {destination['country']}.
        
Destination Details:
- Highlights: {', '.join(destination['highlights'])}
- Best season: {destination['best_season']}
- Budget tier: {destination['budget_tier']}
- Quick fact: {destination['quick_fact']}
- Description: {destination.get('description', 'No description available')}
"""
        
        if preferences:
            prompt += f"\nUser Preferences: {json.dumps(preferences)}\n"
        
        prompt += """
Please provide:
1. Day-by-day itinerary (5 days)
2. Budget breakdown (accommodation, food, activities, transport)
3. Top 3 must-visit spots with brief descriptions
4. Local tips and cultural insights
5. Best local food to try

Format as JSON with this structure:
{
  "itinerary": [{"day": 1, "activities": [...], "meals": {...}}],
  "budget": {"total": 0, "breakdown": {...}},
  "must_visit": [...],
  "tips": [...],
  "food_recommendations": [...]
}"""
        
        return prompt
    
    def _call_openai_direct(self, message: str, system_prompt: str | None = None) -> str:
        """Call OpenAI API directly with HTTP requests"""
        try:
            # Check if using OpenRouter
            if self.api_key.startswith('sk-or-'):
                return self._call_openrouter(message, system_prompt)
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": message})
            
            data = {
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1500
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _call_openrouter(self, message: str, system_prompt: str | None = None) -> str:
        """Call OpenRouter API (compatible with OpenAI format)"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "PackYourBags"
            }
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": message})
            
            data = {
                "model": os.getenv('AI_MODEL', 'openai/gpt-3.5-turbo'),
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1500
            }
            
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            raise Exception(f"OpenRouter API error: {str(e)}")
    
    def _call_openrouter_completion(self, prompt: str, max_tokens: int = 1500, temperature: float = 0.7) -> str:
        """Call OpenRouter API for text completion"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "PackYourBags"
            }
            
            data = {
                "model": os.getenv('AI_MODEL', 'openai/gpt-3.5-turbo'),
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            raise Exception(f"OpenRouter API error: {str(e)}")
    
    def _call_deepseek(self, message: str, system_prompt: str | None = None) -> str:
        """Call DeepSeek API"""
        try:
            import requests  # pyright: ignore[reportMissingModuleSource]
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": message})
            
            data = {
                "model": self.model if self.model else "deepseek-chat",
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 1500
            }
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            result = response.json()
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content']
            else:
                raise Exception("Invalid response format from DeepSeek API")
        except Exception as e:
            raise Exception(f"DeepSeek API error: {str(e)}")
    
    def _call_deepseek_completion(self, prompt: str, max_tokens: int = 1500, temperature: float = 0.7) -> str:
        """Call DeepSeek API for text completion"""
        try:
            import requests  # pyright: ignore[reportMissingModuleSource]
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": self.model if self.model else "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            response = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            result = response.json()
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content']
            else:
                raise Exception("Invalid response format from DeepSeek API")
        except Exception as e:
            raise Exception(f"DeepSeek API error: {str(e)}")
    
    def _call_anthropic(self, message: str, system_prompt: str | None = None) -> str:
        """Call Anthropic Claude API"""
        try:
            headers = {
                "x-api-key": self.api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            
            data = {
                "model": "claude-3-sonnet-20240229",
                "max_tokens": 1500,
                "messages": [{"role": "user", "content": message}]
            }
            
            if system_prompt:
                data["system"] = system_prompt
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=data,
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            return response.json()['content'][0]['text']
        except Exception as e:
            raise Exception(f"Anthropic API error: {str(e)}")
    
    def _call_google(self, message: str, system_prompt: str | None = None) -> str:
        """Call Google Gemini API"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={self.api_key}"
            
            prompt = message
            if system_prompt:
                prompt = f"{system_prompt}\n\n{message}"
            
            data = {
                "contents": [{"parts": [{"text": prompt}]}]
            }
            
            response = requests.post(url, json=data)
            response.raise_for_status()
            
            return response.json()['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            raise Exception(f"Google API error: {str(e)}")
    
    def _call_ollama(self, message: str, system_prompt: str | None = None) -> str:
        """Call local Ollama API"""
        try:
            url = "http://localhost:11434/api/generate"
            
            prompt = message
            if system_prompt:
                prompt = f"{system_prompt}\n\n{message}"
            
            data = {
                "model": "llama2",
                "prompt": prompt,
                "stream": False
            }
            
            response = requests.post(url, json=data)
            response.raise_for_status()
            
            return response.json()['response']
        except Exception as e:
            raise Exception(f"Ollama API error: {str(e)}")
    
    def _generate_mock_travel_plan(self, destination: Dict) -> Dict:
        """Generate a mock travel plan when AI is not available"""
        return {
            "itinerary": [
                {
                    "day": 1,
                    "title": f"Welcome to {destination['name']}!",
                    "activities": [
                        f"Arrive and check into accommodation",
                        f"Visit {destination['highlights'][0]}",
                        "Evening stroll and local dinner"
                    ]
                },
                {
                    "day": 2,
                    "title": "Explore Main Attractions",
                    "activities": [
                        f"Morning visit to {destination['highlights'][1]}",
                        f"Afternoon at {destination['highlights'][2] if len(destination['highlights']) > 2 else 'local market'}",
                        "Sunset viewing and photography"
                    ]
                },
                {
                    "day": 3,
                    "title": "Cultural Immersion",
                    "activities": [
                        "Local cooking class or food tour",
                        "Visit museums and cultural sites",
                        "Evening cultural show"
                    ]
                },
                {
                    "day": 4,
                    "title": "Adventure Day",
                    "activities": [
                        "Day trip to nearby attractions",
                        "Outdoor activities (hiking, water sports, etc.)",
                        "Local restaurant experience"
                    ]
                },
                {
                    "day": 5,
                    "title": "Relax and Depart",
                    "activities": [
                        "Morning at leisure",
                        "Last-minute shopping",
                        "Departure"
                    ]
                }
            ],
            "budget": {
                "accommodation": f"${200 if destination['budget_tier'] == 'budget-friendly' else 400 if destination['budget_tier'] == 'mid-range' else 800}",
                "food": "$150-300",
                "activities": "$200-400",
                "transport": "$100-200",
                "total": f"${650 if destination['budget_tier'] == 'budget-friendly' else 1300 if destination['budget_tier'] == 'mid-range' else 2500}"
            },
            "must_visit": destination['highlights'][:3],
            "tips": [
                f"Best time to visit: {destination['best_season']}",
                "Book accommodations in advance during peak season",
                "Try local street food for authentic experience",
                "Learn basic local phrases",
                "Respect local customs and dress codes"
            ],
            "food_recommendations": [
                "Local specialty dishes at traditional restaurants",
                "Street food markets",
                "Cooking class to learn local cuisine"
            ],
            "note": "💡 Connect your AI API key to get personalized, detailed itineraries!"
        }
    
    def _generate_mock_response(self, message: str, context: Optional[Dict] = None) -> str:
        """Generate a mock response when AI is not available"""
        
        message_lower = message.lower()
        
        if 'budget' in message_lower or 'cost' in message_lower or 'expensive' in message_lower:
            return """Great question about budgeting! Here are some tips:

💰 Budget Travel Tips:
- Book flights 2-3 months in advance
- Consider hostels or guesthouses
- Eat at local restaurants away from tourist areas
- Use public transportation
- Look for free walking tours

🏷️ Money-saving strategies:
- Travel during shoulder season
- Use travel reward credit cards
- Book activities directly (not through resorts)
- Consider package deals

💡 Connect your AI API key for personalized budget recommendations based on your specific destination!"""
        
        elif 'itinerary' in message_lower or 'plan' in message_lower or 'day' in message_lower:
            return """I can help you plan your trip! Here's a general approach:

📅 Planning Framework:
- Day 1: Arrival & nearby exploration
- Day 2-3: Main attractions
- Day 4: Cultural experiences
- Day 5: Adventure activities
- Day 6: Relaxation & shopping
- Day 7: Departure prep

✨ For detailed, personalized day-by-day itineraries:
Connect your AI API key and I'll create custom plans based on your interests, budget, and travel style!

What destination are you planning to visit?"""
        
        elif 'food' in message_lower or 'eat' in message_lower or 'restaurant' in message_lower:
            return """🍽️ Food & Dining Tips:

Local Experiences:
- Visit morning markets for fresh produce
- Try street food (check for busy stalls)
- Ask locals for restaurant recommendations
- Take a cooking class

Budget-Friendly:
- Eat where locals eat
- Lunch specials are cheaper than dinner
- Food courts in malls
- Self-catering for some meals

💡 For specific restaurant recommendations and local cuisine guides, connect your AI API key!"""
        
        else:
            return f"""Hello! I'm your PackYourBags travel assistant! 🌍

I can help you with:
- 📅 Trip planning and itineraries
- 💰 Budget recommendations
- 🍽️ Food and restaurant suggestions
- 🏨 Accommodation tips
- 🎯 Activity recommendations
- 🗺️ Destination insights

Ask me anything about your travel plans!

💡 Note: For AI-powered personalized responses, please add your AI API key to the backend/.env file:
AI_API_KEY=your_key_here
AI_PROVIDER=openai (or anthropic, google, ollama)"""

# Create singleton instance
ai_service = AIService()