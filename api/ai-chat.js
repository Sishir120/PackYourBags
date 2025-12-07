// Vercel Serverless Function for AI Chat with Google Gemini
// Implements robust fallback strategy: Flash -> Pro -> Graceful Offline Mode

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
        const { messages, destination } = req.body; // Expect destination in body for offline context

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Get Gemini API Key
        const apiKey = process.env.GEMINI_API_KEY
            || process.env.VITE_GEMINI_API_KEY
            || process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            console.error('❌ Gemini API Key missing');
            return res.status(500).json({
                success: false,
                error: 'Configuration Error: Missing API Key.'
            });
        }

        // Convert messages to Gemini format
        const geminiContents = [];
        for (const msg of messages) {
            if (msg.role === 'system') continue;
            geminiContents.push({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            });
        }

        // --- MODEL STRATEGY ---
        // 1. Try Gemini 1.5 Flash (Fast, New)
        // 2. Try Gemini 1.0 Pro (Stable, Old)
        // 3. Try Gemini 2.0 Flash (Bleeding edge)

        let aiResponse = null;

        // --- STRATEGY 1: OPENROUTER (User Preferred) ---
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (openRouterKey) {
            console.log('🔄 Attempting OpenRouter (Primary Strategy)...');
            try {
                const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${openRouterKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://packyourbags.vercel.app",
                        "X-Title": "PackYourBags"
                    },
                    body: JSON.stringify({
                        "model": "google/gemini-2.0-flash-001", // Or 'google/gemini-flash-1.5' or 'openai/gpt-3.5-turbo'
                        "messages": messages,
                    })
                });

                if (openRouterResponse.ok) {
                    const data = await openRouterResponse.json();
                    if (data.choices?.[0]?.message?.content) {
                        aiResponse = data.choices[0].message.content;
                        console.log('✅ Success with OpenRouter');
                    }
                } else {
                    console.warn(`⚠️ OpenRouter Failed: ${openRouterResponse.status}`);
                }
            } catch (e) {
                console.warn('⚠️ OpenRouter Exception:', e.message);
            }
        }

        // --- STRATEGY 2: GOOGLE GEMINI NATIVE (Fallback) ---
        if (!aiResponse) {
            const modelsToTry = [
                'gemini-1.5-flash',
                'gemini-pro',
                'gemini-2.0-flash'
            ];

            for (const model of modelsToTry) {
                if (aiResponse) break;
                try {
                    console.log(`🔄 Attempting Google Model: ${model}...`);
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: geminiContents,
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 800,
                            }
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                            aiResponse = data.candidates[0].content.parts[0].text;
                            console.log(`✅ Success with ${model}`);
                            break;
                        }
                    } else {
                        console.warn(`⚠️ Failed ${model}: ${response.status}`);
                    }
                } catch (e) {
                    console.warn(`⚠️ Exception ${model}:`, e.message);
                }
            }
        }

        // --- OFFLINE MODE FALLBACK ---
        if (!aiResponse) {
            console.error('❌ All models failed. Switching to Offline Mode.');

            // Intelligent Offline Responses
            const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
            let offlineReply = "I'm currently operating in Offline Mode (connecting to satellites...), but here's a general tip: Check the 'Itinerary' section for day-by-day plans!";

            // Simple keyword matching
            if (lastUserMsg.includes('budget') || lastUserMsg.includes('cost') || lastUserMsg.includes('price')) {
                offlineReply = "I can't access live rates right now, but generally, plan for accommodation and food based on the destination's tier (Budget/Mid/Luxury). Book early!";
            } else if (lastUserMsg.includes('food') || lastUserMsg.includes('eat') || lastUserMsg.includes('restaurant') || lastUserMsg.includes('dish')) {
                offlineReply = "You absolutely must try the local cuisine! Street food is often the best way to taste authentic flavors safely.";
            } else if (lastUserMsg.includes('hotel') || lastUserMsg.includes('stay') || lastUserMsg.includes('accommodation')) {
                offlineReply = "For accommodation, I recommend booking in advance during peak season. Check our 'Accommodations' tab for vetted options.";
            } else if (lastUserMsg.includes('weather') || lastUserMsg.includes('time') || lastUserMsg.includes('season')) {
                offlineReply = "The best time to visit is usually during the shoulder season to avoid crowds. Check the 'Best Season' info above!";
            } else if (lastUserMsg.includes('hello') || lastUserMsg.includes('hi')) {
                offlineReply = "Hello! I'm TravelBot (Offline Mode). Ask me about budget, food, or hotels!";
            }

            return res.status(200).json({
                success: true,
                response: `[OFFLINE MODE] ${offlineReply}`,
                is_fallback: true
            });
        }

        return res.status(200).json({
            success: true,
            response: aiResponse,
            credits_remaining: 'unlimited'
        });

    } catch (error) {
        console.error('❌ AI Chat error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
