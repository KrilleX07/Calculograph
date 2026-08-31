/**
 * Multi-fallback reliable Twitter/X profile avatar resolver
 */
const avatarCache = {};

export async function fetchTwitterAvatar(username) {
  if (!username || username.length < 2) return null;
  const clean = username.replace('@', '').trim().toLowerCase();

  if (avatarCache[clean]) {
    return avatarCache[clean];
  }

  // 1. Try Microlink direct X profile scraper API (returns direct pbs.twimg.com avatar)
  try {
    const res = await fetch(`https://api.microlink.io/?url=https://x.com/${clean}`);
    if (res.ok) {
      const json = await res.json();
      const imgUrl = json?.data?.image?.url;
      if (imgUrl && imgUrl.includes('twimg.com')) {
        // Wrap with Cloudflare image cache proxy to bypass referrer blocks
        const proxiedUrl = `https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}&w=400&h=400&fit=cover`;
        avatarCache[clean] = proxiedUrl;
        return proxiedUrl;
      }
    }
  } catch (e) {
    // Continue to next fallback
  }

  // 2. Try Vercel Serverless Function (if deployed)
  try {
    const res = await fetch(`/api/avatar?username=${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.avatarUrl && data.avatarUrl.includes('twimg.com')) {
        const proxiedUrl = `https://wsrv.nl/?url=${encodeURIComponent(data.avatarUrl)}&w=400&h=400&fit=cover`;
        avatarCache[clean] = proxiedUrl;
        return proxiedUrl;
      }
    }
  } catch (e) {}

  // 3. Fallback unavatar through wsrv proxy
  const fallbackUrl = `https://wsrv.nl/?url=https://unavatar.io/twitter/${clean}&w=400&h=400&fit=cover`;
  avatarCache[clean] = fallbackUrl;
  return fallbackUrl;
}
