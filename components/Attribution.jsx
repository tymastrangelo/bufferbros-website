'use client';

import { useEffect } from 'react';
import { captureAttribution, trackContact } from '@/lib/track';

/* Mounted once in the layout: records the traffic source and reports every
   tap on a tel:/sms: link anywhere on the site as a contact conversion. */
export default function Attribution() {
  useEffect(() => {
    captureAttribution();
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="tel:"], a[href^="sms:"]');
      if (a) trackContact(a.getAttribute('href').startsWith('sms:') ? 'sms' : 'call');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
