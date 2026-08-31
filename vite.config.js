import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const avatarDevPlugin = () => ({
  name: 'avatar-dev-middleware',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && req.url.startsWith('/api/avatar-proxy')) {
        const urlObj = new URL(req.url, 'http://localhost:5173');
        const targetUrl = urlObj.searchParams.get('url');
        if (targetUrl) {
          try {
            const imgRes = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              }
            });
            if (imgRes.ok) {
              res.setHeader('Content-Type', imgRes.headers.get('content-type') || 'image/jpeg');
              res.setHeader('Cache-Control', 'public, max-age=86400');
              const arrayBuffer = await imgRes.arrayBuffer();
              res.end(Buffer.from(arrayBuffer));
              return;
            }
          } catch (e) {}
        }
      }

      if (req.url && req.url.startsWith('/api/avatar')) {
        const urlObj = new URL(req.url, 'http://localhost:5173');
        const username = urlObj.searchParams.get('username') || '';
        const clean = username.replace('@', '').trim().toLowerCase();

        if (!clean) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing username' }));
          return;
        }

        try {
          // Fetch from Microlink
          const microRes = await fetch(`https://api.microlink.io/?url=https://x.com/${clean}`);
          if (microRes.ok) {
            const json = await microRes.json();
            const imgUrl = json?.data?.image?.url;
            if (imgUrl && imgUrl.includes('twimg.com')) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                avatarUrl: `/api/avatar-proxy?url=${encodeURIComponent(imgUrl)}`,
                rawAvatarUrl: imgUrl,
                username: clean
              }));
              return;
            }
          }
        } catch (e) {}

        // Fallback
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: true,
          avatarUrl: `https://unavatar.io/twitter/${clean}`,
          username: clean
        }));
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), avatarDevPlugin()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 5173,
    host: true,
    allowedHosts: true,
  }
});
