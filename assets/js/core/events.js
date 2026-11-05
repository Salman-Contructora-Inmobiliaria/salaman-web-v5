/* ==========================================================================
   SALMAN — Analítica (dataLayer) y bus de eventos de idioma (core/events.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});

  function track(event, params = {}) {
    const lang = S.state?.lang === 'en' ? 'en' : 'es';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, lang, ...params });
    if (window.console && console.debug) console.debug('[dataLayer]', event, params);
  }

  function emitLangChange(lang) {
    document.dispatchEvent(new CustomEvent('salman:lang', { detail: { lang } }));
    track('change_language', { lang });
  }

  function onLangChange(handler) {
    document.addEventListener('salman:lang', (event) => {
      handler(event.detail?.lang === 'en' ? 'en' : 'es', event);
    });
  }

  Object.assign(S, {
    track,
    emitLangChange,
    onLangChange
  });
})();
