// Vercel Serverless Function for AI Chat with Multiple Free APIs
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

        // Try multiple free AI APIs in order
        const aiResponse = await tryMultipleAPIs(message);

        if (!aiResponse) {
            return res.status(500).json({
                success: false,
                error: 'AI service temporarily unavailable. Please try again later.'
            });
        }

        // Return successful response
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

// Try multiple AI APIs with fallback
async function tryMultipleAPIs(message) {
    // API 1: Hugging Face Inference API (FREE - No credit card needed!)
    try {
        const hfResponse = await callHuggingFace(message);
        if (hfResponse) return hfResponse;
    } catch (error) {
        console.log('Hugging Face failed, trying next API...');
    }

    // API 2: Groq (FREE - Very fast!)
    try {
        const groqResponse = await callGroq(message);
        if (groqResponse) return groqResponse;
    } catch (error) {
        console.log('Groq failed, trying next API...');
    }

    // API 3: Together AI (FREE tier)
    try {
        const togetherResponse = await callTogetherAI(message);
        if (togetherResponse) return togetherResponse;
    } catch (error) {
        console.log('Together AI failed, trying next API...');
    }

    // API 4: OpenRouter (if user has key)
    try {
        const openRouterResponse = await callOpenRouter(message);
        if (openRouterResponse) return openRouterResponse;
    } catch (error) {
        console.log('OpenRouter failed');
    }

    return null;
}

// Hugging Face Inference API (FREE!)
async function callHuggingFace(message) {
    const apiKey = process.env.HUGGINGFACE_API_KEY || 'hf_demo'; // Works without key in limited mode

    const response = await fetch(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: `You are TravelBot, a helpful travel assistant. User: ${message}\nTravelBot:`,
                parameters: {
                    max_length: 200,
                    temperature: 0.7
                }
            })
        }
    );

    if (response.ok) {
        const data = await response.json();
        return data[0]?.generated_text?.split('TravelBot:')[1]?.trim() ||
            "I'm here to help with your travel plans! What would you like to know?";
    }

    return null;
}

// Groq API (FREE - Super fast!)
async function callGroq(message) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3-8b-8192', // Free model
            messages: [
                {
                    role: 'system',
                    content: 'You are TravelBot, a helpful travel assistant for PackYourBags. Help users plan trips, suggest destinations, and provide travel tips. Be friendly and concise.'
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

    if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    return null;
}

// Together AI (FREE tier)
async function callTogetherAI(message) {
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) return null;

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'meta-llama/Llama-3-8b-chat-hf', // Free model
            messages: [
                {
                    role: 'system',
                    content: 'You are TravelBot, a helpful travel assistant.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500
        })
    });

    if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    return null;
}

// OpenRouter (if user has key)
async function callOpenRouter(message) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return null;

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
            messages: [
                {
                    role: 'system',
                    content: 'You are TravelBot, a helpful travel assistant.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 500
        })
    });

    if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }

    return null;
}
