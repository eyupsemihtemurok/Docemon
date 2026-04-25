const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'backend' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'hackathon26 backend placeholder is running',
      path: req.url,
    })
  );
});

server.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
