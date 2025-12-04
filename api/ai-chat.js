// Vercel Serverless Function for AI Chat with Google Gemini
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
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

        // Get Gemini API Key - support multiple env var names
        const apiKey = process.env.GEMINI_API_KEY
            || process.env.VITE_GEMINI_API_KEY
            || process.env.GOOGLE_API_KEY;

        console.log('🔑 API Key check:', apiKey ? `${apiKey.substring(0, 20)}...` : '❌ MISSING');

        if (!apiKey) {
            console.error('❌ Gemini API Key missing');
            return res.status(500).json({
                success: false,
                error: 'AI service configuration error. Please add GEMINI_API_KEY to environment variables.'
            });
        }

        console.log('✅ Using Gemini API');

        // Convert messages to Gemini format
        const geminiContents = [];
        for (const msg of messages) {
            if (msg.role === 'system') continue; // Skip system messages
            geminiContents.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        }

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: geminiContents,
                    generationConfig: {
                        temperature: 0.9,
                        maxOutputTokens: 1024,
                        topP: 0.95,
                    }
                })
            }
        );

        console.log('📡 Gemini API Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Gemini API error:', errorData);
            return res.status(500).json({
                success: false,
                error: 'AI service temporarily unavailable'
            });
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            return res.status(500).json({
                success: false,
                error: 'No response from AI'
            });
        }

        console.log('✅ AI Response generated successfully');

        return res.status(200).json({
            success: true,
            response: aiResponse,
            credits_remaining: 'unlimited',
            is_premium: false,
            is_travelpro: false
        });

    } catch (error) {
        console.error('❌ AI Chat error:', error);
        return res.status(500).json({
            success: false,
            error: 'An error occurred processing your request'
        });
    }
}
