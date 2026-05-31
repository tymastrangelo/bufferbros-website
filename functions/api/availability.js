import { json, bad, getSettings, computeSlots, weekdayOf, isValidDate, nowParts, fmtTime, TZ_DEFAULT } from '../_shared/util.js';

// GET /api/availability?date=YYYY-MM-DD&duration=150
// Returns the open start times for that date, given the appointment duration.
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  const duration = parseInt(url.searchParams.get('duration') || '0', 10);

  if (!isValidDate(date)) return bad('Invalid date');
  if (!duration || duration <= 0 || duration > 1440) return bad('Invalid duration');

  const tz = env.TIMEZONE || TZ_DEFAULT;
  const settings = await getSettings(env);
  const weekday = weekdayOf(date);

  const hours = await env.DB.prepare('SELECT * FROM weekly_hours WHERE weekday = ?').bind(weekday).first();
  const blocksRes = await env.DB.prepare('SELECT start_min, end_min FROM blocks WHERE date = ?').bind(date).all();
  const bookingsRes = await env.DB.prepare(
    "SELECT start_min, duration_min FROM bookings WHERE date = ? AND status = 'confirmed'"
  ).bind(date).all();

  const slots = computeSlots({
    date,
    durationMin: duration,
    hours,
    blocks: blocksRes.results || [],
    bookings: bookingsRes.results || [],
    settings,
    now: nowParts(tz),
  });

  return json({
    ok: true,
    date,
    durationMin: duration,
    slots: slots.map((min) => ({ min, label: fmtTime(min) })),
  });
}
