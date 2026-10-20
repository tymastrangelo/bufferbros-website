import { ok, bad, sendEmail, escapeHtml } from '@/lib/server/util';

export const dynamic = 'force-dynamic';

const CODE = 'WELCOME5';

// POST /api/subscribe — welcome-offer email capture. Saves to Supabase (one row per
// email; a repeat signup just gets the code again) and emails the code.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('Invalid request body'); }
  const email = String(body?.email || '').trim().slice(0, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Enter a valid email address.');

  const attribution = body?.attribution && typeof body.attribution === 'object'
    ? JSON.parse(JSON.stringify(body.attribution).slice(0, 4000) || 'null')
    : null;

  try {
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/email_signups?on_conflict=email`, {
      method: 'POST',
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'content-type': 'application/json',
        Prefer: 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify({ email: email.toLowerCase(), offer_code: CODE, attribution }),
    });
    // 409 = already on the list (unique on lower(email)) — still send the code
    if (!res.ok && res.status !== 409) throw new Error(`email_signups ${res.status} ${await res.text()}`);
  } catch (err) {
    console.error('subscribe:', err.message);
    return bad('That did not go through. Try again, or text us for the code.', 500);
  }

  await sendEmail({
    to: email,
    subject: 'Your 5% off code from Buffer Bros',
    html: `
      <p>Thanks for joining. Here is your code for 5% off your first detail:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:2px">${CODE}</p>
      <p>It applies automatically when you book on <a href="https://bufferbros.org/booking">bufferbros.org</a>
      from this device. Booking another way? Mention the code and we will take it off.</p>
      <p>Buffer Bros Mobile Detailing<br>Marco Island and Naples, FL<br>(239) 293-8511</p>
      <p style="color:#888;font-size:12px">You are getting this because ${escapeHtml(email)} signed up on bufferbros.org. Reply "unsubscribe" to stop.</p>`,
  });

  return ok({ code: CODE });
}
