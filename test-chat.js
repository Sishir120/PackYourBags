import http from 'http';

const data = JSON.stringify({
    messages: [{ role: 'user', content: 'Hello, suggest a short travel tip.' }]
});

const req = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/ai-chat',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
}, res => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', d => process.stdout.write(d));
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
