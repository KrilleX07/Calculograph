/**
 * Multi-fallback Twitter/X profile avatar resolver
 */
const avatarCache = {};

export async function fetchTwitterAvatar(username) {
  if (!username || username.length < 2) return null;
  const clean = username.replace('@', '').trim().toLowerCase();

  if (avatarCache[clean]) {
    return avatarCache[clean];
  }

  // 1. Try Vercel Serverless Function
  try {
    const res = await fetch(`/api/avatar?username=${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.avatarUrl && data.avatarUrl.includes('twimg.com')) {
        avatarCache[clean] = data.avatarUrl;
        return data.avatarUrl;
      }
    }
  } catch (e) {
    // Ignore local error
  }

  // 2. Try Microlink direct CORS API (Returns real pbs.twimg.com image)
  try {
    const res = await fetch(`https://api.microlink.io/?url=https://x.com/${clean}`);
    if (res.ok) {
      const json = await res.json();
      const imgUrl = json?.data?.image?.url;
      if (imgUrl && imgUrl.includes('twimg.com')) {
        avatarCache[clean] = imgUrl;
        return imgUrl;
      }
    }
  } catch (e) {
    // Ignore error
  }

  // 3. Fallback unavatar
  const fallbackUrl = `https://unavatar.io/twitter/${clean}`;
  return fallbackUrl;
}
