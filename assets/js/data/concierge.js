/* ==========================================================================
   SALMAN — Rutas humanas del Concierge (data/concierge.js)
   Tres departamentos ejecutivos (Comercial, Diseño, Gerencia) + VIP + Orientación.
   Conviven con Salma para no perder la atención inmediata con IA y voz.
   ========================================================================== */
'use strict';

const CONCIERGE = [
  {
    id: 'comercial',
    badge: '01',
    label: { es: 'Área Comercial y Ventas', en: 'Sales & Commercial' },
    desc: { es: 'Playa Cangrejo, cupos Lista Cero y agendar cita.', en: 'Playa Cangrejo, Lista Cero spots and visits.' },
    msg: {
      es: 'Hola Salman Constructora e Inmobiliaria. Solicito atención del *1. ÁREA COMERCIAL* para conocer disponibilidad en Playa Cangrejo (Lista Cero) y agendar asesoría privada.',
      en: 'Hi Salman Constructora e Inmobiliaria. I am requesting assistance from *1. SALES & COMMERCIAL* for Playa Cangrejo (Lista Cero) availability and booking a private visit.'
    }
  },
  {
    id: 'diseno',
    badge: '02',
    label: { es: 'Diseño y Arquitectura', en: 'Design & Architecture' },
    desc: { es: 'Planos, acabados de autor y Arquitecto Director.', en: 'Plans, signature finishes and Chief Architect.' },
    msg: {
      es: 'Hola Salman Constructora e Inmobiliaria. Solicito atención del *2. ÁREA DE DISEÑO Y ARQUITECTURA* para revisar planos, especificaciones técnicas y acabados de autor.',
      en: 'Hi Salman Constructora e Inmobiliaria. I am requesting assistance from *2. DESIGN & ARCHITECTURE* to review plans, technical specifications and signature finishes.'
    }
  },
  {
    id: 'gerencia',
    badge: '03',
    label: { es: 'Gerencia General y B2B', en: 'Management & B2B' },
    desc: { es: 'Fondos de inversión, estructuración patrimonial y lotes.', en: 'Investment funds, wealth structuring and land.' },
    msg: {
      es: 'Hola Salman Constructora e Inmobiliaria. Solicito atención con *3. GERENCIA / ESTRUCTURACIÓN* para temas de inversión patrimonial, alianzas estratégicas o licitaciones.',
      en: 'Hi Salman Constructora e Inmobiliaria. I am requesting assistance from *3. MANAGEMENT / STRUCTURING* for wealth investment, strategic partnerships or tenders.'
    }
  },
  {
    id: 'vip',
    label: { es: '✦ Acceso Preventa Privada / Lista Cero', en: '✦ Private Pre-sale / Lista Cero Access' },
    desc: { es: 'Playa Cangrejo frente al mar.', en: 'Playa Cangrejo beachfront access.' },
    msg: {
      es: 'Hola Salman Constructora e Inmobiliaria. Deseo ingresar a la *LISTA CERO / PREVENTA PRIVADA DE PLAYA CANGREJO*. Mi solicitud / código de validación es: *{code}*.',
      en: 'Hi Salman Constructora e Inmobiliaria. I want to access the *LISTA CERO / PRIVATE PRE-SALE OF PLAYA CANGREJO*. My validation code/request is: *{code}*.'
    }
  },
  {
    id: 'orientacion',
    help: true,
    label: { es: 'No sé con quién hablar · Orientarme', en: 'Not sure who to contact · Guide me' },
    desc: { es: 'Te conectamos de inmediato con el área adecuada.', en: 'We will connect you immediately with the right team.' },
    msg: {
      es: 'Hola Salman Constructora e Inmobiliaria. Vengo de la web y requiero orientación general sobre proyectos e inversión en Cartagena. ¿Me pueden dirigir con un asesor?',
      en: 'Hi Salman Constructora e Inmobiliaria. I am coming from the website and need general guidance on projects and investment in Cartagena. Can you direct me to an advisor?'
    }
  }
];

window.SALMAN = window.SALMAN || {};
window.SALMAN.CONCIERGE = CONCIERGE;
