import {
  ok, bad, json, getSettings, makeToken, verifyToken,
  readCookie, cookieHeader, requireAdmin, isValidDate,
} from '../../_shared/util.js';

export async function onRequest(context) {
  const { request, env, params } = context;
  const seg = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const route = (seg[0] || '').toLowerCase();
  const method = request.method.toUpperCase();

  // --- login is the only unauthenticated admin route ---
  if (route === 'login') {
    if (method !== 'POST') return bad('Method not allowed', 405);
    let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
    if (!env.ADMIN_PASSWORD) return bad('Admin password not configured on the server', 500);
    if (!body || body.password !== env.ADMIN_PASSWORD) return bad('Incorrect password', 401);
    const token = await makeToken(env);
    const secure = new URL(request.url).protocol === 'https:';
    return new Response(JSON.stringify({ ok: true, loggedIn: true }), {
      headers: { 'content-type': 'application/json', 'Set-Cookie': cookieHeader(token, 60 * 60 * 12, secure) },
    });
  }

  // --- everything else requires a valid admin token ---
  if (route !== 'login') {
    const authed = await requireAdmin(context);
    if (!authed && route !== 'logout') return bad('Not authorized', 401);
  }

  if (route === 'logout' && method === 'POST') {
    const secure = new URL(request.url).protocol === 'https:';
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json', 'Set-Cookie': cookieHeader('', 0, secure) },
    });
  }

  if (route === 'config' && method === 'GET') {
    const hours = await env.DB.prepare('SELECT * FROM weekly_hours ORDER BY weekday').all();
    const blocks = await env.DB.prepare('SELECT * FROM blocks ORDER BY date, start_min').all();
    const settings = await getSettings(env);
    return ok({ hours: hours.results || [], blocks: blocks.results || [], settings });
  }

  if (route === 'hours' && method === 'POST') {
    let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
    const rows = body && Array.isArray(body.hours) ? body.hours : null;
    if (!rows) return bad('Missing hours');
    const stmts = rows.map((r) =>
      env.DB.prepare('UPDATE weekly_hours SET enabled = ?, open_min = ?, close_min = ? WHERE weekday = ?')
        .bind(r.enabled ? 1 : 0, r.open_min | 0, r.close_min | 0, r.weekday | 0));
    await env.DB.batch(stmts);
    return ok();
  }

  if (route === 'block') {
    if (method === 'POST') {
      let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
      // Accept a single date or a list of dates (for multi-day blocks).
      const dates = Array.isArray(body.dates) ? body.dates : [body.date];
      const startMin = Number.isInteger(body.start_min) ? body.start_min : 0;
      const endMin = Number.isInteger(body.end_min) ? body.end_min : 1440;
      const reason = (body.reason || '').slice(0, 200);
      if (endMin <= startMin) return bad('End time must be after start time');
      const valid = dates.filter(isValidDate);
      if (!valid.length) return bad('No valid dates');
      const stmts = valid.map((d) =>
        env.DB.prepare('INSERT INTO blocks (date, start_min, end_min, reason) VALUES (?,?,?,?)')
          .bind(d, startMin, endMin, reason));
      await env.DB.batch(stmts);
      return ok({ added: valid.length });
    }
    if (method === 'DELETE') {
      const id = parseInt(new URL(request.url).searchParams.get('id') || '0', 10);
      if (!id) return bad('Missing id');
      await env.DB.prepare('DELETE FROM blocks WHERE id = ?').bind(id).run();
      return ok();
    }
    return bad('Method not allowed', 405);
  }

  if (route === 'bookings') {
    if (method === 'GET') {
      const url = new URL(request.url);
      const from = url.searchParams.get('from');
      let q = "SELECT * FROM bookings WHERE status = 'confirmed'";
      const binds = [];
      if (isValidDate(from)) { q += ' AND date >= ?'; binds.push(from); }
      q += ' ORDER BY date, start_min';
      const res = await env.DB.prepare(q).bind(...binds).all();
      return ok({ bookings: res.results || [] });
    }
    return bad('Method not allowed', 405);
  }

  if (route === 'cancel' && method === 'POST') {
    let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
    if (!body.id) return bad('Missing id');
    await env.DB.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(body.id | 0).run();
    return ok();
  }

  return bad('Not found', 404);
}
