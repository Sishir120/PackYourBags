import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import aiChatHandler from './api/ai-chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const loadEnv = () => {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
            console.log('Loaded .env file');
        } else {
            console.warn('No .env file found. Please create one with GEMINI_API_KEY.');
        }
    } catch (err) {
        console.error('Error loading .env:', err);
    }
};

loadEnv();

const PORT = 5000;

const server = http.createServer(async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Helper methods to mimic Vercel/Express
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };

    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
    };

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/ai-chat') {
        // Parse body
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                if (body) {
                    req.body = JSON.parse(body);
                }
                await aiChatHandler(req, res);
            } catch (error) {
                console.error('Error handling request:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } else {
        res.status(404).json({ error: 'Not Found' });
    }
});

server.listen(PORT, () => {
    console.log(`Local API server running at http://localhost:${PORT}`);
});
