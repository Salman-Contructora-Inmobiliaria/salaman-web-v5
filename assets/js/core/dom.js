/* ==========================================================================
   SALMAN — Utilidades DOM, formato, modales y notificaciones (core/dom.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const ESC_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  const esc = (str) => String(str).replace(/[&<>"']/g, (c) => ESC_MAP[c]);

  const getLang = () => (S.state && S.state.lang === 'en' ? 'en' : 'es');
  const num = (n) => new Intl.NumberFormat(getLang() === 'es' ? 'es-CO' : 'en-US').format(n);
  const money = (millions) => `$${num(millions)}${getLang() === 'es' ? ' M' : 'M'}`;

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('is-locked');
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
  }

  function initDials() {
    $$('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener('close', () => {
        if (!document.querySelector('dialog[open]')) document.body.classList.remove('is-locked');
      });
    });
  }

  let toastTimer;
  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => { toast.hidden = true; }, 320);
    }, 3200);
  }

  Object.assign(S, {
    $,
    $$,
    esc,
    num,
    money,
    openDialog,
    closeDialog,
    initDials,
    showToast
  });
})();
