// Quick test of Gemini API with new key
const GEMINI_API_KEY = 'AIzaSyDQJEJWZXu2qJ9BunMzahS_G8Utd2tqsTA';

const testGemini = async () => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{ text: 'Say hello travel guide in one sentence' }]
                    }]
                })
            }
        );

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.log('\n✅ SUCCESS! AI said:', data.candidates[0].content.parts[0].text);
        } else {
            console.log('\n❌ No AI response received');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

testGemini();
