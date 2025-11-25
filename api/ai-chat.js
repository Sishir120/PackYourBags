// Vercel Serverless Function for AI Chat
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Get OpenRouter API key from environment
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error('OPENROUTER_API_KEY not configured');
            return res.status(500).json({
                success: false,
                error: 'AI service not configured'
            });
        }

        // Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://pack-your-bags-ten.vercel.app',
                'X-Title': 'PackYourBags Travel Assistant'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-free', // Free model
                messages: [
                    {
                        role: 'system',
                        content: 'You are TravelBot, a helpful travel assistant for PackYourBags. Help users plan trips, suggest destinations, provide travel tips, and answer questions about travel. Be friendly, concise, and informative.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenRouter API error:', errorData);
            return res.status(response.status).json({
                success: false,
                error: 'AI service temporarily unavailable'
            });
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content;

        if (!aiResponse) {
            return res.status(500).json({
                success: false,
                error: 'No response from AI'
            });
        }

        // Return successful response
        return res.status(200).json({
            success: true,
            response: aiResponse,
            credits_remaining: 'unlimited', // Free tier
            is_premium: false,
            is_travelpro: false
        });

    } catch (error) {
        console.error('AI Chat error:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred processing your request'
        });
    }
}
