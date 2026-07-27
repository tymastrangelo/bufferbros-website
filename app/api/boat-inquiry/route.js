import { ok, bad, sendEmail, escapeHtml } from '@/lib/server/util';

export const dynamic = 'force-dynamic';

const MAX_PHOTOS = 6;
const MAX_PHOTO_B64 = 6 * 1024 * 1024;   // ~4.5MB per photo after client-side resize
const MAX_TOTAL_B64 = 24 * 1024 * 1024;  // stay well under Resend's 40MB request cap

// POST /api/boat-inquiry — boat quote request with photos, emailed to the owner.
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return bad('Invalid request body'); }

  const { name, phone, email = '', boats = [], notes = '', photos = [] } = body || {};

  if (!name || !phone) return bad('Please include your name and phone number');
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return bad('Invalid email address');
  if (!Array.isArray(photos) || photos.length > MAX_PHOTOS) return bad(`Up to ${MAX_PHOTOS} photos`);
  if (!Array.isArray(boats) || boats.length > 8) return bad('Invalid boat list');

  let total = 0;
  const attachments = [];
  for (const p of photos) {
    if (!p || typeof p.data !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(p.data)) return bad('Invalid photo data');
    if (p.data.length > MAX_PHOTO_B64) return bad('One of the photos is too large');
    total += p.data.length;
    if (total > MAX_TOTAL_B64) return bad('Photos are too large altogether. Try fewer photos.');
    const safeName = String(p.name || 'photo.jpg').replace(/[^\w.-]/g, '_').slice(0, 80);
    attachments.push({ filename: safeName, content: p.data });
  }

  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return bad('We could not send your inquiry. Please call (239) 293-8511.', 500);

  const boatHtml = boats.map((b, i) => `
    <p><strong>Boat ${i + 1}:</strong> ${escapeHtml(b?.makeModel) || '-'}<br>
       <strong>Length:</strong> ${escapeHtml(b?.length) || '-'} ft<br>
       <strong>Where it sits:</strong> ${escapeHtml(b?.location) || '-'}</p>`).join('');

  const ownerHtml = `
    <h2>New boat quote request</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br>
       <strong>Phone:</strong> ${escapeHtml(phone)}<br>
       <strong>Email:</strong> ${escapeHtml(email) || '-'}</p>
    ${boatHtml || '<p><strong>Boat:</strong> no details given</p>'}
    <p><strong>What they need / condition notes:</strong><br>${escapeHtml(notes) || '-'}</p>
    <p>${attachments.length} photo${attachments.length === 1 ? '' : 's'} attached.</p>`;

  const res = await sendEmail({
    to: ownerEmail,
    subject: `Boat quote: ${name}${boats.length > 1 ? ` (${boats.length} boats)` : ''}`,
    html: ownerHtml,
    replyTo: email || undefined,
    attachments,
  });

  if (!res.sent) {
    console.error('boat-inquiry email failed:', res);
    return bad('We could not send your inquiry. Please call or text (239) 293-8511.', 500);
  }
  return ok();
}
