/* ===========================================================
   Buffer Bros - shared site chrome (nav + footer) and UI behavior
   Single source of truth for navigation so every page stays in sync.
   =========================================================== */

const SITE_VERSION = '2026-05-31d';
const SITE_VERSION_KEY = 'bb_site_version';

const BB = {
  phone: '(239) 293-8511',
  phoneHref: 'tel:2392938511',
  smsHref: 'sms:2392938511',
  instagram: 'https://www.instagram.com/bufferbros.fl',
  facebook: 'https://www.facebook.com/profile.php?id=61560055724078',
  reviews: 'https://maps.app.goo.gl/y6Ws2vG7vtHUXxGX7',
  hours: 'Open 7 days a week',
  area: 'Marco Island and Naples, FL',
};

/* ---- one-time cache bust when the site version changes ---- */
(function clearClientCachesIfNeeded() {
  try {
    if (localStorage.getItem(SITE_VERSION_KEY) === SITE_VERSION) return;
    localStorage.clear();
    sessionStorage.clear();
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
    }
    localStorage.setItem(SITE_VERSION_KEY, SITE_VERSION);
  } catch (_) { /* storage blocked, ignore */ }
})();

/* ---- navigation model ---- */
const NAV_LINKS = [
  { href: 'index.html',     label: 'Home' },
  { href: 'about.html',     label: 'About' },
  { href: 'packages.html',  label: 'Packages' },
  { href: 'portfolio.html', label: 'Portfolio' },
];

function currentPage() {
  const path = location.pathname.split('/').pop();
  return path === '' ? 'index.html' : path;
}

function renderHeader() {
  const here = currentPage();
  const links = NAV_LINKS.map((l) => {
    const active = l.href === here ? ' active' : '';
    return `<a href="${l.href}" class="nav-link${active}">${l.label}</a>`;
  }).join('');

  const mobileLinks = NAV_LINKS.map((l) => {
    const active = l.href === here ? ' text-brand' : ' text-gray-900';
    return `<a href="${l.href}" class="block px-3 py-3 text-base font-medium${active} hover:bg-gray-50 rounded-lg">${l.label}</a>`;
  }).join('');

  return `
  <nav class="site-nav">
    <div class="container flex items-center justify-between h-20">
      <a href="index.html" class="flex items-center shrink-0" aria-label="Buffer Bros home">
        <img src="images/black-logo.png" alt="Buffer Bros" class="h-11 w-auto">
      </a>
      <div class="hidden md:flex items-center gap-8">
        ${links}
        <a href="booking.html" class="btn btn-primary py-2.5 px-5 text-sm">Book Now</a>
      </div>
      <button id="menu-btn" class="md:hidden p-2 -mr-2 text-gray-900" aria-label="Open menu" aria-expanded="false">
        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <div id="mobile-menu" class="mobile-menu is-hidden md:hidden border-t border-gray-100 bg-white">
      <div class="container py-3 space-y-1">
        ${mobileLinks}
        <a href="booking.html" class="btn btn-primary btn-block mt-2">Book Now</a>
      </div>
    </div>
  </nav>`;
}

function renderFooter() {
  const year = 2026;
  const quick = NAV_LINKS.concat([{ href: 'booking.html', label: 'Book Now' }])
    .map((l) => `<li><a href="${l.href}" class="text-gray-400 hover:text-white transition">${l.label}</a></li>`)
    .join('');

  return `
  <footer class="bg-[color:var(--ink)] text-white pt-14 pb-8">
    <div class="container">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div class="md:col-span-1">
          <img src="images/transparent-logo.png" alt="Buffer Bros" class="h-12 w-auto mb-4">
          <p class="text-gray-400 text-sm leading-relaxed">Premium mobile detailing brought to your driveway in ${BB.area}.</p>
          <div class="flex gap-3 mt-5">
            <a href="${BB.instagram}" target="_blank" rel="noopener" aria-label="Instagram" class="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><i class="fab fa-instagram"></i></a>
            <a href="${BB.facebook}" target="_blank" rel="noopener" aria-label="Facebook" class="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><i class="fab fa-facebook-f"></i></a>
            <a href="${BB.phoneHref}" aria-label="Call us" class="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><i class="fas fa-phone-alt"></i></a>
          </div>
        </div>
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Explore</h3>
          <ul class="space-y-2.5 text-sm">${quick}</ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Company</h3>
          <ul class="space-y-2.5 text-sm">
            <li><a href="packages.html" class="text-gray-400 hover:text-white transition">Pricing</a></li>
            <li><a href="booking.html" class="text-gray-400 hover:text-white transition">Book an Appointment</a></li>
            <li><a href="terms.html" class="text-gray-400 hover:text-white transition">Terms &amp; Conditions</a></li>
            <li><a href="privacy.html" class="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Contact</h3>
          <ul class="space-y-2.5 text-sm text-gray-400">
            <li><a href="${BB.phoneHref}" class="hover:text-white transition"><i class="fas fa-phone-alt w-5"></i>${BB.phone}</a></li>
            <li><a href="${BB.instagram}" target="_blank" rel="noopener" class="hover:text-white transition"><i class="fab fa-instagram w-5"></i>@bufferbros.fl</a></li>
            <li><span><i class="fas fa-location-dot w-5"></i>${BB.area}</span></li>
            <li><span><i class="fas fa-clock w-5"></i>${BB.hours}</span></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <p>&copy; ${year} Buffer Bros Detailing. All rights reserved.</p>
        <p>Insured mobile detailing in Southwest Florida.</p>
      </div>
    </div>
  </footer>`;
}

function wireMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => menu.classList.add('is-hidden'))
  );
}

function wireReveals() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();
  wireMobileMenu();
  wireReveals();
});
