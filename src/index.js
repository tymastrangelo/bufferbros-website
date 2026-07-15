/* Buffer Bros Worker entry point.
   Serves the static site (via the ASSETS binding) and routes the
   booking API. The handler modules under /functions are reused as-is. */

import { onRequestGet as availabilityGet } from '../functions/api/availability.js';
import { onRequestPost as bookPost } from '../functions/api/book.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/api/')) {
      try {
        if (pathname === '/api/availability') return await availabilityGet({ request, env });
        if (pathname === '/api/book') return await bookPost({ request, env });
        return new Response(JSON.stringify({ ok: false, error: 'Not found' }), {
          status: 404, headers: { 'content-type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: 'Server error' }), {
          status: 500, headers: { 'content-type': 'application/json' },
        });
      }
    }

    // Not an API route: serve the static site.
    return env.ASSETS.fetch(request);
  },
};
