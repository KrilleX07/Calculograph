import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://elibjmyazbjpcgjyttpb.supabase.co';
const supabaseAnonKey = 'sb_publishable_1WnSwEvbKpVZwEdZo_AkZw_oLID3iXG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Master Genesis invite codes that are always valid
export const MASTER_INVITE_CODES = [
  'GENESIS',
  'CALCULOGRAPH',
  'CALC',
  'CHRONO',
  'TIME',
  'CLOCK',
  'WALLSTREET',
  'VIP',
  'ALPHA',
  'ROBINHOOD',
  'GOLD',
  'DEGEN',
  'SOL',
  'APE',
  'MOON'
];

/**
 * Get exact total registered count from Supabase with 0 latency
 */
export async function getWhitelistCount() {
  try {
    const { count, error } = await supabase
      .from('whitelist')
      .select('*', { count: 'exact', head: true });

    if (!error && typeof count === 'number') {
      return count;
    }
  } catch (e) {
    console.warn('Count fetch notice:', e);
  }
  return 0;
}

/**
 * Check if a Twitter handle is already registered in DB
 */
export async function checkTwitterExists(twitter) {
  if (!twitter || !twitter.trim()) return false;
  const clean = twitter.startsWith('@') ? twitter.trim() : `@${twitter.trim()}`;

  try {
    const { data, error } = await supabase
      .from('whitelist')
      .select('id, twitter_handle')
      .ilike('twitter_handle', clean)
      .limit(1);

    if (!error && data && data.length > 0) {
      return true;
    }
  } catch (e) {
    console.warn('Twitter existence check notice:', e);
  }
  return false;
}

/**
 * Check if a Wallet address is already registered in DB
 */
export async function checkWalletExists(wallet) {
  if (!wallet || !wallet.trim()) return false;
  const clean = wallet.toLowerCase().trim();

  try {
    const { data, error } = await supabase
      .from('whitelist')
      .select('id, wallet_address')
      .ilike('wallet_address', clean)
      .limit(1);

    if (!error && data && data.length > 0) {
      return true;
    }
  } catch (e) {
    console.warn('Wallet existence check notice:', e);
  }
  return false;
}

/**
 * Validate if an invite code exists (master codes or created by existing users)
 */
export async function validateInviteCode(code) {
  if (!code || !code.trim()) return { valid: true, optional: true };

  const clean = code.trim().toUpperCase();

  // Check master codes
  if (MASTER_INVITE_CODES.includes(clean)) {
    return { valid: true, code: clean };
  }

  // Check in Supabase if code exists as a user's referral code or handle
  try {
    const { data, error } = await supabase
      .from('whitelist')
      .select('id, twitter_handle')
      .or(`discord_handle.ilike.%${clean}%,twitter_handle.ilike.%${clean}%`)
      .limit(1);

    if (!error && data && data.length > 0) {
      return { valid: true, code: clean };
    }
  } catch (e) {
    console.warn('Invite code check warning:', e);
  }

  return { valid: false, message: 'Invalid Invite Code. Please leave blank or enter a valid referral code.' };
}

/**
 * Register user in Supabase whitelist table with strict duplication protection and honest sequential spot number
 */
export async function registerWhitelistUser({ wallet, twitter, inviteCode, myRefCode }) {
  const cleanWallet = wallet.toLowerCase().trim();
  const cleanTwitter = twitter.startsWith('@') ? twitter.trim() : `@${twitter.trim()}`;
  const cleanInvite = inviteCode ? inviteCode.trim().toUpperCase() : null;

  // Pre-check Twitter duplicate
  const twitterTaken = await checkTwitterExists(cleanTwitter);
  if (twitterTaken) {
    return { 
      success: false, 
      error: 'duplicate_twitter', 
      message: `The X account ${cleanTwitter} is already registered on the Allowlist!` 
    };
  }

  // Pre-check Wallet duplicate
  const walletTaken = await checkWalletExists(cleanWallet);
  if (walletTaken) {
    return { 
      success: false, 
      error: 'duplicate_wallet', 
      message: `The wallet address ${cleanWallet.slice(0, 6)}...${cleanWallet.slice(-4)} is already registered on the Allowlist!` 
    };
  }

  try {
    // Honest sequential spot number from DB (1 -> '0001', 42 -> '0042')
    const currentCount = await getWhitelistCount();
    const spotNumber = String(currentCount + 1).padStart(4, '0');

    const metaParts = [`code:${myRefCode}`, `spot:${spotNumber}`];
    if (cleanInvite) metaParts.push(`ref:${cleanInvite}`);

    const { data, error } = await supabase
      .from('whitelist')
      .insert([
        {
          wallet_address: cleanWallet,
          twitter_handle: cleanTwitter,
          discord_handle: metaParts.join('|'),
        }
      ])
      .select();

    if (error) {
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return { 
          success: false, 
          error: 'duplicate', 
          message: 'This wallet or X account has already been registered on the Allowlist.' 
        };
      }
      console.warn('Supabase insert notice:', error);
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      spotNumber, 
      refCode: myRefCode, 
      data 
    };
  } catch (err) {
    console.error('Supabase registration error:', err);
    return { success: false, message: err.message || 'Failed to submit.' };
  }
}
