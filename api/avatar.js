export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing username parameter' });
  }

  const clean = username.replace('@', '').trim().toLowerCase();

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');

  try {
    // Method 1: Fetch Twitter public page directly with standard modern user-agent
    const twitterRes = await fetch(`https://x.com/${clean}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (twitterRes.ok) {
      const html = await twitterRes.text();
      // Extract og:image or profile image URL
      const match = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
                    html.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[a-zA-Z0-9_\-\/]+\.(?:jpg|jpeg|png|webp)/i);

      if (match && match[1]) {
        const avatarUrl = match[1];
        return res.status(200).json({ success: true, avatarUrl, username: clean });
      } else if (match && match[0]) {
        return res.status(200).json({ success: true, avatarUrl: match[0], username: clean });
      }
    }
  } catch (e) {
    console.warn('Vercel Twitter scraping fallback:', e);
  }

  // Method 2: Microlink extraction fallback
  try {
    const microRes = await fetch(`https://api.microlink.io/?url=https://x.com/${clean}`);
    if (microRes.ok) {
      const json = await microRes.json();
      const microImg = json?.data?.image?.url;
      if (microImg && microImg.includes('twimg.com')) {
        return res.status(200).json({ success: true, avatarUrl: microImg, username: clean });
      }
    }
  } catch (e) {
    console.warn('Microlink fallback error:', e);
  }

  // Fallback default avatar
  return res.status(200).json({
    success: false,
    avatarUrl: `https://unavatar.io/x/${clean}`,
    username: clean
  });
}
