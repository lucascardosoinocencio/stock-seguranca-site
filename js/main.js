(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- hero visual: só carrega a imagem quando a coluna
     direita realmente aparece (>=1140px) — em telas menores o CSS
     esconde o elemento, mas o navegador baixaria a imagem do mesmo
     jeito se ela estivesse num <img src> normal ---------- */
  const heroVisualImg = document.querySelector('.hero-visual img[data-src]');
  if (heroVisualImg && window.matchMedia('(min-width: 1140px)').matches) {
    heroVisualImg.src = heroVisualImg.dataset.src;
  }

  /* ---------- year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const fab = document.getElementById('fabWhatsapp');
  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    fab.classList.toggle('is-visible', window.scrollY > 400);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobileNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    mobileNav.classList.toggle('is-open', !open);
    document.body.style.overflow = open ? '' : 'hidden';
  });
  mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty('--stagger', i % 6);
      io.observe(el);
    });
  }

  /* ---------- tilt 3D + brilho: placas de marca e crachá ----------
     "sai da tela" ao passar o mouse: inclina em perspectiva, levanta
     (translateZ + leve scale) e um brilho radial acompanha o cursor. */
  if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const isBadge = el.classList.contains('id-badge');
      const max = isBadge ? 9 : 13;
      const lift = isBadge ? 14 : 18;
      const scale = isBadge ? 1.025 : 1.045;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        el.style.setProperty('--tilt-x', `${rx.toFixed(2)}deg`);
        el.style.setProperty('--tilt-y', `${ry.toFixed(2)}deg`);
        el.style.setProperty('--tilt-z', `${lift}px`);
        el.style.setProperty('--tilt-scale', scale);
        el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
        el.style.setProperty('--glare-o', '.28');
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
        el.style.setProperty('--tilt-z', '0px');
        el.style.setProperty('--tilt-scale', 1);
        el.style.setProperty('--glare-o', '0');
      });
    });

    document.querySelectorAll('[data-tilt-soft]').forEach((wrap) => {
      const frame = wrap.querySelector('.hero-visual-frame');
      if (!frame) return;
      const strength = 5;
      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        frame.style.transform = `perspective(1400px) rotateY(${-7 + px * strength}deg) rotateX(${2 - py * strength}deg)`;
      });
      wrap.addEventListener('mouseleave', () => { frame.style.transform = ''; });
    });
  }

  /* ---------- video feed cards: click to play ---------- */
  document.querySelectorAll('[data-video]').forEach((card) => {
    const video = card.querySelector('video');
    const btn = card.querySelector('.play-btn');
    if (!video || !btn) return;

    const play = () => {
      if (!video.getAttribute('src') && video.querySelector('source')) {
        video.load();
      }
      video.muted = false;
      video.play().catch(() => {});
      card.classList.add('is-playing');
    };
    const pause = () => {
      video.pause();
      card.classList.remove('is-playing');
    };

    btn.addEventListener('click', () => {
      card.classList.contains('is-playing') ? pause() : play();
    });
    video.addEventListener('click', () => {
      if (card.classList.contains('is-playing')) pause();
    });
    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
    });
  });

  /* ---------- product catalog filter ---------- */
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.product-card');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.brand === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      lightboxImg.src = btn.dataset.lightbox;
      lightboxImg.alt = btn.querySelector('img')?.alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- radar sweep (canvas) ----------
     Desenhado em canvas em vez de CSS: o pivô é fixado via
     ctx.translate(centro) antes de ctx.rotate() a cada frame, então o
     feixe nunca desliza nem muda de tamanho — não depende de
     transform-origin, clipping ou mask do CSS. */
  const radarCanvas = document.querySelector('.radar-sweep-canvas');
  if (radarCanvas) {
    const ctx = radarCanvas.getContext('2d');
    const beamWidth = (16 * Math.PI) / 180; // mesma largura do feixe anterior (16°)
    const revolutionMs = 4000; // uma volta completa a cada 4s
    let size = 0;

    const resize = () => {
      const rect = radarCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      size = rect.width;
      radarCanvas.width = Math.round(size * dpr);
      radarCanvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawFrame = (angle) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2;
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(centerX, centerY); // pivô fixo: sempre o centro exato do canvas
      ctx.rotate(angle);

      const steps = 28;
      for (let i = 0; i < steps; i++) {
        const t0 = i / steps;
        const t1 = (i + 1) / steps;
        const alpha = 0.5 * (1 - t0) ** 1.4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, -beamWidth * t0, -beamWidth * t1, true);
        ctx.closePath();
        ctx.fillStyle = `rgba(79,195,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }
      // linha de frente mais brilhante, como o "raio" do radar
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * Math.cos(0), radius * Math.sin(0));
      ctx.strokeStyle = 'rgba(200,235,255,.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    if (reducedMotion) {
      drawFrame(0);
    } else {
      let start = null;
      const tick = (now) => {
        if (start === null) start = now;
        const elapsed = (now - start) % revolutionMs;
        const angle = (elapsed / revolutionMs) * Math.PI * 2;
        drawFrame(angle);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }
})();
