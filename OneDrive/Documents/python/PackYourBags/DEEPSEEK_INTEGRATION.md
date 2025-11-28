# DeepSeek AI Integration Guide

This document explains how to configure and use the DeepSeek AI integration in PackYourBags.

## Overview

PackYourBags now supports DeepSeek AI as a premium subscription option. DeepSeek provides advanced reasoning capabilities and specialized knowledge for complex travel planning tasks.

## Configuration

To enable DeepSeek integration, update your backend `.env` file:

```env
# For DeepSeek API
AI_API_KEY=your_deepseek_api_key_here
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
```

## Subscription Tiers

1. **Free Tier** - 10 AI questions per month with basic models
2. **Premium Tier** - $9.99/month with unlimited access to popular AI models
3. **DeepSeek Special** - $14.99/month with unlimited access to DeepSeek AI

## Features

### DeepSeek Special Plan
- Unlimited DeepSeek AI conversations
- Specialized travel knowledge base
- Enhanced reasoning capabilities
- Code and technical travel solutions
- Priority for DeepSeek model

## API Endpoints

### Get Subscription Plans
```
GET /api/subscription/plans
```

### Get User Subscription Status
```
GET /api/subscription/status
```

### Upgrade Subscription
```
POST /api/subscription/upgrade
{
  "tier": "deepseek"
}
```

## Frontend Integration

The frontend automatically detects the user's subscription tier and displays appropriate UI elements:
- DeepSeek badge in AI chat
- Subscription manager with tier options
- Dedicated subscription page

## Testing

To test the DeepSeek integration:

1. Set the environment variables as shown above
2. Run the backend server
3. Navigate to the subscription page
4. Upgrade to the DeepSeek Special plan
5. Use the AI chat feature to test DeepSeek responses

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your DeepSeek API key is correct
   - Check that you have sufficient credits in your DeepSeek account
   - Ensure the API key has the necessary permissions

2. **Model Not Available**
   - Confirm you're using a supported DeepSeek model
   - Check the DeepSeek API documentation for model availability

3. **Rate Limiting**
   - DeepSeek may have rate limits on API requests
   - Implement appropriate retry logic with exponential backoff

### Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- Invalid API responses
- Authentication failures
- Rate limiting

## Security

- API keys are stored securely in environment variables
- All API requests use HTTPS
- User authentication is required for premium features
- Input validation is performed on all user data

## Support

For issues with DeepSeek integration, please contact:
- DeepSeek support: https://www.deepseek.com/
- PackYourBags support: support@packyourbags.example.com