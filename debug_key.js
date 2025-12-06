// import fetch from 'node-fetch'; // Native in Node 18+
import fs from 'fs';
import path from 'path';

// Read key
let apiKey = 'AIzaSyDQJEJWZXu2qJ9BunMzahS_G8Utd2tqsTA';

async function testHelp() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    console.log(`Testing URL: ${url.replace(apiKey, 'HIDDEN')}`);

    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hi" }] }]
            })
        });

        console.log(`Status: ${resp.status} ${resp.statusText}`);
        const text = await resp.text();
        console.log(`Body: ${text.substring(0, 500)}`);
    } catch (e) {
        console.error(e);
    }
}

testHelp();
