# AI Image Generation for PackYourBags

This document explains how to generate AI images for destinations using the implemented system.

## Implementation Overview

The system consists of several components:

1. **AI Image Prompt Generation** - Creates DALL-E style prompts for each destination
2. **Destination Model Updates** - Added fields to store AI-generated image URLs
3. **Image Generation Scripts** - Scripts to generate and cache AI images
4. **Database Migration** - Added required columns to the destinations table

## Key Files

- `ai_image_prompts.py` - Generates AI image prompts for destinations
- `models.py` - Updated Destination model with AI image fields
- `update_destination_ai_images.py` - Script to generate and update AI images
- `run_migration.py` - Database migration script

## Usage

### 1. Generate AI Image Prompts

```bash
cd backend
python ai_image_prompts.py
```

This generates prompts for all destinations and saves them to `data/ai_image_prompts.json`.

### 2. Generate AI Images (with OpenAI API)

To generate actual AI images, you need to:

1. Set your OpenAI API key:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

2. Run the image generation script:
   ```bash
   python update_destination_ai_images.py
   ```

For multiple images per destination:
   ```bash
   python update_destination_ai_images.py --multi
   ```

## Implementation Tips

1. **Prompt Template Storage**: The prompt template is stored in `ai_image_prompts.py` and can be easily modified.

2. **Variable Injection**: The system automatically injects three variables:
   - City name
   - Country name  
   - First highlight from the destination

3. **Image Caching**: Generated image URLs are cached in JSON files to avoid regeneration:
   - Single images: `data/ai_image_cache.json`
   - Multiple images: `data/ai_image_cache_multi.json`

4. **Special Destinations**: Specific prompts are defined for Tokyo, Paris, and Cape Town as examples.

## Example Prompts

### Tokyo
```
Ultra-realistic, 16:9 horizontal, 4K travel-photography style, Tokyo Japan, golden-hour lighting, Shibuya crossing neon reflections in rain-soaked asphalt left-third rule, depth-of-field bokeh, vibrant but natural color-grading, lone solo traveler (gender-neutral, back turned, canvas backpack) for scale, subtle teal & amber palette to match PackYourBags brand, no text, no logo, no border, --ar 16:9 --v 5 --q 2 --style raw
```

### Paris
```
Ultra-realistic, 16:9 horizontal, 4K travel-photography style, Paris France, blue-hour lighting, art-nouveau Metro entrance canopy with wrought-iron vines left-third rule, depth-of-field bokeh, vibrant but natural color-grading, lone solo female traveler (back turned, red beret) for scale, subtle teal & amber palette to match PackYourBags brand, no text, no logo, no border, --ar 16:9 --v 5 --q 2 --style raw
```

### Cape Town
```
Ultra-realistic, 16:9 horizontal, 4K travel-photography style, Cape Town South Africa, sunrise pastel sky, silhouette of Table Mountain from Lion's Head trail left-third rule, depth-of-field bokeh, vibrant but natural color-grading, lone solo male traveler (back turned, wide-brim hat) for scale, subtle teal & amber palette to match PackYourBags brand, no text, no logo, no border, --ar 16:9 --v 5 --q 2 --style raw
```

## Database Schema Updates

The Destination model was updated with two new fields:

- `ai_image_url` (String) - URL for a single AI-generated image
- `ai_images` (JSON) - Array of URLs for multiple AI-generated images

## Frontend Integration

To use AI-generated images in the frontend, access the new fields in the destination data:

```javascript
// Single image
const imageUrl = destination.ai_image_url;

// Multiple images
const imageUrls = destination.ai_images;
```

## Best Practices

1. Always request 16:9 aspect ratio to avoid cropping in card components
2. Cache image URLs against destination IDs to avoid re-generation on every page load
3. Use the teal and amber palette to maintain brand consistency
4. Store the prompt template in your CMS for easy updates