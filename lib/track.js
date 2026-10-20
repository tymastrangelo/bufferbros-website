/* Marketing attribution + conversion reporting (browser only).

   - captureAttribution(): on every landing, remembers where the visitor came from
     (utm_*, gclid/gbraid/wbraid, fbclid, ?ref= referral codes, the referring site).
     First touch is kept forever; last touch updates whenever a new source shows up.
     It rides along with the booking so the dashboard knows which channel paid off.
   - trackBooking() / trackContact(): report real conversions. Google Ads only counts
     an event that names its conversion action (send_to "AW-…/label"); the labels live
     in env vars so they can be set without a code change:
       NEXT_PUBLIC_GADS_BOOKING_LABEL  (Google Ads → Goals → the "Booking" action)
       NEXT_PUBLIC_GADS_CALL_LABEL     (the "Call/Text click" action)
     Without a label we still send GA4 events, which Google Ads can import. */

const KEY = 'bb_attr';
const ADS_ID = 'AW-17448688864';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'ref'];

export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const tags = {};
    for (const k of PARAMS) {
      const v = url.searchParams.get(k);
      if (v) tags[k] = v.slice(0, 200);
    }
    const ref = document.referrer && !document.referrer.includes(window.location.host) ? document.referrer.slice(0, 300) : null;
    const touch = { ...tags, ...(ref ? { referrer: ref } : {}), landing: url.pathname, at: new Date().toISOString() };
    const store = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (!store.first) store.first = touch;
    if (Object.keys(tags).length || ref || !store.last) store.last = touch;
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* private mode / storage blocked: attribution is best effort */
  }
}

export function getAttribution() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

const gtagSafe = (...args) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag(...args);
};

/** A completed online booking, valued at its estimated price. */
export function trackBooking({ value, id }) {
  const label = process.env.NEXT_PUBLIC_GADS_BOOKING_LABEL;
  if (label) gtagSafe('event', 'conversion', { send_to: `${ADS_ID}/${label}`, value, currency: 'USD', transaction_id: id });
  gtagSafe('event', 'generate_lead', { value, currency: 'USD', method: 'online_booking' });
}

/** Tap on a phone or text link — for a local service, as good as a form fill. */
export function trackContact(kind) {
  const label = process.env.NEXT_PUBLIC_GADS_CALL_LABEL;
  if (label) gtagSafe('event', 'conversion', { send_to: `${ADS_ID}/${label}` });
  gtagSafe('event', kind === 'sms' ? 'click_to_text' : 'click_to_call');
}
