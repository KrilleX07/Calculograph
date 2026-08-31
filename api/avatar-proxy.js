export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url parameter');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  try {
    const imgRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    if (imgRes.ok) {
      res.setHeader('Content-Type', imgRes.headers.get('content-type') || 'image/jpeg');
      const arrayBuffer = await imgRes.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
  } catch (e) {
    console.warn('Avatar proxy fetch error:', e);
  }

  return res.status(404).send('Avatar image not found');
}
