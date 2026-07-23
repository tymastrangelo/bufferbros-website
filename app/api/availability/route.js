import { ok, bad, isValidDate, fmtTime, sbRpc } from '@/lib/server/util';

export const dynamic = 'force-dynamic';

// GET /api/availability?date=YYYY-MM-DD&duration=150
// Open start times for that date, given the appointment duration. Availability is
// computed by Supabase (rpc/get_available_slots), so weekly hours, blocked time and
// existing appointments from the admin dashboard are all respected.
export async function GET(request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  const duration = parseInt(url.searchParams.get('duration') || '0', 10);

  if (!isValidDate(date)) return bad('Invalid date');
  if (!duration || duration <= 0 || duration > 1440) return bad('Invalid duration');

  try {
    const res = await sbRpc('get_available_slots', { p_date: date, p_duration_min: duration });
    if (!res.ok) throw new Error(`get_available_slots ${res.status}`);
    const rows = await res.json(); // [{slot_min}, …]  (empty = closed/past/no slots)

    return ok({
      date,
      durationMin: duration,
      slots: rows.map((r) => ({ min: r.slot_min, label: fmtTime(r.slot_min) })),
    });
  } catch (err) {
    console.error('availability:', err.message);
    return bad('Could not load open times', 500);
  }
}
