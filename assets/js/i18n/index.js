/* ==========================================================================
   SALMAN — API pública de internacionalización ES/EN (i18n/index.js)
   Metadatos de idioma, resolución de claves y sincronización con el DOM.
   ========================================================================== */
'use strict';

const LANG_META = {
  es: { html: 'es-CO', speech: 'es-CO', tts: 'es-CO', label: 'Español' },
  en: { html: 'en', speech: 'en-US', tts: 'en-US', label: 'English' }
};

(() => {
  const S = (window.SALMAN = window.SALMAN || {});
  S.LANG_META = LANG_META;
  S.TEXT = window.TEXT;

  const getLang = () => (S.state && S.state.lang === 'en' ? 'en' : 'es');

  const t = (key) => {
    const lang = getLang();
    return (window.TEXT[lang] && window.TEXT[lang][key]) ?? window.TEXT.es?.[key] ?? key;
  };

  const tf = (key, vars = {}) => t(key).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));

  function applyLanguage(lang) {
    S.state = S.state || { lang: 'es', filter: 'all', lead: { action: 'general', project: 'marina' } };
    S.state.lang = lang === 'en' ? 'en' : 'es';

    if (S.storage?.setLang) S.storage.setLang(S.state.lang);
    else {
      try { localStorage.setItem('salman.lang', S.state.lang); } catch (err) { /* noop */ }
    }

    document.documentElement.lang = LANG_META[S.state.lang].html;

    const $$ = S.$$ || ((sel, ctx = document) => Array.from(ctx.querySelectorAll(sel)));
    const $ = S.$ || ((sel, ctx = document) => ctx.querySelector(sel));

    $$('[data-i18n]').forEach((el) => {
      const value = t(el.dataset.i18n);
      if (value !== undefined) el.innerHTML = value;
    });

    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    $$('[data-lang]').forEach((btn) => {
      const active = btn.dataset.lang === S.state.lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    S.renderProjects?.();
    S.renderServices?.();
    S.renderFAQ?.();
    S.updateCalc?.();
    if (S.closeDialog) S.closeDialog($('#projectModal'));

    const leadOpen = $('#leadModal')?.hasAttribute('open');
    if (leadOpen) {
      const titles = {
        brochure: 'ui.lead.brochureTitle',
        plan: 'ui.lead.planTitle',
        price: 'ui.lead.priceTitle'
      };
      const key = titles[S.state.lead?.action] || 'ui.lead.titleGeneric';
      const titleEl = $('#leadModalTitle');
      if (titleEl) titleEl.textContent = t(key);
    }

    if (S.emitLangChange) S.emitLangChange(S.state.lang);
    else {
      document.dispatchEvent(new CustomEvent('salman:lang', { detail: { lang: S.state.lang } }));
      S.track?.('change_language', { lang: S.state.lang });
    }
  }

  S.t = t;
  S.tf = tf;
  S.setLang = applyLanguage;
  S.applyLanguage = applyLanguage;
})();
