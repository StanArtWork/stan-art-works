// ── Smooth Scroll (Lenis) ──────────────────────────────────
const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ── GSAP Setup ────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ── Custom Cursor ─────────────────────────────────────────
const cursor = document.querySelector('.cursor');
const hoverEls = document.querySelectorAll('a, button, .grid-item');

if (cursor) {
    document.addEventListener('mousemove', e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: .1, ease: 'power2.out' });
    });
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

// ── Hero Animation ────────────────────────────────────────
gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.navbar',      { opacity: 0, y: -20, duration: 1.2, delay: .1 })
    .to  ('.word',        { y: 0, duration: 1.6, stagger: .12 },     '-=1')
    .to  ('.hero-subtitle', { opacity: 1, duration: 1.2 },           '-=.9')
    .to  ('.scroll-indicator', { opacity: 1, duration: .8 },         '-=.6')
    .to  ('.scroll-line', { scaleX: 1, duration: 1, ease: 'power2.out' }, '-=.4');

// ── Grid Scroll Reveal ────────────────────────────────────
document.querySelectorAll('.grid-item').forEach((item, i) => {
    gsap.fromTo(item,
        { opacity: 0, y: 24 },
        {
            opacity: 1, y: 0,
            duration: .9,
            ease: 'power3.out',
            delay: (i % 3) * 0.06, // subtle stagger per row
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none',
            }
        }
    );
});

// ── Lightbox ──────────────────────────────────────────────
const lightbox   = document.getElementById('lightbox');
const lbMedia    = document.getElementById('lb-media');
const lbTitle    = document.getElementById('lb-title');
const lbType     = document.getElementById('lb-type');
const lbDesc     = document.getElementById('lb-desc');
const lbClose    = document.getElementById('lb-close');
const lbBackdrop = document.getElementById('lb-backdrop');

let activeVideo = null;

function openLightbox(item) {
    lbTitle.textContent = item.dataset.title || '';
    lbType.textContent  = item.dataset.type  || '';
    lbDesc.textContent  = item.dataset.desc  || '';
    lbMedia.innerHTML   = '';

    const srcVideo = item.querySelector('video source');
    const srcImg   = item.querySelector('img');

    if (srcVideo) {
        const v = document.createElement('video');
        v.autoplay = v.muted = v.loop = v.playsInline = true;
        v.innerHTML = `<source src="${srcVideo.src}" type="video/mp4">`;
        lbMedia.appendChild(v);
        activeVideo = v;
    } else if (srcImg) {
        const img = document.createElement('img');
        img.src = srcImg.src;
        img.alt = item.dataset.title || '';
        lbMedia.appendChild(img);
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lenis.stop();
}

function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (activeVideo) { activeVideo.pause(); activeVideo = null; }
    setTimeout(() => { lbMedia.innerHTML = ''; }, 450);
    lenis.start();
}

document.querySelectorAll('.grid-item').forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
});
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Footer Reveal ─────────────────────────────────────────
gsap.from('.footer-inner', {
    opacity: 0, y: 30, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.site-footer', start: 'top 88%' }
});
