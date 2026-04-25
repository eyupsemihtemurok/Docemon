const http = require('http');

const PORT = process.env.PORT || 19006;
const API_URL = process.env.API_URL || 'http://localhost:3000';

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hackathon26 frontend</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        background: linear-gradient(120deg, #f6f7fb 0%, #e7ecff 100%);
        min-height: 100vh;
        display: grid;
        place-items: center;
      }
      main {
        background: white;
        border-radius: 12px;
        padding: 28px;
        box-shadow: 0 10px 30px rgba(20, 40, 90, 0.15);
        max-width: 720px;
      }
      h1 {
        margin-top: 0;
      }
      code {
        background: #f0f3ff;
        padding: 3px 6px;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>hackathon26 frontend placeholder</h1>
      <p>Container is running on port <code>${PORT}</code>.</p>
      <p>Configured backend URL: <code>${API_URL}</code></p>
      <p>When app code is ready, replace this with the Expo project files.</p>
    </main>
  </body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'frontend' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Frontend listening on port ${PORT}`);
});
