"""
Module for generating AI image prompts for destinations
"""

import json
from typing import Dict, List

# AI image generation prompt template
AI_IMAGE_PROMPT_TEMPLATE = """Ultra-realistic, 16:9 horizontal, 4K travel-photography style, {city} {country}, {lighting}, {subject} {rule_of_thirds}, depth-of-field bokeh, vibrant but natural color-grading, {traveler} for scale, subtle teal & amber palette to match PackYourBags brand, no text, no logo, no border, --ar 16:9 --v 5 --q 2 --style raw"""

def generate_ai_image_prompt(destination: Dict) -> str:
    """
    Generate an AI image prompt for a destination based on the template
    
    Args:
        destination: Dictionary containing destination data
        
    Returns:
        String containing the AI image generation prompt
    """
    # City and country
    city = destination.get('name', '')
    country = destination.get('country', '')
    
    # Lighting conditions (rotate through different options)
    lighting_options = [
        "golden-hour lighting",
        "blue-hour lighting",
        "sunrise pastel sky",
        "sunset warm glow",
        "midday bright sunlight",
        "overcast soft lighting"
    ]
    
    # Subjects based on destination highlights
    highlights = destination.get('highlights', [])
    if highlights:
        subject = highlights[0] if len(highlights) > 0 else f"{city} landmark"
    else:
        subject = f"{city} landmark"
    
    # Rule of thirds positioning
    rule_of_thirds_options = [
        "left-third rule",
        "right-third rule",
        "center composition",
        "foreground focus"
    ]
    
    # Traveler descriptions for scale
    traveler_options = [
        "lone solo traveler (gender-neutral, back turned, canvas backpack)",
        "lone solo female traveler (back turned, red beret)",
        "lone solo male traveler (back turned, wide-brim hat)",
        "couple holding hands",
        "family of four",
        "group of friends"
    ]
    
    # For specific destinations mentioned in the examples
    special_destinations = {
        "Tokyo": {
            "lighting": "golden-hour lighting",
            "subject": "Shibuya crossing neon reflections in rain-soaked asphalt",
            "rule_of_thirds": "left-third rule",
            "traveler": "lone solo traveler (gender-neutral, back turned, canvas backpack)"
        },
        "Paris": {
            "lighting": "blue-hour lighting",
            "subject": "art-nouveau Metro entrance canopy with wrought-iron vines",
            "rule_of_thirds": "left-third rule",
            "traveler": "lone solo female traveler (back turned, red beret)"
        },
        "Cape Town": {
            "lighting": "sunrise pastel sky",
            "subject": "silhouette of Table Mountain from Lion's Head trail",
            "rule_of_thirds": "left-third rule",
            "traveler": "lone solo male traveler (back turned, wide-brim hat)"
        }
    }
    
    # Use special destination settings if available
    if city in special_destinations:
        settings = special_destinations[city]
        prompt = AI_IMAGE_PROMPT_TEMPLATE.format(
            city=city,
            country=country,
            lighting=settings["lighting"],
            subject=settings["subject"],
            rule_of_thirds=settings["rule_of_thirds"],
            traveler=settings["traveler"]
        )
    else:
        # Generate prompt with random variations
        import random
        prompt = AI_IMAGE_PROMPT_TEMPLATE.format(
            city=city,
            country=country,
            lighting=random.choice(lighting_options),
            subject=subject,
            rule_of_thirds=random.choice(rule_of_thirds_options),
            traveler=random.choice(traveler_options)
        )
    
    return prompt

def generate_prompts_for_all_destinations(destinations_file: str = 'data/destinations.json') -> Dict[str, str]:
    """
    Generate AI image prompts for all destinations in the data file
    
    Args:
        destinations_file: Path to the destinations JSON file
        
    Returns:
        Dictionary mapping destination IDs to their AI image prompts
    """
    try:
        with open(destinations_file, 'r', encoding='utf-8') as f:
            destinations = json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {destinations_file}")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Could not parse {destinations_file}")
        return {}
    
    prompts = {}
    for destination in destinations:
        dest_id = destination.get('id', '')
        if dest_id:
            prompts[dest_id] = generate_ai_image_prompt(destination)
    
    return prompts

def save_prompts_to_file(prompts: Dict[str, str], output_file: str = 'data/ai_image_prompts.json'):
    """
    Save generated prompts to a JSON file
    
    Args:
        prompts: Dictionary of destination IDs to prompts
        output_file: Path to output JSON file
    """
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(prompts, f, indent=2, ensure_ascii=False)
        print(f"Successfully saved {len(prompts)} prompts to {output_file}")
    except Exception as e:
        print(f"Error saving prompts to {output_file}: {str(e)}")

# Example usage
if __name__ == "__main__":
    # Generate prompts for all destinations
    prompts = generate_prompts_for_all_destinations()
    
    # Save to file
    save_prompts_to_file(prompts)
    
    # Print first few examples
    print("\nExample AI Image Prompts:")
    print("=" * 50)
    count = 0
    for dest_id, prompt in prompts.items():
        if count >= 3:
            break
        print(f"{dest_id}:")
        print(f"{prompt}\n")
        count += 1