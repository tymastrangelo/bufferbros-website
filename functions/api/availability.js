import { json, bad, isValidDate, fmtTime } from '../_shared/util.js';

// GET /api/availability?date=YYYY-MM-DD&duration=150
// Returns the open start times for that date, given the appointment duration.
// Availability is computed by Supabase (rpc/get_available_slots), so weekly hours,
// blocked time and existing appointments from the admin dashboard are all respected.
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  const duration = parseInt(url.searchParams.get('duration') || '0', 10);

  if (!isValidDate(date)) return bad('Invalid date');
  if (!duration || duration <= 0 || duration > 1440) return bad('Invalid duration');

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/get_available_slots`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ p_date: date, p_duration_min: duration }),
  });
  if (!res.ok) throw new Error(`get_available_slots ${res.status}`); // -> generic 500 in the Worker
  const rows = await res.json(); // [{slot_min}, …]  (empty = closed/past/no slots)

  return json({
    ok: true,
    date,
    durationMin: duration,
    slots: rows.map((r) => ({ min: r.slot_min, label: fmtTime(r.slot_min) })),
  });
}
