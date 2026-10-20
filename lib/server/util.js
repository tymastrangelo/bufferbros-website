/* Shared helpers for the booking API routes. */

export const jsonRes = (data, status = 200) => Response.json(data, { status });
export const ok = (data = {}) => jsonRes({ ok: true, ...data });
export const bad = (msg, status = 400) => jsonRes({ ok: false, error: msg }, status);

// Weekday (0..6) for a YYYY-MM-DD string, computed at UTC noon to avoid DST edges.
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

// "2026-06-06" -> "Saturday, June 6, 2026"
export function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[dt.getUTCDay()]}, ${months[dt.getUTCMonth()]} ${dt.getUTCDate()}, ${y}`;
}

export const fmtWhen = (dateStr, startMin) => `${fmtDate(dateStr)} at ${fmtTime(startMin)}`;

/* Supabase RPC call with the service-role key. */
export async function sbRpc(fn, params) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return res;
}

/* PATCH rows with the service-role key (e.g. appointments?id=eq.<uuid>). */
export async function sbPatch(path, patch) {
  return fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });
}

/* INSERT one row with the service-role key (e.g. leads). */
export async function sbInsert(table, row) {
  return fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
}

/* Keep only the attribution fields we track, short strings only — this is visitor-supplied. */
export function cleanAttribution(a) {
  if (!a || typeof a !== 'object') return null;
  const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'ref', 'referrer', 'landing', 'at'];
  const touch = (t) => {
    if (!t || typeof t !== 'object') return null;
    const out = {};
    for (const k of KEYS) if (typeof t[k] === 'string' && t[k]) out[k] = t[k].slice(0, 300);
    return Object.keys(out).length ? out : null;
  };
  const out = { first: touch(a.first), last: touch(a.last), heard: typeof a.heard === 'string' ? a.heard.slice(0, 60) : null };
  return out.first || out.last || out.heard ? out : null;
}

/* ---------- email via Resend (best effort) ---------- */
export async function sendEmail({ to, subject, html, replyTo, attachments }) {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    return { sent: false, reason: 'email-not-configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL, to: [to], subject, html, reply_to: replyTo,
        ...(attachments && attachments.length ? { attachments } : {}),
      }),
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
