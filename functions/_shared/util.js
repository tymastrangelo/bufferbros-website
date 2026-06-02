/* Shared helpers for Buffer Bros booking API (Cloudflare Pages Functions). */

export const TZ_DEFAULT = 'America/New_York';

/* ---------- JSON responses ---------- */
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}
export const ok = (data = {}) => json({ ok: true, ...data });
export const bad = (msg, status = 400) => json({ ok: false, error: msg }, status);

/* ---------- time helpers (timezone aware) ---------- */
// Returns the wall-clock parts of "now" in the given IANA timezone.
export function nowParts(tz = TZ_DEFAULT) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short',
  });
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    minutes: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10),
    weekday: weekdayMap[p.weekday],
  };
}

// Weekday (0..6) for a YYYY-MM-DD date string, computed at UTC noon to avoid DST edges.
export function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
}

export function isValidDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(weekdayOf(s));
}

export function fmtTime(min) {
  let h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}

// "2026-06-06" -> "Wednesday, June 6, 2026" (computed at UTC noon to avoid DST/day shift)
export function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[dt.getUTCDay()]}, ${months[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${y}`;
}

export function fmtWhen(dateStr, startMin) {
  return `${fmtDate(dateStr)} at ${fmtTime(startMin)}`;
}

/* ---------- settings ---------- */
export async function getSettings(env) {
  const def = { slot_granularity_min: 30, min_lead_min: 180, buffer_min: 30 };
  try {
    const { results } = await env.DB.prepare('SELECT key, value FROM settings').all();
    for (const r of results || []) def[r.key] = parseInt(r.value, 10);
  } catch (_) { /* fall back to defaults */ }
  return def;
}

/* ---------- availability engine ----------
   Given a date, an appointment duration and the data for that day,
   return the list of valid start times (minutes from midnight). */
export function computeSlots({ date, durationMin, hours, blocks, bookings, settings, now }) {
  if (!hours || !hours.enabled) return [];
  const gran = settings.slot_granularity_min || 30;
  const buffer = settings.buffer_min || 0;
  const lead = settings.min_lead_min || 0;
  const total = durationMin + buffer; // time the appointment really occupies

  // Busy ranges: blocks + existing confirmed bookings (each padded by buffer).
  const busy = [];
  for (const b of blocks) busy.push([b.start_min, b.end_min]);
  for (const bk of bookings) busy.push([bk.start_min, bk.start_min + bk.duration_min + buffer]);

  const earliest = (date === now.date) ? now.minutes + lead : (date < now.date ? Infinity : 0);

  const slots = [];
  for (let start = hours.open_min; start + durationMin <= hours.close_min; start += gran) {
    if (start < earliest) continue;
    const end = start + total;
    const overlaps = busy.some(([bs, be]) => start < be && end > bs);
    if (!overlaps) slots.push(start);
  }
  return slots;
}

/* ---------- admin auth (HMAC token in cookie) ---------- */
const enc = new TextEncoder();

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=+$/, '');
}

export async function makeToken(env, ttlSeconds = 60 * 60 * 12) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const sig = await hmac(env.ADMIN_SECRET || 'dev-secret', String(exp));
  return `${exp}.${sig}`;
}

export async function verifyToken(env, token) {
  if (!token || !token.includes('.')) return false;
  const [exp, sig] = token.split('.');
  if (parseInt(exp, 10) < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(env.ADMIN_SECRET || 'dev-secret', exp);
  return sig === expected;
}

export function readCookie(request, name) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function requireAdmin(context) {
  const token = readCookie(context.request, 'bb_admin');
  return verifyToken(context.env, token);
}

export function cookieHeader(token, maxAge = 60 * 60 * 12, secure = true) {
  const sec = secure ? ' Secure;' : '';
  const attrs = `Path=/; HttpOnly;${sec} SameSite=Lax; Max-Age=${maxAge}`;
  return token ? `bb_admin=${token}; ${attrs}` : `bb_admin=; Path=/; HttpOnly;${sec} SameSite=Lax; Max-Age=0`;
}

/* ---------- email via Resend (optional) ---------- */
export async function sendEmail(env, { to, subject, html, replyTo }) {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    return { sent: false, reason: 'email-not-configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: env.FROM_EMAIL, to: [to], subject, html, reply_to: replyTo }),
    });
    return { sent: res.ok, status: res.status };
  } catch (e) {
    return { sent: false, reason: String(e) };
  }
}

export function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
