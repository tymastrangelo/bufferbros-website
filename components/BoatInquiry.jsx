'use client';

import { useState } from 'react';
import { BB } from '@/lib/site';

const MAX_PHOTOS = 6;

/* Resize a photo to ~1600px JPEG so uploads stay small; falls back to the
   original file if the browser can't decode it (e.g. HEIC outside Safari). */
async function toBase64(file) {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    return { name: file.name.replace(/\.\w+$/, '') + '.jpg', data: dataUrl.split(',')[1], preview: dataUrl };
  } catch {
    if (file.size > 4 * 1024 * 1024) throw new Error(`${file.name} is too large`);
    const data = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result.split(',')[1]);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    return { name: file.name, data, preview: null };
  }
}

const EMPTY_BOAT = { makeModel: '', length: '', location: '' };
const MAX_BOATS = 4;

export default function BoatInquiry() {
  const [photos, setPhotos] = useState([]);
  const [boats, setBoats] = useState([{ ...EMPTY_BOAT }]);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const setBoat = (i, key, value) =>
    setBoats((bs) => bs.map((b, j) => (j === i ? { ...b, [key]: value } : b)));

  async function addPhotos(e) {
    setError('');
    const files = [...e.target.files].slice(0, MAX_PHOTOS - photos.length);
    e.target.value = '';
    try {
      const added = await Promise.all(files.map(toBase64));
      setPhotos((p) => [...p, ...added].slice(0, MAX_PHOTOS));
    } catch (err) {
      setError(String(err.message || err));
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setStatus('sending');
    const f = new FormData(e.target);
    try {
      const res = await fetch('/api/boat-inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), phone: f.get('phone'), email: f.get('email'),
          boats, notes: f.get('notes'),
          photos: photos.map(({ name, data }) => ({ name, data })),
        }),
      });
      const out = await res.json();
      if (!out.ok) throw new Error(out.error || 'Something went wrong');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(String(err.message || err));
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-10">
        <div className="h-14 w-14 mx-auto rounded-full grid place-items-center text-2xl text-white mb-4" style={{ background: '#16a34a' }}>
          <i className="fas fa-check" aria-hidden />
        </div>
        <h3 className="text-xl font-bold mb-2">Got it, we&apos;ll be in touch</h3>
        <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--slate-soft)' }}>
          We&apos;ll look everything over and text you a personal quote, usually within the day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="b-name">Name</label>
          <input id="b-name" name="name" className="field" required autoComplete="name" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="b-phone">Phone</label>
          <input id="b-phone" name="phone" type="tel" className="field" required autoComplete="tel" placeholder="(239) 555-0123" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="b-email">Email <span className="font-normal opacity-60">(optional)</span></label>
          <input id="b-email" name="email" type="email" className="field" autoComplete="email" placeholder="you@example.com" />
        </div>
      </div>

      {boats.map((b, i) => (
        <fieldset key={i} className="rounded-2xl border p-4 space-y-4" style={{ borderColor: 'var(--line)' }}>
          <legend className="label px-2 flex items-center gap-3">
            {boats.length > 1 ? `Boat ${i + 1}` : 'Your boat'}
            {boats.length > 1 && (
              <button type="button" onClick={() => setBoats((bs) => bs.filter((_, j) => j !== i))}
                      className="text-xs font-semibold text-red-600 hover:underline normal-case tracking-normal">
                Remove
              </button>
            )}
          </legend>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="label" htmlFor={`b-make-${i}`}>Make &amp; model</label>
              <input id={`b-make-${i}`} className="field" placeholder="e.g. Boston Whaler 280"
                     value={b.makeModel} onChange={(e) => setBoat(i, 'makeModel', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor={`b-length-${i}`}>Length (ft)</label>
                <input id={`b-length-${i}`} type="number" min="8" max="120" className="field" placeholder="28"
                       value={b.length} onChange={(e) => setBoat(i, 'length', e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor={`b-loc-${i}`}>Where it sits</label>
                <select id={`b-loc-${i}`} className="field" value={b.location}
                        onChange={(e) => setBoat(i, 'location', e.target.value)}>
                  <option value="">Choose one</option>
                  <option>Dock</option>
                  <option>Lift</option>
                  <option>Trailer</option>
                  <option>Dry storage</option>
                </select>
              </div>
            </div>
          </div>
        </fieldset>
      ))}
      {boats.length < MAX_BOATS && (
        <button type="button" onClick={() => setBoats((bs) => [...bs, { ...EMPTY_BOAT }])}
                className="text-sm font-semibold text-brand hover:underline">
          <i className="fas fa-plus mr-1.5 text-xs" aria-hidden />Add another boat
        </button>
      )}
      <div>
        <label className="label" htmlFor="b-notes">What does it need?</label>
        <textarea id="b-notes" name="notes" className="field" rows={3}
          placeholder="Oxidation, water spots, mildew, interior condition, anything you want handled" />
      </div>

      <div>
        <span className="label">Photos of the boat &amp; problem areas <span className="font-normal opacity-60">(up to {MAX_PHOTOS})</span></span>
        <div className="flex flex-wrap gap-3 mt-1">
          {photos.map((p, i) => (
            <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
              {p.preview
                ? <img src={p.preview} alt="" className="h-full w-full object-cover" />
                : <span className="h-full w-full grid place-items-center text-xs px-1 text-center" style={{ color: 'var(--slate-soft)' }}>{p.name}</span>}
              <button type="button" onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 h-5 w-5 grid place-items-center rounded-full bg-black/60 text-white text-[10px]"
                aria-label="Remove photo">
                <i className="fas fa-xmark" aria-hidden />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="h-20 w-20 rounded-xl border-2 border-dashed grid place-items-center cursor-pointer text-lg transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                   style={{ borderColor: 'var(--line)', color: 'var(--slate-soft)' }}>
              <i className="fas fa-camera" aria-hidden />
              <span className="sr-only">Add photos</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
            </label>
          )}
        </div>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send it over for a quote'}
      </button>
      <p className="text-center text-xs" style={{ color: 'var(--slate-soft)' }}>
        Prefer to just text the photos? <a href={BB.smsHref} className="text-brand font-semibold">Text us at {BB.phone}</a>
      </p>
    </form>
  );
}
