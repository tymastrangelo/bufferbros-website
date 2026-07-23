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

/* ---------- email via Resend (best effort) ---------- */
export async function sendEmail({ to, subject, html, replyTo }) {
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    return { sent: false, reason: 'email-not-configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: process.env.FROM_EMAIL, to: [to], subject, html, reply_to: replyTo }),
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
