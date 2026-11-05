/* ==========================================================================
   SALMAN — Inicialización principal de la aplicación (main.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const { $ } = S;
  const CONFIG = S.CONFIG || window.SALMAN?.CONFIG || (typeof window.CONFIG !== "undefined" ? window.CONFIG : {});
  const WA = S.CONFIG?.waUrl || CONFIG.waUrl || `https://wa.me/${CONFIG.whatsapp || "573244286166"}`;

  S.state.lang = S.storage ? S.storage.getLang() : 'es';

  Object.defineProperties(S, {
    lang: {
      get() { return S.state.lang; },
      configurable: true
    },
    whatsapp: {
      get() { return WA; },
      configurable: true
    }
  });

  function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('lang') === 'en' || params.get('lang') === 'es') {
      S.state.lang = params.get('lang');
    }
    if (params.get('nofx') === '1') document.documentElement.classList.add('no-reveal');
    if (params.get('flat') === '1') document.documentElement.classList.add('flat');
    if (params.get('only')) {
      const only = params.get('only');
      document.querySelectorAll('main > section, .hero, .ticker').forEach((section) => {
        if (section.id !== only) section.style.display = 'none';
      });
    }

    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    S.initReveal?.();
    S.applyLanguage?.(S.state.lang);
    S.initHeader?.();
    S.initDials?.();
    S.initBooking?.();
    S.initLeadForm?.();
    S.initDelegates?.();
    S.initCalcTracking?.();
    S.initProgress?.();
    S.track?.('page_view', { page: 'home' });

    setTimeout(() => {
      if (params.get('chat') === '1') window.Salma?.open();
      if (params.get('project')) S.openProject?.(params.get('project'));
      if (params.get('lead')) S.openLead?.(params.get('lead'), params.get('project') || 'marina');
      if (params.get('scroll')) {
        $(`#${params.get('scroll')}`)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 800);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
