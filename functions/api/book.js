import {
  ok, bad, getSettings, computeSlots, weekdayOf, isValidDate,
  nowParts, fmtWhen, sendEmail, escapeHtml, TZ_DEFAULT,
} from '../_shared/util.js';

// POST /api/book  - create a booking after re-validating the slot is still open.
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try { body = await request.json(); } catch { return bad('Invalid request body'); }

  const {
    name, email, phone, address,
    packageId, packageName, sizeId, sizeLabel,
    addons = [], date, startMin, durationMin, price = 0, notes = '', agreedTerms,
  } = body || {};

  // --- validation ---
  if (!name || !email || !phone || !address) return bad('Missing contact details');
  if (!packageId || !sizeId) return bad('Missing package or vehicle size');
  if (!isValidDate(date)) return bad('Invalid date');
  if (!Number.isInteger(startMin) || !Number.isInteger(durationMin) || durationMin <= 0) return bad('Invalid time');
  if (!agreedTerms) return bad('You must agree to the terms and conditions');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Invalid email address');

  const tz = env.TIMEZONE || TZ_DEFAULT;
  const settings = await getSettings(env);
  const weekday = weekdayOf(date);

  const hours = await env.DB.prepare('SELECT * FROM weekly_hours WHERE weekday = ?').bind(weekday).first();
  const blocksRes = await env.DB.prepare('SELECT start_min, end_min FROM blocks WHERE date = ?').bind(date).all();
  const bookingsRes = await env.DB.prepare(
    "SELECT start_min, duration_min FROM bookings WHERE date = ? AND status = 'confirmed'"
  ).bind(date).all();

  // Re-check the chosen slot is genuinely still available (guards double-booking).
  const validStarts = computeSlots({
    date, durationMin, hours,
    blocks: blocksRes.results || [],
    bookings: bookingsRes.results || [],
    settings, now: nowParts(tz),
  });
  if (!validStarts.includes(startMin)) {
    return bad('Sorry, that time was just taken. Please pick another slot.', 409);
  }

  const addonsJson = JSON.stringify(Array.isArray(addons) ? addons : []);
  const created = Math.floor(Date.now() / 1000);

  const result = await env.DB.prepare(
    `INSERT INTO bookings
       (created_ts, name, email, phone, address, package_id, package_name,
        size_id, size_label, addons, date, start_min, duration_min, price, notes, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'confirmed')`
  ).bind(
    created, name, email, phone, address, packageId, packageName || packageId,
    sizeId, sizeLabel || sizeId, addonsJson, date, startMin, durationMin, price | 0, notes
  ).run();

  // --- emails (best effort; booking is saved regardless) ---
  const when = fmtWhen(date, startMin);
  const addonList = (Array.isArray(addons) ? addons : []).map((a) => a.name).join(', ') || 'None';
  const ownerEmail = env.OWNER_EMAIL;

  const ownerHtml = `
    <h2>New booking</h2>
    <p><strong>${escapeHtml(packageName || packageId)}</strong> (${escapeHtml(sizeLabel || sizeId)})</p>
    <p><strong>When:</strong> ${escapeHtml(when)} (about ${durationMin} min)</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br>
       <strong>Phone:</strong> ${escapeHtml(phone)}<br>
       <strong>Email:</strong> ${escapeHtml(email)}<br>
       <strong>Address:</strong> ${escapeHtml(address)}</p>
    <p><strong>Add-ons:</strong> ${escapeHtml(addonList)}</p>
    <p><strong>Est. price:</strong> $${price | 0}</p>
    <p><strong>Notes:</strong> ${escapeHtml(notes) || '-'}</p>`;

  const customerHtml = `
    <h2>Your Buffer Bros appointment is booked</h2>
    <p>Thanks ${escapeHtml(name.split(' ')[0])}! Here are your details:</p>
    <p><strong>${escapeHtml(packageName || packageId)}</strong> (${escapeHtml(sizeLabel || sizeId)})<br>
       <strong>When:</strong> ${escapeHtml(when)}<br>
       <strong>Where:</strong> ${escapeHtml(address)}</p>
    <p>Add-ons: ${escapeHtml(addonList)}<br>Estimated total: $${price | 0}</p>
    <p>The time given may be an arrival window. Final pricing is confirmed on site and may change if the vehicle needs more work than its package covers. Need to change anything? Call or text us at (239) 293-8511.</p>
    <p>See you soon,<br>Buffer Bros</p>`;

  const emailResults = {};
  if (ownerEmail) emailResults.owner = await sendEmail(env, { to: ownerEmail, subject: `New booking: ${name} on ${when}`, html: ownerHtml, replyTo: email });
  emailResults.customer = await sendEmail(env, { to: email, subject: 'Your Buffer Bros appointment is confirmed', html: customerHtml });

  return ok({ id: result.meta.last_row_id, when, emailResults });
}
