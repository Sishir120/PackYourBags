// Vercel Serverless Function for AI Chat with Google Gemini
export default async function handler(req, res) {
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

        // Try Google Gemini API (FREE - 1,000 requests/day!)
        const geminiKey = process.env.GEMINI_API_KEY;

        if (geminiKey) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `You are TravelBot, a helpful travel assistant for PackYourBags. Help users plan trips, suggest destinations, and provide travel tips. Be friendly and concise.\n\nUser: ${message}\nTravelBot:`
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 500
                            }
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (aiResponse) {
                        return res.status(200).json({
                            success: true,
                            response: aiResponse,
                            credits_remaining: 'unlimited',
                            is_premium: false,
                            is_travelpro: false
                        });
                    }
                }
            } catch (error) {
                console.log('Gemini failed, trying fallback...');
            }
        }

        // Fallback: Simple response if no API key
        return res.status(200).json({
            success: true,
            response: "I'm TravelBot, your travel assistant! I can help you discover amazing destinations, plan trips, and provide travel tips. To enable full AI chat functionality, please add a Google Gemini API key to your environment variables. Get one free at https://aistudio.google.com",
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
