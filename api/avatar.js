export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing username parameter' });
  }

  const clean = username.replace('@', '').trim().toLowerCase();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');

  let twimgUrl = null;

  // Method 1: Direct X page scrape
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
  } catch (e) {
    console.warn('X direct scrape notice:', e);
  }

  // Method 2: Microlink fallback
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
    } catch (e) {
      console.warn('Microlink fallback error:', e);
    }
  }

  if (twimgUrl) {
    return res.status(200).json({
      success: true,
      avatarUrl: `/api/avatar-proxy?url=${encodeURIComponent(twimgUrl)}`,
      rawAvatarUrl: twimgUrl,
      username: clean
    });
  }

  // Fallback default avatar
  return res.status(200).json({
    success: false,
    avatarUrl: `https://unavatar.io/twitter/${clean}`,
    username: clean
  });
}
