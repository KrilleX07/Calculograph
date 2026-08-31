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

        let twimgUrl = null;

        // Method 1: Direct X page fetch with browser headers
        try {
          const xRes = await fetch(`https://x.com/${clean}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            }
          });
          if (xRes.ok) {
            const html = await xRes.text();
            const match = html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[a-zA-Z0-9_\-\/]+(?:_normal|_400x400|_bigger)?\.(?:jpg|jpeg|png|webp)/i) ||
                          html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[^\s\"\'<>]+/i);
            if (match && match[0]) {
              twimgUrl = match[0].replace('_normal.', '_400x400.').replace(/\\u002F/g, '/');
            }
          }
        } catch (e) {}

        // Method 2: Microlink
        if (!twimgUrl) {
          try {
            const microRes = await fetch(`https://api.microlink.io/?url=https://x.com/${clean}`);
            if (microRes.ok) {
              const json = await microRes.json();
              const imgUrl = json?.data?.image?.url;
              if (imgUrl && imgUrl.includes('twimg.com')) {
                twimgUrl = imgUrl;
              }
            }
          } catch (e) {}
        }

        if (twimgUrl) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            avatarUrl: `/api/avatar-proxy?url=${encodeURIComponent(twimgUrl)}`,
            rawAvatarUrl: twimgUrl,
            username: clean
          }));
          return;
        }

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
