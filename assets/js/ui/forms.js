/* ==========================================================================
   SALMAN — Formularios de agendamiento, leads y envío a WhatsApp (ui/forms.js)
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const { $, $$, track, openDialog, closeDialog, showToast, projectName } = S;
  const WA = S.CONFIG?.waUrl || `https://wa.me/${CONFIG.whatsapp}`;
  const getLang = () => (S.state?.lang === 'en' ? 'en' : 'es');
  const t = (key) => S.t(key);
  const tf = (key, vars) => S.tf(key, vars);

  function openLead(action, projectId) {
    S.state.lead = {
      action: action || 'general',
      project: projectId || S.CONFIG?.defaultProject || 'marina'
    };
    const titles = {
      brochure: ['ui.lead.brochureTitle', 'ui.lead.brochureSub'],
      plan: ['ui.lead.planTitle', 'ui.lead.planSub'],
      price: ['ui.lead.priceTitle', 'ui.lead.priceSub']
    };
    const [titleKey, subKey] = titles[action] || ['ui.lead.titleGeneric', 'ui.lead.subGeneric'];
    const title = $('#leadModalTitle');
    const sub = $('#leadModalSub');
    if (title) title.textContent = t(titleKey);
    if (sub) sub.textContent = t(subKey);
    const modal = $('#leadModal');
    openDialog(modal);
    track('lead_start', { action: S.state.lead.action, project: S.state.lead.project });
    setTimeout(() => $('#leadName')?.focus(), 120);
  }

  function clearErrors(form) {
    $$('.field.has-error', form).forEach((f) => f.classList.remove('has-error'));
    const status = $('.form-status', form);
    if (status) { status.textContent = ''; status.className = 'form-status'; }
  }

  function fieldError(input, message) {
    const field = input.closest('.field');
    if (field) field.classList.add('has-error');
    return message;
  }

  function validateCommon(form) {
    clearErrors(form);
    const inputs = $$('input[required], select[required]', form);
    for (const input of inputs) {
      if (input.type === 'checkbox' && !input.checked) {
        return { ok: false, message: fieldError(input, t('ui.validation.consent')) };
      }
      if (input.type !== 'checkbox' && !input.value.trim()) {
        return { ok: false, message: fieldError(input, t('ui.validation.required')) };
      }
    }
    const email = $('input[type="email"]', form);
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      return { ok: false, message: fieldError(email, t('ui.validation.email')) };
    }
    const phone = $('input[type="tel"]', form);
    if (phone && phone.value.replace(/\D/g, '').length < 7) {
      return { ok: false, message: fieldError(phone, t('ui.validation.phone')) };
    }
    return { ok: true };
  }

  function openWhatsApp(message) {
    const url = `${WA}?text=${encodeURIComponent(message)}`;
    track('whatsapp_click', { source: 'form' });
    const win = window.open(url, '_blank', 'noopener');
    if (!win) window.location.href = url;
    showToast(t('toast.opening'));
  }

  function initBooking() {
    const form = $('#bookingForm');
    if (!form) return;
    const date = $('#bookDate');
    if (date) {
      const today = new Date();
      const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      date.min = iso;
      const tomorrow = new Date(today.getTime() + 86400000);
      date.value = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    }
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const check = validateCommon(form);
      const status = $('#bookingStatus');
      if (!check.ok) {
        if (status) { status.textContent = check.message; status.className = 'form-status is-error'; }
        return;
      }
      const projectId = $('#bookProject').value;
      const msg = tf('whatsapp.booking', {
        project: projectId === 'general' ? t('booking.general') : projectName(projectId),
        date: $('#bookDate').value,
        time: $('#bookTime').value,
        name: $('#bookName').value.trim(),
        email: $('#bookEmail').value.trim()
      });
      openWhatsApp(msg);
      track('booking_submit', { project: projectId });
      if (status) {
        status.textContent = getLang() === 'es'
          ? 'Listo. Se abrió WhatsApp con tu solicitud; un asesor confirmará el horario.'
          : 'Done. WhatsApp opened with your request; an advisor will confirm the time.';
        status.className = 'form-status is-ok';
      }
    });
    form.addEventListener('input', (event) => {
      if (event.target.closest('.field')) event.target.closest('.field').classList.remove('has-error');
    });
  }

  function initLeadForm() {
    const form = $('#leadForm');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const check = validateCommon(form);
      const status = $('#leadStatus');
      if (!check.ok) {
        if (status) { status.textContent = check.message; status.className = 'form-status is-error'; }
        return;
      }
      const name = $('#leadName').value.trim();
      const project = projectName(S.state.lead.project);
      let msg;
      if (S.state.lead.action === 'plan') {
        msg = tf('whatsapp.plan', { project, name });
      } else if (S.state.lead.action === 'price') {
        msg = getLang() === 'es'
          ? `Hola SALMAN, quiero recibir la lista de precios de ${project}. Mi nombre es ${name}.`
          : `Hi SALMAN, I'd like the price list for ${project}. My name is ${name}.`;
      } else {
        msg = tf('whatsapp.brochure', { project, name });
      }
      openWhatsApp(msg);
      track('lead_submit', { action: S.state.lead.action, project: S.state.lead.project });
      if (status) {
        status.textContent = getLang() === 'es' ? 'Listo. Te escribimos por WhatsApp.' : 'Done. We’ll message you on WhatsApp.';
        status.className = 'form-status is-ok';
      }
      setTimeout(() => {
        closeDialog($('#leadModal'));
        form.reset();
        if (status) { status.textContent = ''; status.className = 'form-status'; }
      }, 1400);
    });
    form.addEventListener('input', (event) => {
      if (event.target.closest('.field')) event.target.closest('.field').classList.remove('has-error');
    });
  }

  Object.assign(S, {
    openLead,
    openWhatsApp,
    initBooking,
    initLeadForm
  });
})();
