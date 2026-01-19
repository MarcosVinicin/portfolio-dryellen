/* ====== Helpers ====== */
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

/* ====== Mobile nav toggle ====== */
const navToggle = $('#navToggle');
const mainNav = $('#mainNav');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  mainNav.style.display = expanded ? null : 'block';
});

/* ====== Smooth scroll and hash-based tabs ====== */
const navLinks = $$('.nav-list a');
navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    // allow normal behavior for external links like instagram / mailto
    const href = a.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({behavior: 'smooth', block: 'start'});
      history.replaceState(null, '', `#${id}`);
      if (window.innerWidth < 640 && mainNav) {
        mainNav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

/* On load, if hash present, scroll to it */
window.addEventListener('load', () => {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) el.scrollIntoView();
  }
  // set year in footer
  $('#year') && ($('#year').textContent = new Date().getFullYear());
});

/* ====== Gallery lightbox ====== */
const galleryItems = $$('.gallery-item');
const lightbox = $('#lightbox');
const lightboxImg = $('.lightbox-image');
const lbClose = $('.lightbox-close');
const lbPrev = $('.lightbox-prev');
const lbNext = $('.lightbox-next');

let galleryIndex = 0;
const gallerySrc = galleryItems.map((btn) => btn.dataset.src);

function openLightbox(idx){
  galleryIndex = idx;
  lightboxImg.src = gallerySrc[idx];
  lightboxImg.alt = `Galeria imagem ${idx+1}`;
  lightbox.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  lightbox.focus?.();
}
function closeLightbox(){
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}
function showPrev(){ openLightbox((galleryIndex - 1 + gallerySrc.length) % gallerySrc.length) }
function showNext(){ openLightbox((galleryIndex + 1) % gallerySrc.length) }

galleryItems.forEach((btn, i) => {
  btn.addEventListener('click', () => openLightbox(i));
});
lbClose?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', showPrev);
lbNext?.addEventListener('click', showNext);

document.addEventListener('keydown', (e) => {
  if (lightbox.getAttribute('aria-hidden') === 'false') {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  }
});

/* Click outside to close */
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ====== Testimonials carousel simple ====== */
const testimonials = $$('.testimonials .testimonial');
let tIndex = 0;
function showTestimonial(i){
  testimonials.forEach((t, idx) => t.classList.toggle('active', idx === i));
}
if (testimonials.length){
  showTestimonial(0);
  let tInterval = setInterval(() => {
    tIndex = (tIndex+1) % testimonials.length;
    showTestimonial(tIndex);
  }, 5000);

  // prev/next buttons
  $$('.testimonial-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(tInterval);
      if (btn.classList.contains('prev')) tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
      else tIndex = (tIndex + 1) % testimonials.length;
      showTestimonial(tIndex);
      // restart autoplay
      tInterval = setInterval(() => { tIndex = (tIndex+1) % testimonials.length; showTestimonial(tIndex); }, 5000);
    });
  });
}

/* ====== Contact form (mailto fallback) ====== */
const form = $('#contactForm');
const formMessage = $('#formMessage');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (!name || !email || !message || message.length < 10) {
      formMessage.textContent = 'Preencha corretamente todos os campos (mensagem com pelo menos 10 caracteres).';
      formMessage.style.color = 'crimson';
      return;
    }

    // Try to open mail client via mailto:
    const subject = encodeURIComponent(`Contato via portfólio — ${name}`);
    const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`);
    const mailto = `mailto:dryellenramos2019@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailto;
    formMessage.textContent = 'Abrindo seu cliente de email...';
    formMessage.style.color = 'green';
    form.reset();
  });
}
