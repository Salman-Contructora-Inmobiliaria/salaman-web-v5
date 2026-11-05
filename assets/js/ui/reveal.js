/* ==========================================================================
   SALMAN — Animaciones de entrada e indicadores de avance (ui/reveal.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const { $$ } = S;

  function initReveal() {
    document.documentElement.classList.add('reveal-init');
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => observer.observe(el));
  }

  function initProgress() {
    setTimeout(() => {
      $$('[data-progress]').forEach((el) => {
        const span = el.querySelector('span');
        if (span) span.style.width = `${Math.max(0, Math.min(100, Number(el.dataset.progress)))}%`;
      });
    }, 350);
  }

  Object.assign(S, {
    initReveal,
    initProgress
  });
})();
