
import fetch from 'node-fetch';

async function testOpenRouter() {
    const key = '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';

    console.log("Testing OpenRouter Key...");

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://packyourbags.vercel.app", // Optional, for including your app on openrouter.ai rankings.
                "X-Title": "PackYourBags" // Optional. Shows in rankings on openrouter.ai.
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001", // Trying a specific Gemini model on OpenRouter
                "messages": [
                    { "role": "user", "content": "Hello, are you working?" },
                ],
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success! Response:", JSON.stringify(data, null, 2));
        } else {
            console.error("Error:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Details:", errorText);
        }
    } catch (error) {
        console.error("Fetch failed:", error);
    }
}

testOpenRouter();
