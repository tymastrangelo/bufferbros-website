import {
  ok, bad, getSettings, makeToken,
  cookieHeader, requireAdmin, isValidDate, fmtWhen, sendEmail, escapeHtml,
} from '../../_shared/util.js';

/* ---------- customer email templates ---------- */
const footer = '<p style="margin-top:16px">Questions? Call or text us at (239) 293-8511.</p><p>Buffer Bros</p>';

function emailConfirm({ name, what, when, address }) {
  return `<h2>Your Buffer Bros appointment is confirmed</h2>
    <p>Hi ${escapeHtml((name || '').split(' ')[0] || 'there')}, your appointment is set:</p>
    <p><strong>${escapeHtml(what)}</strong><br><strong>When:</strong> ${escapeHtml(when)}${address ? `<br><strong>Where:</strong> ${escapeHtml(address)}` : ''}</p>
    <p>The time may be an arrival window, and final pricing is confirmed on site.</p>${footer}`;
}
function emailChanged({ name, what, oldWhen, newWhen, address }) {
  return `<h2>Your Buffer Bros appointment was updated</h2>
    <p>Hi ${escapeHtml((name || '').split(' ')[0] || 'there')}, your appointment has been rescheduled.</p>
    <p><strong>${escapeHtml(what)}</strong></p>
    <p style="color:#64748b;text-decoration:line-through">Was: ${escapeHtml(oldWhen)}</p>
    <p><strong>Now: ${escapeHtml(newWhen)}</strong>${address ? `<br><strong>Where:</strong> ${escapeHtml(address)}` : ''}</p>
    <p>If this new time does not work, just reply or call us.</p>${footer}`;
}
function emailCancelled({ name, what, when }) {
  return `<h2>Your Buffer Bros appointment was cancelled</h2>
    <p>Hi ${escapeHtml((name || '').split(' ')[0] || 'there')}, your appointment below has been cancelled:</p>
    <p><strong>${escapeHtml(what)}</strong><br>${escapeHtml(when)}</p>
    <p>Want to rebook? Visit bufferbros.org or call us and we will find a new time.</p>${footer}`;
}
const whatOf = (b) => `${b.package_name || 'Appointment'}${b.size_label ? ` (${b.size_label})` : ''}`;
const whenOf = (date, startMin) => fmtWhen(date, startMin);

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

  // --- manually add an appointment (counts toward availability like a real booking) ---
  if (route === 'create' && method === 'POST') {
    let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
    const {
      name, phone = '', email = '', address = '', date,
      startMin, durationMin, sizeLabel = '', packageName = 'Appointment',
      notes = '', notify = false,
    } = body || {};
    if (!name) return bad('Customer name is required');
    if (!isValidDate(date)) return bad('Invalid date');
    if (!Number.isInteger(startMin) || !Number.isInteger(durationMin) || durationMin <= 0) return bad('Invalid time or duration');

    const created = Math.floor(Date.now() / 1000);
    const result = await env.DB.prepare(
      `INSERT INTO bookings
        (created_ts, name, email, phone, address, package_id, package_name, size_id, size_label,
         addons, date, start_min, duration_min, price, notes, status)
       VALUES (?,?,?,?,?, 'manual', ?, '', ?, '[]', ?,?,?, 0, ?, 'confirmed')`
    ).bind(created, name, email, phone, address, packageName, sizeLabel, date, startMin, durationMin, notes).run();

    let emailResult = { sent: false, reason: 'not-requested' };
    if (notify && email) {
      emailResult = await sendEmail(env, {
        to: email, subject: 'Your Buffer Bros appointment is confirmed',
        html: emailConfirm({ name, what: `${packageName}${sizeLabel ? ` (${sizeLabel})` : ''}`, when: whenOf(date, startMin), address }),
      });
    }
    return ok({ id: result.meta.last_row_id, emailResult });
  }

  // --- edit / reschedule a booking (optionally email the customer) ---
  if (route === 'update' && method === 'POST') {
    let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
    const { id, date, startMin, durationMin, notify = true } = body || {};
    if (!id) return bad('Missing id');
    if (!isValidDate(date)) return bad('Invalid date');
    if (!Number.isInteger(startMin) || !Number.isInteger(durationMin) || durationMin <= 0) return bad('Invalid time or duration');

    const existing = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id | 0).first();
    if (!existing) return bad('Booking not found', 404);

    const merged = {
      name: body.name ?? existing.name,
      phone: body.phone ?? existing.phone,
      email: body.email ?? existing.email,
      address: body.address ?? existing.address,
      notes: body.notes ?? existing.notes,
    };
    await env.DB.prepare(
      'UPDATE bookings SET name=?, phone=?, email=?, address=?, notes=?, date=?, start_min=?, duration_min=? WHERE id=?'
    ).bind(merged.name, merged.phone, merged.email, merged.address, merged.notes, date, startMin, durationMin, id | 0).run();

    const oldWhen = whenOf(existing.date, existing.start_min);
    const newWhen = whenOf(date, startMin);
    let emailResult = { sent: false, reason: 'not-requested' };
    if (notify && merged.email && (oldWhen !== newWhen)) {
      emailResult = await sendEmail(env, {
        to: merged.email, subject: 'Your Buffer Bros appointment was updated',
        html: emailChanged({ name: merged.name, what: whatOf(existing), oldWhen, newWhen, address: merged.address }),
      });
    }
    return ok({ emailResult });
  }

  if (route === 'cancel' && method === 'POST') {
    let body; try { body = await request.json(); } catch { return bad('Invalid body'); }
    if (!body.id) return bad('Missing id');
    const existing = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(body.id | 0).first();
    await env.DB.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").bind(body.id | 0).run();

    let emailResult = { sent: false, reason: 'not-requested' };
    const notify = body.notify !== false; // default to notifying the customer
    if (existing && notify && existing.email) {
      emailResult = await sendEmail(env, {
        to: existing.email, subject: 'Your Buffer Bros appointment was cancelled',
        html: emailCancelled({ name: existing.name, what: whatOf(existing), when: whenOf(existing.date, existing.start_min) }),
      });
    }
    return ok({ emailResult });
  }

  return bad('Not found', 404);
}
