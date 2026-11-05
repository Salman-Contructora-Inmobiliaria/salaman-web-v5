/* ==========================================================================

   SALMAN — Base de conocimiento local de Salma (data/kb.js)

   --------------------------------------------------------------------------

   En producción esta base se reemplaza por RAG sobre fichas técnicas, precios,

   disponibilidad y documentos legales (ver propuesta, sección 4).

   ========================================================================== */

'use strict';

const KB = [



  {
    id: 'projects',
    keys: ['proyecto', 'proyectos', 'portafolio', 'disponible', 'disponibles', 'disponibilidad', 'que venden', 'project', 'projects', 'portfolio', 'available', 'availability', 'what do you have'],
    es: 'Actualmente nuestro portafolio en Cartagena de Indias se enfoca en tres líneas de desarrollo y nuestro proyecto insignia:\n\n• Playa Cangrejo (Proyecto Insignia · Preventa Lista Cero)\n• Desarrollo Residencial\n• Desarrollo Turístico\n• Proyecto Especial\n\nNos encontramos en preventa privada con cupos estrictamente limitados. ¿Deseas recibir la presentación privada de alguno de ellos?',
    en: 'Currently our portfolio in Cartagena focuses on three development lines and our flagship project:\n\n• Playa Cangrejo (Flagship Project · Lista Cero Pre-sale)\n• Desarrollo Residencial\n• Desarrollo Turístico\n• Proyecto Especial\n\nWe are in private pre-sale with strictly limited spots. Would you like to receive a private presentation for any of them?',
    chips: ['playa_cangrejo', 'visit', 'lista_cero'],
    action: 'portfolio'
  },
  {
    id: 'playa_cangrejo',
    keys: ['playa cangrejo', 'cangrejo', 'marina', 'insignia', 'frente al mar', 'beachfront', 'playa'],
    es: 'Playa Cangrejo es nuestro proyecto insignia frente al mar en Cartagena de Indias, con marina privada, club de playa y spa. Se encuentra en etapa exclusiva de Lista Cero con cupos estrictamente limitados. Los detalles y condiciones de preventa se comparten directamente de manera privada y confidencial con nuestro equipo directivo.',
    en: 'Playa Cangrejo is our beachfront flagship in Cartagena de Indias, featuring a private marina, beach club and spa. Currently in an exclusive Lista Cero phase with strictly limited spots. Full details and pre-sale conditions are shared directly and privately with our leadership team.',
    chips: ['visit', 'brochure', 'lista_cero'],
    action: 'open_project:playa-cangrejo'
  },
  {
    id: 'price',
    keys: ['precio', 'precios', 'cuanto', 'cuánto', 'vale', 'cuesta', 'valor', 'price', 'prices', 'cost', 'how much', 'starting'],
    es: 'Para preservar la exclusividad de nuestros proyectos en etapa de Lista Cero, no publicamos precios ni fichas abiertas en la web. Te conectamos de inmediato con un asesor directivo para entregarte las condiciones de preventa de forma confidencial.',
    en: 'To preserve the exclusivity of our projects currently in Lista Cero, we do not publish open prices or public listings. We can connect you immediately with a senior advisor for confidential pre-sale terms.',
    chips: ['playa_cangrejo', 'visit', 'brochure']
  },

  {

    id: 'marina',

    keys: ['marina', 'cangrejo', 'azul', 'frente al mar', 'beachfront', 'playa cangrejo'],

    es: 'Playa Cangrejo es nuestro proyecto insignia: 40 residencias de 2 a 4 alcobas (118–286 m²), marina privada, club de playa y spa. Entrega diciembre 2027. Desde COP $1.180 M, con cuota inicial del 20% y 36 cuotas durante obra. Hoy quedan 12 unidades y la etapa 1 está 68% vendida.',

    en: 'Playa Cangrejo is our flagship: 40 residences with 2–4 bedrooms (118–286 m²), a private marina, beach club and spa. Delivery December 2027. From COP $1,180M, with 20% down and 36 installments during construction. 12 units remain and phase 1 is 68% sold.',

    chips: ['marina_price', 'visit', 'brochure', 'payment'],

    action: 'open_project:marina'

  },

  {

    id: 'marina_price',

    keys: ['precio marina', 'cuanto vale marina', 'cuanto cuesta marina', 'cuánto cuesta marina', 'precio de marina', 'marina price', 'how much marina', 'valor marina'],

    es: 'Playa Cangrejo arranca en COP $1.180 M para 2 alcobas (118 m²) y llega a COP $3.900 M en la tipología de 4 alcobas con marina. Los precios de Lista Cero se mantienen hasta el lanzamiento público. Te comparto la lista completa por WhatsApp si quieres.',

    en: 'Playa Cangrejo starts at COP $1,180M for a 2-bedroom (118 m²) and reaches COP $3,900M for the 4-bedroom marina residence. Lista Cero pricing holds until the public launch. I can share the full price list on WhatsApp.',

    chips: ['brochure', 'payment', 'visit']

  },

  {

    id: 'price',

    keys: ['precio', 'precios', 'cuanto', 'cuánto', 'vale', 'cuesta', 'valor', 'price', 'prices', 'cost', 'how much', 'starting'],

    es: 'Los precios van desde COP $690 M (Torres Bocagrande, 1 alcoba) hasta COP $3.900 M (Marina, 4 alcobas con marina). Cada proyecto tiene su propia lista y condiciones de Lista Cero. ¿Te interesa una tipología o un rango de inversión en particular?',

    en: 'Prices range from COP $690M (Torres Bocagrande, 1 bedroom) to COP $3,900M (Marina, 4 bedrooms with marina). Each project has its own list and Lista Cero terms. Are you interested in a specific layout or investment range?',

    chips: ['marina', 'torres', 'payment', 'brochure']

  },

  {

    id: 'payment',

    keys: ['financiacion', 'financiación', 'financiar', 'financian', 'financiamiento', 'credito', 'crédito', 'hipoteca', 'credito hipotecario', 'cuota inicial', 'pago', 'pagos', 'formas de pago', 'plan de pagos', 'financing', 'mortgage', 'down payment', 'installments'],

    es: 'Manejamos tres caminos: crédito hipotecario con tu banco, plan de pagos directo con SALMAN durante la obra (cuota inicial desde 15% y hasta 36 cuotas) o compra de contado con descuento por pronto pago. La calculadora de la página te da una cuota estimada; el plan definitivo lo estructura un asesor.',

    en: 'There are three routes: a mortgage with your bank, a direct payment plan with SALMAN during construction (down payment from 15% and up to 36 installments), or cash with an early-payment discount. The calculator gives an estimate; an advisor structures the final plan.',

    chips: ['calculator', 'visit', 'advisor']

  },

  {

    id: 'listacero',

    keys: ['lista cero', 'listacero', 'vip', 'preventa', 'preventas', 'pre-sale', 'presale', 'early access'],

    es: 'La Lista Cero es el acceso antes del lanzamiento público: eliges unidad primero, con precio de estructuración y condiciones de pago preferentes. No tiene costo; se confirma con un asesor y un cupo por comprador. Para Playa Cangrejo quedan 12 cupos.',

    en: 'Lista Cero is access before the public launch: you choose your unit first, at structuring-stage pricing and preferential payment terms. It is free; it is confirmed with an advisor, one spot per buyer. 12 spots remain for Playa Cangrejo.',

    chips: ['marina', 'advisor', 'visit']

  },

  {

    id: 'visit',

    keys: ['visita', 'visitar', 'agendar', 'cita', 'reunion', 'reunión', 'sala de ventas', 'visit', 'appointment', 'schedule', 'meeting', 'tour'],

    es: 'Con gusto. Atendemos en la sala de ventas en Cartagena con cita previa, de lunes a sábado de 8:00 a 18:00, y hacemos recorridos virtuales por video-llamada. Puedo tomar tus datos y un asesor confirma el horario, o puedes elegir la fecha tú mismo en la sección de contacto.',

    en: 'Happy to help. We meet at the Cartagena sales gallery by appointment, Monday to Saturday 8am–6pm, and offer virtual walkthroughs by video call. I can take your details and an advisor will confirm the time, or you can pick a date in the contact section.',

    chips: ['booking', 'advisor', 'whatsapp'],

    action: 'scroll:#agenda'

  },

  {

    id: 'location',

    keys: ['ubicacion', 'ubicación', 'donde', 'dónde', 'direccion', 'dirección', 'location', 'where', 'address', 'zona'],

    es: 'Nuestros desarrollos están en Cartagena de Indias, con nuestro proyecto insignia Playa Cangrejo frente al mar y portafolio en Desarrollo Residencial, Turístico y Proyectos Especiales. La sala de ventas atiende con cita previa. ¿Quieres que un asesor te comparta la información privada?',

    en: 'Our developments are located in Cartagena de Indias, led by our flagship beachfront project Playa Cangrejo and our portfolio in Residential, Tourism and Special Projects. Visits are scheduled by appointment. Would you like an advisor to share private details with you?',

    chips: ['visit', 'advisor', 'whatsapp']

  },

  {

    id: 'delivery',

    keys: ['entrega', 'entregas', 'cuando entregan', 'fecha de entrega', 'delivery', 'when is it ready', 'handover'],

    es: 'Torres Bocagrande: junio 2026 (en obra). Playa Cangrejo y Residencias Mar Abierto: 2027. Casa Club Punta Arena: marzo 2028. Las fechas y condiciones quedan en el contrato, con reportes de avance periódicos.',

    en: 'Torres Bocagrande: June 2026 (under construction). Playa Cangrejo and Residencias Mar Abierto: 2027. Casa Club Punta Arena: March 2028. Dates and terms are set in the contract, with periodic progress reports.',

    chips: ['projects', 'advisor']

  },

  {

    id: 'abroad',

    keys: ['extranjero', 'extranjeros', 'fuera del pais', 'fuera del país', 'desde estados unidos', 'desde usa', 'desde europa', 'desde el exterior', 'vivo fuera', 'vivo en', 'miami', 'nueva york', 'new york', 'panama', 'comprar desde', 'comprar desde miami', 'desde miami', 'abroad', 'foreign', 'from the us', 'international', 'remoto', 'remote'],

    es: 'Sí, acompañamos compradores internacionales de principio a fin: video-llamadas, recorridos virtuales, revisión jurídica, firma digital y apoderado si lo necesitas. El pago puede hacerse por transferencia internacional; te explicamos el proceso cambiario y tributario con nuestro equipo legal.',

    en: 'Yes, we support international buyers end to end: video calls, virtual tours, legal review, digital signature and a local proxy if needed. Payment can be made by international transfer; our legal team explains the currency and tax process.',

    chips: ['advisor', 'brochure', 'visit']

  },

  {

    id: 'english',

    keys: ['ingles', 'inglés', 'english', 'hablan ingles', 'do you speak english', 'speak english'],

    es: 'Of course. I can continue in English — just tell me what you need. Our sales team is bilingual too, and we can send documents in English.',

    en: 'Of course. I can continue in English — just tell me what you need. Our sales team is bilingual too, and we can send documents in English.',

    chips: ['projects', 'price', 'visit']

  },

  {

    id: 'amenities',

    keys: ['amenidades', 'amenities', 'piscina', 'gimnasio', 'spa', 'marina', 'playa', 'beach', 'pool', 'gym', 'parqueadero', 'parking', 'mascotas', 'pets'],

    es: 'Depende del proyecto. Playa Cangrejo: marina privada, club de playa, spa, gimnasio y coworking. Torres Bocagrande: rooftop con piscina y gimnasio. Casa Club: piscina privada y casa club. Mar Abierto: piscina, gimnasio y zona de trabajo; es pet friendly. ¿Te interesa alguno en particular?',

    en: 'It depends on the project. Playa Cangrejo: private marina, beach club, spa, gym and coworking. Torres Bocagrande: rooftop pool and gym. Casa Club: private pool and clubhouse. Mar Abierto: pool, gym and workspace; pet friendly. Any in particular?',

    chips: ['marina', 'torres', 'projects']

  },

  {

    id: 'services',

    keys: ['servicios', 'construyen', 'construccion', 'construcción', 'interventoria', 'interventoría', 'auditoria', 'auditoría', 'diseno', 'diseño', 'services', 'construction', 'design', 'build'],

    es: 'SALMAN hace dos cosas: construcción (gestión integral, diseño arquitectónico y urbano, interventoría, auditorías, visualización 3D y consultoría 360°) e inmobiliaria (búsqueda, evaluación técnica, jurídica y financiera, y estructuración de la compra). ¿Buscas construir, comprar o invertir?',

    en: 'SALMAN does two things: construction (end-to-end management, architectural and urban design, site supervision, audits, 3D visualisation and 360° consulting) and real estate (search, technical, legal and financial assessment, and purchase structuring). Are you looking to build, buy or invest?',

    chips: ['advisor', 'projects', 'visit']

  },

  {

    id: 'invest',

    keys: ['inversion', 'inversión', 'rentabilidad', 'renta', 'roi', 'airbnb', 'arriendo', 'invest', 'investment', 'return', 'rental', 'yield'],

    es: 'Cartagena combina segunda vivienda y renta vacacional. En Playa Cangrejo manejamos proyecciones de ocupación y tarifa para cada tipología, y ofrecemos administración de rentas. La calculadora de la página estima la cuota; el estudio de rentabilidad se entrega con la ficha financiera. ¿Quieres que te lo envíe un asesor?',

    en: 'Cartagena combines second homes and holiday rentals. For Playa Cangrejo we model occupancy and rates per layout, and offer rental management. The page calculator estimates the mortgage payment; the return study comes with the financial sheet. Shall an advisor send it?',

    chips: ['brochure', 'advisor', 'calculator']

  },

  {

    id: 'process',

    keys: ['proceso', 'etapas', 'como comprar', 'cómo comprar', 'quiero comprar', 'comprar', 'compra', 'pasos', 'process', 'steps', 'how to buy', 'workflow'],

    es: 'El proceso es: 1) conversación y selección de proyecto; 2) visita o recorrido virtual; 3) selección de unidad y cotización; 4) estudio de crédito o plan de pagos; 5) promesa de compraventa y cuota inicial; 6) seguimiento de obra con reportes; 7) entrega y escritura. Un asesor te acompaña en cada paso.',

    en: 'The process: 1) conversation and project shortlist; 2) visit or virtual tour; 3) unit selection and quote; 4) mortgage or payment plan review; 5) purchase agreement and down payment; 6) construction updates; 7) delivery and deed. An advisor supports every step.',

    chips: ['visit', 'advisor', 'projects']

  },

  {

    id: 'trust',

    keys: ['quienes son', 'quiénes son', 'empresa', 'experiencia', 'años', 'confiable', 'confianza', 'about', 'company', 'experience', 'trust', 'who are you'],

    es: 'SALMAN es una constructora e inmobiliaria colombiana con sede en Cartagena. Trabajamos con equipo propio de diseño, obra e interventoría, y acompañamiento jurídico en cada compra. En la propuesta de mejora recomendamos publicar años de operación, metros entregados y certificaciones verificables: hoy el sitio no los muestra.',

    en: 'SALMAN is a Colombian developer and real estate firm based in Cartagena. We work with an in-house design, construction and supervision team, plus legal support on every purchase. In the improvement proposal we recommend publishing years in operation, square metres delivered and verifiable certifications: today the site does not show them.',

    chips: ['services', 'projects', 'advisor']

  },

  {

    id: 'contact',

    keys: ['contacto', 'telefono', 'teléfono', 'correo', 'email', 'whatsapp', 'llamar', 'contact', 'phone', 'call', 'mail'],

    es: 'Puedes escribirnos por WhatsApp al +57 324 428 6166, llamar al mismo número o escribir a SalmanSAS.gerencia@gmail.com. Atendemos de lunes a sábado, 8:00 a 18:00 (GMT-5). Si prefieres, te contacto yo con un asesor ahora mismo.',

    en: 'You can message us on WhatsApp at +57 324 428 6166, call the same number or email SalmanSAS.gerencia@gmail.com. We are available Monday to Saturday, 8am–6pm (GMT-5). If you prefer, I can connect you with an advisor right now.',

    chips: ['whatsapp', 'advisor', 'booking']

  },

  {

    id: 'advisor',

    keys: ['asesor', 'humano', 'persona', 'hablar con alguien', 'agente', 'advisor', 'human', 'agent', 'speak to someone', 'real person'],

    es: 'Claro. Déjame tus datos y un asesor te escribe por WhatsApp en horario de atención. También puedo abrir WhatsApp con el resumen de nuestra conversación para que no tengas que repetir nada.',

    en: 'Of course. Leave your details and an advisor will message you on WhatsApp during business hours. I can also open WhatsApp with a summary of our conversation so you don’t have to repeat anything.',

    chips: ['lead', 'whatsapp'],

    action: 'lead'

  },

  {

    id: 'brochure',

    keys: ['brochure', 'ficha', 'ficha tecnica', 'ficha técnica', 'catalogo', 'catálogo', 'planos', 'pdf', 'technical sheet', 'floor plans', 'catalog'],

    es: 'Te comparto la ficha técnica con planos, acabados, lista de precios y disponibilidad. Déjame tu nombre y WhatsApp y la enviamos al instante. ¿Para cuál proyecto la quieres?',

    en: 'I’ll share the technical sheet with floor plans, finishes, price list and availability. Leave your name and WhatsApp and we’ll send it right away. Which project is it for?',

    chips: ['marina', 'torres', 'punta-arena', 'mar-abierto'],

    action: 'lead'

  },

  {

    id: 'thanks',

    keys: ['gracias', 'muchas gracias', 'thanks', 'thank you', 'perfecto', 'excelente'],

    es: 'Con gusto. Si quieres, te dejo en contacto con un asesor o te comparto la ficha del proyecto. También puedes escribirme cuando quieras: sigo aquí.',

    en: 'My pleasure. If you like, I can connect you with an advisor or share the project sheet. You can write to me anytime: I’m here.',

    chips: ['advisor', 'brochure', 'projects']

  },

  {

    id: 'fallback',

    keys: [],

    es: 'No tengo ese dato verificado y prefiero no improvisar con información de un inmueble. Puedo conectarte con un asesor que lo confirma, o responder sobre proyectos, precios, financiación, visitas y disponibilidad. ¿Cuál prefieres?',

    en: 'I don’t have that verified and I’d rather not improvise with property details. I can connect you with an advisor who will confirm, or answer about projects, pricing, financing, visits and availability. Which do you prefer?',

    chips: ['advisor', 'projects', 'whatsapp']

  }

];



window.SALMAN = window.SALMAN || {};

window.SALMAN.KB = KB;

