/* Welcome offer (browser side). One code for everyone who joins the email list;
   the dashboard sees who claimed it (email_signups) and who redeemed it (booking
   notes + redeemed_at). Booking applies it automatically once claimed here. */
export const OFFER = { pct: 5, code: 'WELCOME5' };

const SEEN = 'bb_offer_seen';
const CLAIM = 'bb_offer';

const read = (k) => {
  try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; }
};
const write = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ }
};

export const getClaim = () => read(CLAIM);
export const setClaim = (email) => {
  write(CLAIM, { code: OFFER.code, pct: OFFER.pct, email, at: Date.now() });
  window.dispatchEvent(new Event('bb:offer-claimed'));
};
export const clearClaim = () => {
  try { localStorage.removeItem(CLAIM); } catch { /* ignore */ }
};
/** Auto-popup at most once every 14 days, and never after claiming. */
export const shouldAutoOpen = () => {
  if (getClaim()) return false;
  const seen = read(SEEN);
  return !seen || Date.now() - seen > 14 * 864e5;
};
export const markSeen = () => write(SEEN, Date.now());
export const openOffer = () => window.dispatchEvent(new Event('bb:offer-open'));
