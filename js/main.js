const SITE_VERSION = '2026-02-09';
const SITE_VERSION_KEY = 'bb_site_version';

function clearClientCachesIfNeeded() {
  try {
    const currentVersion = localStorage.getItem(SITE_VERSION_KEY);
    if (currentVersion === SITE_VERSION) {
      return;
    }

    localStorage.clear();
    sessionStorage.clear();

    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      });
    }

    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (!name) {
        return;
      }
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
    });

    localStorage.setItem(SITE_VERSION_KEY, SITE_VERSION);
  } catch (error) {
    // If storage is blocked, skip cache clearing to avoid breaking the page.
  }
}

clearClientCachesIfNeeded();

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    if (mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.remove('hidden');
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', 'scale-y-95');
        mobileMenu.classList.add('opacity-100', 'scale-y-100');
      }, 10);
    } else {
      mobileMenu.classList.add('opacity-0', 'scale-y-95');
      mobileMenu.classList.remove('opacity-100', 'scale-y-100');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    }
  });
}

// Instagram Portfolio Loader
const galleryGrid = document.getElementById('gallery-grid');
const loadMoreBtn = document.getElementById('loadMore');

let allPosts = [];
let visibleCount = 0;
const batchSize = 6;

function renderGalleryItems() {
  const toShow = allPosts.slice(0, visibleCount);
  galleryGrid.innerHTML = '';

  toShow.forEach(post => {
    const div = document.createElement("div");
    div.className = "gallery-item relative rounded-xl overflow-hidden shadow-lg group cursor-pointer";

    div.innerHTML = `
      <a href="${post.permalink}" target="_blank">
        <img src="${post.media_url}" alt="${post.caption}" class="w-full h-64 object-cover transition-transform duration-300 ease-out group-hover:scale-105">
        <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div class="pointer-events-auto bg-white bg-opacity-90 text-gray-800 text-base md:text-lg font-semibold px-5 py-2 rounded-full shadow-md">
            View on Instagram
          </div>
        </div>
      </a>
    `;
    galleryGrid.appendChild(div);
  });

  if (visibleCount >= allPosts.length) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

if (galleryGrid && loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    visibleCount += batchSize;
    renderGalleryItems();
  });
}

const bookingFrame = document.getElementById('booking-frame');
const bookingEmbed = document.getElementById('booking-embed');
const bookingFallback = document.getElementById('booking-fallback');

function initBookingEmbed() {
  if (!bookingFrame || !bookingEmbed || !bookingFallback) {
    return;
  }

  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (isDesktop) {
    const src = bookingFrame.getAttribute('data-src');
    if (src && !bookingFrame.src) {
      bookingFrame.src = src;
    }
    bookingEmbed.classList.remove('hidden');
    bookingFallback.classList.add('hidden');
  } else {
    bookingEmbed.classList.add('hidden');
    bookingFallback.classList.remove('hidden');
  }
}

initBookingEmbed();