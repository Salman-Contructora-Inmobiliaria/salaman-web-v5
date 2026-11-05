/* ==========================================================================
   SALMAN — Persistencia segura en localStorage y sessionStorage (core/storage.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const keys = S.CONFIG?.storageKeys || {
    lang: 'salman.lang',
    chat: 'salman.chat.v1',
    lead: 'salman.lead'
  };

  function getLang() {
    try {
      return localStorage.getItem(keys.lang) === 'en' ? 'en' : 'es';
    } catch (err) {
      return 'es';
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(keys.lang, lang === 'en' ? 'en' : 'es');
    } catch (err) { /* storage bloqueado: ignorar */ }
  }

  function getChatSession() {
    try {
      return JSON.parse(sessionStorage.getItem(keys.chat) || 'null');
    } catch (err) {
      return null;
    }
  }

  function saveChatSession(payload) {
    try {
      sessionStorage.setItem(keys.chat, JSON.stringify(payload));
    } catch (err) { /* storage lleno o bloqueado: no interrumpir */ }
  }

  function saveLead(lead) {
    try {
      sessionStorage.setItem(keys.lead, JSON.stringify(lead));
    } catch (err) { /* noop */ }
  }

  S.storage = {
    getLang,
    setLang,
    getChatSession,
    saveChatSession,
    saveLead
  };
})();
