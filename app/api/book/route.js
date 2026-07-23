import { ok, bad, isValidDate, fmtWhen, sbRpc, sendEmail, escapeHtml } from '@/lib/server/util';

export const dynamic = 'force-dynamic';

// POST /api/book — create a booking. Supabase (rpc/book_appointment) re-validates the
// slot under an advisory lock, so double-booking is impossible even if the admin
// dashboard books the same slot at the same moment.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('Invalid request body'); }

  const {
    name, email, phone, address,
    packageId, packageName, sizeId, sizeLabel,
    addons = [], date, startMin, durationMin, price = 0, notes = '', agreedTerms,
  } = body || {};

  if (!name || !email || !phone || !address) return bad('Missing contact details');
  if (!packageId || !sizeId) return bad('Missing package or vehicle size');
  if (!isValidDate(date)) return bad('Invalid date');
  if (!Number.isInteger(startMin) || !Number.isInteger(durationMin) || durationMin <= 0) return bad('Invalid time');
  if (!agreedTerms) return bad('You must agree to the terms and conditions');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Invalid email address');

  let row;
  try {
    const res = await sbRpc('book_appointment', {
      p_date: date,
      p_start_min: startMin,
      p_duration_min: durationMin,
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_address: address,
      p_size_id: sizeId,
      p_size_label: sizeLabel || sizeId,
      p_service_name: packageName || packageId,
      p_addons: Array.isArray(addons) ? addons : [],
      p_price: price | 0,
      p_notes: notes,
    });

    if (!res.ok) {
      let message = '';
      try { message = (await res.json()).message || ''; } catch { /* non-JSON error body */ }
      if (message === 'slot_taken') {
        return bad('Sorry, that time was just taken. Please pick another slot.', 409);
      }
      throw new Error(`book_appointment ${res.status} ${message}`);
    }

    const inserted = await res.json();
    row = Array.isArray(inserted) ? inserted[0] : inserted;
  } catch (err) {
    console.error('book:', err.message);
    return bad('We could not complete the booking. Please call (239) 293-8511.', 500);
  }

  // --- emails (best effort; booking is saved regardless) ---
  const when = fmtWhen(date, startMin);
  const addonList = (Array.isArray(addons) ? addons : []).map((a) => a.name).join(', ') || 'None';
  const ownerEmail = process.env.OWNER_EMAIL;

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
  if (ownerEmail) emailResults.owner = await sendEmail({ to: ownerEmail, subject: `New booking: ${name} on ${when}`, html: ownerHtml, replyTo: email });
  emailResults.customer = await sendEmail({ to: email, subject: 'Your Buffer Bros appointment is confirmed', html: customerHtml });

  return ok({ id: row.id, when, emailResults });
}
