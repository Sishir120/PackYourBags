// Vercel Serverless Function for AI Chat with OpenRouter
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins or specify your frontend URL
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                error: 'Messages array is required'
            });
        }

        // Use OpenRouter API with DeepSeek (FREE)
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error('OPENROUTER_API_KEY is missing');
            return res.status(500).json({
                success: false,
                error: 'AI service configuration error'
            });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://pack-your-bags-ten.vercel.app',
                'X-Title': 'PackYourBags Travel Assistant'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-free',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenRouter API error:', errorData);
            return res.status(500).json({
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

        return res.status(200).json({
            success: true,
            response: aiResponse,
            credits_remaining: 'unlimited',
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
