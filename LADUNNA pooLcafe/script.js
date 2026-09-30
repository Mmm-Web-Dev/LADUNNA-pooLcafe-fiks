// ============================================
//  LADUNNA PooLCafe - script.js
// ============================================

// === NAVBAR ===
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Set initial class immediately to avoid flash
navbar.classList.add('transparent');

function updateNavbar() {
  if (window.scrollY > 80) {
    navbar.classList.add('solid');
    navbar.classList.remove('transparent');
  } else {
    navbar.classList.add('transparent');
    navbar.classList.remove('solid');
  }
}
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Click outside nav to close
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// === ACTIVE NAV LINK ===
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinkEls.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveLink, { passive: true });

// === SMOOTH SCROLLING ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// === REVEAL ON SCROLL ===
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// === HERO IMAGE ANIMATION ===
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  if (heroImg.complete) heroImg.classList.add('loaded');
}

// === PARALLAX NATURE ===
const natureBg = document.getElementById('natureBg');
if (natureBg) {
  window.addEventListener('scroll', () => {
    const el = natureBg.closest('.nature-parallax');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.bottom > 0 && rect.top < viewH) {
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = progress * 40 - 20;
      natureBg.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });
}

// === GALLERY FILTER ===
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// === LIGHTBOX ===
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxOverlay = document.getElementById('lightboxOverlay');

let currentIdx = 0;
let visibleItems = [];

function openLightbox(idx) {
  visibleItems = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
  currentIdx = idx;
  const img = visibleItems[currentIdx].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  visibleItems = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
  currentIdx = (currentIdx - 1 + visibleItems.length) % visibleItems.length;
  const img = visibleItems[currentIdx].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

function showNext() {
  visibleItems = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
  currentIdx = (currentIdx + 1) % visibleItems.length;
  const img = visibleItems[currentIdx].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    const visible = Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
    const visIdx = visible.indexOf(item);
    openLightbox(visIdx);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Swipe for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});

// === SCROLL INDICATOR HIDE ===
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });
}

// === STAGGER REVEAL for grid items ===
const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const parent = entry.target;
      const children = parent.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 100);
      });
      gridObserver.unobserve(parent);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.experience-grid, .fasilitas-grid, .kontak-grid').forEach(el => {
  gridObserver.observe(el);
});

console.log('LADUNNA PooLCafe website loaded.');
