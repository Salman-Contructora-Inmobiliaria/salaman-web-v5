/* ==========================================================================
   SALMAN — Configuración central y constantes (core/config.js)
   Una sola fuente de verdad para teléfono, WhatsApp, rutas y claves de sesión.
   ========================================================================== */
'use strict';

const CONFIG = Object.freeze({
  brand: 'SALMAN',
  legal: 'SALMAN Constructora + Inmobiliaria S.A.S.',
  whatsapp: '573244286166',
  phoneDisplay: '+57 324 428 6166',
  waUrl: 'https://wa.me/573244286166',
  email: 'SalmanSAS.gerencia@gmail.com',
  city: { es: 'Cartagena, Bolívar', en: 'Cartagena, Colombia' },
  hours: { es: 'Lun a sáb · 8:00 a 18:00', en: 'Mon–Sat · 8am–6pm' },
  trm: 4070,
  defaultProject: 'marina',
  storageKeys: Object.freeze({
    lang: 'salman.lang',
    chat: 'salman.chat.v1',
    lead: 'salman.lead'
  }),
  ivaNote: {
    es: 'Precios en millones de COP. IVA y acabados según ficha técnica.',
    en: 'Prices in COP millions. VAT and finishes per technical sheet.'
  }
});

window.SALMAN = window.SALMAN || {};
window.SALMAN.CONFIG = CONFIG;
window.SALMAN.state = window.SALMAN.state || {
  lang: 'es',
  filter: 'all',
  lead: { action: 'general', project: CONFIG.defaultProject }
};
