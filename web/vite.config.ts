import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import https from 'https';

function getGeminiApiKey(): string {
  // 1. Try environment variable
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'REPLACE_WITH_YOUR_GEMINI_API_KEY') {
    return process.env.GEMINI_API_KEY;
  }

  // 2. Try local.properties in parent directory
  try {
    const localPropsPath = path.resolve(__dirname, '../local.properties');
    if (fs.existsSync(localPropsPath)) {
      const content = fs.readFileSync(localPropsPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('GEMINI_API_KEY=')) {
          return trimmed.substring('GEMINI_API_KEY='.length).trim();
        }
      }
    }
  } catch (err) {
    console.error('Failed reading local.properties:', err);
  }

  return '';
}

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/gemini' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const apiKey = getGeminiApiKey();
              const payload = JSON.parse(body);

              if (!apiKey || apiKey === 'REPLACE_WITH_YOUR_GEMINI_API_KEY') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  fallback: true,
                  message: "API key not configured in local.properties. Using deterministic flow engine."
                }));
                return;
              }

              const candidateModels = [
                'gemini-2.5-flash',
                'gemini-1.5-flash',
                'gemini-2.0-flash'
              ];

              let successResult: any = null;
              let lastStatus = 500;
              let lastError = '';

              for (const model of candidateModels) {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

                try {
                  const apiResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      system_instruction: {
                        parts: [{ text: payload.systemInstruction }]
                      },
                      contents: payload.contents,
                      generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 600,
                        responseMimeType: 'application/json'
                      }
                    })
                  });

                  if (apiResponse.ok) {
                    const data = await apiResponse.json();
                    successResult = data;
                    break;
                  } else {
                    lastStatus = apiResponse.status;
                    lastError = await apiResponse.text();
                    console.warn(`Gemini model ${model} returned HTTP ${lastStatus}: ${lastError}`);
                  }
                } catch (e: any) {
                  lastError = e?.message || String(e);
                  console.warn(`Attempt with ${model} failed:`, lastError);
                }
              }

              if (successResult) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(successResult));
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  fallback: true,
                  status: lastStatus,
                  error: lastError
                }));
              }
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err?.message || 'Internal proxy error' }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), geminiApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
