import https from 'https';
import fs from 'fs';
import path from 'path';

// Read key from temp_env_vars.txt
const envPath = path.join(process.cwd(), 'temp_env_vars.txt');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    if (match) apiKey = match[1].trim();
}

console.log('Using Key:', apiKey.substring(0, 10) + '...');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', JSON.stringify(json.error, null, 2));
            } else {
                fs.writeFileSync('models.json', JSON.stringify(json, null, 2));
                console.log('Saved models.json');
            }
        } catch (e) {
            console.error('Parse Error:', e);
            console.log('Raw Data:', data);
        }
    });
}).on('error', e => console.error('Network Error:', e));
