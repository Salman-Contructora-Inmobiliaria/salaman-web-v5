/* ==========================================================================
   SALMAN — Pestaña Concierge y validación humana VIP (chat/concierge.js)
   Conserva las rutas humanas (comercial, diseno, gerencia, vip, orientacion),
   renderConcierge(), setChatTab(), openArea() y openVIP().
   Diseño ergonómico y táctil inspirado en la propuesta ejecutiva de Michelle.
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});

  function createConciergeController(ctx) {
    const { chat, el, esc, t, track, WA, closeVoice, close } = ctx;

    function renderConcierge() {
      if (!el.grid) return;
      el.grid.className = 'dept-list';
      el.grid.innerHTML = CONCIERGE.filter((area) => !area.help && area.id !== 'vip').map((area, i) => `
        <button type="button" class="dept-card area-card" data-area="${area.id}">
          <div class="dept-card__left">
            <span class="dept-card__badge area-card__num">${area.badge || ('0' + (i + 1))}</span>
            <div class="dept-card__info">
              <strong>${esc(area.label[chat.lang] || area.label.es)}</strong>
              <span>${esc(area.desc[chat.lang] || area.desc.es)}</span>
            </div>
          </div>
          <span class="dept-card__arrow" aria-hidden="true">→</span>
        </button>`).join('');
    }

    function setChatTab(tab) {
      chat.tab = tab === 'concierge' ? 'concierge' : 'salma';
      const isConcierge = chat.tab === 'concierge';
      if (el.body) el.body.hidden = isConcierge;
      if (el.chips) el.chips.hidden = isConcierge;
      if (el.form) el.form.hidden = isConcierge;
      if (el.legal) el.legal.hidden = isConcierge;
      if (el.concierge) el.concierge.hidden = !isConcierge;
      if (el.status) el.status.textContent = isConcierge ? (t('concierge.status') || 'WhatsApp Oficial') : t('chat.online');
      el.panel?.classList.toggle('is-concierge', isConcierge);
      document.querySelectorAll('.chat-tab[data-chat-tab]').forEach((btn) => {
        const active = btn.dataset.chatTab === chat.tab;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      if (isConcierge) {
        closeVoice();
        renderConcierge();
      } else if (chat.open) {
        el.text?.focus();
      }
      track('chat_tab', { tab: chat.tab });
    }

    function openArea(id) {
      const area = CONCIERGE.find((a) => a.id === id);
      if (!area) return;
      const message = area.msg[chat.lang] || area.msg.es;
      track('concierge_area', { area: id });
      const url = `${WA}?text=${encodeURIComponent(message)}`;
      const win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
      if (window.innerWidth < 760) close();
    }

    function openVIP() {
      const code = (el.vipInput?.value || '').trim().toUpperCase();
      const area = CONCIERGE.find((a) => a.id === 'vip');
      const placeholder = chat.lang === 'es' ? 'SOLICITAR-ACCESO-VIP' : 'REQUEST-VIP-ACCESS';
      const message = (area.msg[chat.lang] || area.msg.es).replace('{code}', code || placeholder);
      track('concierge_vip', { has_code: Boolean(code) });
      const url = `${WA}?text=${encodeURIComponent(message)}`;
      const win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url;
      if (window.innerWidth < 760) close();
    }

    return {
      renderConcierge,
      setChatTab,
      openArea,
      openVIP
    };
  }

  S.createConciergeController = createConciergeController;
})();
