/* ==========================================================================
   SALMAN — Proyectos, servicios y preguntas frecuentes (data/projects.js)
   --------------------------------------------------------------------------
   Arquitectura sobria y exclusiva: sin datos especulativos ni cifras no verificadas.
   Categorías: Desarrollo Residencial, Desarrollo Turístico y Proyecto Especial.
   Proyecto Insignia: Playa Cangrejo (Lista Cero · Cupos limitados).
   ========================================================================== */
'use strict';

const PROJECTS = [
  {
    id: 'playa-cangrejo',
    name: 'Playa Cangrejo',
    type: 'insignia',
    typeLabel: { es: 'Proyecto Insignia · Preventa Privada', en: 'Flagship Project · Private Pre-sale' },
    location: { es: 'Playa Cangrejo · Cartagena de Indias', en: 'Playa Cangrejo · Cartagena, Colombia' },
    status: { es: 'Lista Cero · Cupos limitados', en: 'Lista Cero · Limited Spots' },
    statusKey: 'presale',
    img: 'marina',
    gallery: ['marina', 'lobby', 'playa'],
    hook: {
      es: 'Residencias exclusivas frente al mar con marina privada, club de playa y spa. Acceso anticipado en Lista Cero.',
      en: 'Exclusive seafront residences with private marina, beach club and spa. Early access on Lista Cero.'
    },
    desc: {
      es: 'Playa Cangrejo integra diseño arquitectónico contemporáneo, marina privada y espacios de bienestar en una ubicación privilegiada del Caribe. Un proyecto concebido para trascender y generar patrimonio de alto valor, disponible bajo régimen de Lista Cero con cupos estrictamente limitados.',
      en: 'Playa Cangrejo brings together contemporary architectural design, private marina and wellness spaces in a privileged Caribbean location. A project crafted to endure and generate high-value wealth, available on Lista Cero with strictly limited spots.'
    },
    amenities: {
      es: ['Marina privada', 'Club de playa', 'Spa y bienestar', 'Coworking exclusivo', 'Seguridad 24/7', 'Administración patrimonial'],
      en: ['Private marina', 'Beach club', 'Spa & wellness', 'Exclusive coworking', '24/7 security', 'Asset management']
    },
    payment: {
      es: 'Condiciones de estructuración preferentes en Lista Cero · Financiación directa durante obra · Cupos asignados con asesor.',
      en: 'Preferential structuring terms on Lista Cero · Direct financing during construction · Spots confirmed with an advisor.'
    },
    featured: true
  },
  {
    id: 'residencial',
    name: 'Desarrollo Residencial',
    type: 'residencial',
    typeLabel: { es: 'Residencial', en: 'Residential' },
    location: { es: 'Cartagena de Indias', en: 'Cartagena de Indias' },
    status: { es: 'En desarrollo', en: 'In development' },
    statusKey: 'building',
    img: 'torres',
    gallery: ['torres', 'hero', 'lobby'],
    hook: {
      es: 'Arquitectura contemporánea, espacios de bienestar y diseño integrado al entorno.',
      en: 'Contemporary architecture, wellness spaces and design integrated into the environment.'
    },
    desc: {
      es: 'Desarrollos residenciales diseñados para elevar la calidad de vida y conectar con el entorno caribeño. Espacios funcionales, acabados de alto estándar y amenidades concebidas para el bienestar permanente.',
      en: 'Residential developments designed to elevate quality of life and connect with the Caribbean setting. Functional spaces, high standard finishes and amenities crafted for lasting wellness.'
    },
    amenities: {
      es: ['Rooftop con piscina', 'Gimnasio y bienestar', 'Lobby atendido', 'Espacios de trabajo', 'Parqueaderos privados', 'Planta eléctrica total'],
      en: ['Rooftop pool', 'Gym & wellness', 'Attended lobby', 'Workspaces', 'Private parking', 'Full backup generator']
    },
    payment: {
      es: 'Planes de financiación directa durante obra y acompañamiento fiduciario personalizado.',
      en: 'Direct financing during construction and personalized fiduciary advisory.'
    },
    featured: false
  },
  {
    id: 'turistico',
    name: 'Desarrollo Turístico',
    type: 'turistico',
    typeLabel: { es: 'Turístico · Renta Premium', en: 'Resort & Hospitality' },
    location: { es: 'Cartagena de Indias', en: 'Cartagena de Indias' },
    status: { es: 'En desarrollo', en: 'In development' },
    statusKey: 'presale',
    img: 'casa-club',
    gallery: ['casa-club', 'playa', 'lobby'],
    hook: {
      es: 'Experiencias que combinan arquitectura, naturaleza y nuevas formas de habitar.',
      en: 'Experiences combining architecture, nature and new ways of living.'
    },
    desc: {
      es: 'Desarrollos de vocación turística y segunda vivienda frente al mar. Proyectos pensados para el disfrute personal y la valorización patrimonial con esquemas de administración profesional y renta premium.',
      en: 'Seafront resort and second-home developments designed for personal enjoyment and long-term asset appreciation with professional management and premium rental models.'
    },
    amenities: {
      es: ['Club de playa privado', 'Piscina infinity', 'Gastronomía y lounge', 'Acceso directo a playa', 'Servicio de conserjería', 'Administración de rentas'],
      en: ['Private beach club', 'Infinity pool', 'Dining & lounge', 'Direct beach access', 'Concierge service', 'Rental management']
    },
    payment: {
      es: 'Esquemas de pago estructurados para inversionistas y preventa privada en Lista Cero.',
      en: 'Structured investor payment terms and private pre-sale on Lista Cero.'
    },
    featured: false
  },
  {
    id: 'especial',
    name: 'Proyecto Especial',
    type: 'especial',
    typeLabel: { es: 'Proyecto Especial', en: 'Special Project' },
    location: { es: 'Cartagena de Indias', en: 'Cartagena de Indias' },
    status: { es: 'A la medida', en: 'Bespoke' },
    statusKey: 'presale',
    img: 'playa',
    gallery: ['playa', 'lobby', 'hero'],
    hook: {
      es: 'Soluciones arquitectónicas diseñadas alrededor de las necesidades de cada cliente.',
      en: 'Architectural solutions designed around the unique needs of each client.'
    },
    desc: {
      es: 'Proyectos a la medida para clientes e inversionistas que demandan exclusividad absoluta, precisión constructiva y diseño bioclimático adaptado a requerimientos técnicos y espaciales específicos.',
      en: 'Bespoke projects for clients and investors requiring total exclusivity, constructive precision and bioclimatic design tailored to specific technical and spatial requirements.'
    },
    amenities: {
      es: ['Diseño y arquitectura a la medida', 'Consultoría integral 360°', 'Dirección de obra exclusiva', 'Interventoría dedicada', 'Sostenibilidad bioclimática', 'Acabados personalizados'],
      en: ['Bespoke architectural design', '360° comprehensive consulting', 'Exclusive site management', 'Dedicated supervision', 'Bioclimatic sustainability', 'Custom finishes']
    },
    payment: {
      es: 'Estructuración contractual y financiera personalizada acorde al alcance del proyecto.',
      en: 'Tailored contractual and financial structuring aligned with project scope.'
    },
    featured: false
  }
];

const SERVICES = [
  {
    group: { es: 'Constructora', en: 'Construction' },
    intro: {
      es: 'Estructuramos, diseñamos y ejecutamos el proyecto con un solo equipo responsable del presupuesto, el cronograma y la calidad.',
      en: 'We structure, design and build with a single team accountable for budget, schedule and quality.'
    },
    items: [
      { t: { es: 'Gestión integral de proyectos', en: 'End-to-end project management' }, d: { es: 'Planeación, presupuesto, cronograma y coordinación de especialistas bajo un solo responsable.', en: 'Planning, budget, schedule and coordination of specialists under one accountable lead.' } },
      { t: { es: 'Diseño arquitectónico', en: 'Architectural design' }, d: { es: 'Arquitectura contemporánea y funcional, coherente con el lugar y con el presupuesto del cliente.', en: 'Contemporary, functional architecture aligned with the site and the client’s budget.' } },
      { t: { es: 'Diseño urbano', en: 'Urban design' }, d: { es: 'Integramos arquitectura, espacio público y contexto normativo desde la etapa de prefactibilidad.', en: 'We integrate architecture, public space and zoning from the feasibility stage.' } },
      { t: { es: 'Interventoría y auditorías', en: 'Site supervision & audits' }, d: { es: 'Control técnico y administrativo, revisión de costos y detección temprana de desviaciones.', en: 'Technical and administrative control, cost review and early detection of deviations.' } },
      { t: { es: 'Visualización 3D', en: '3D visualisation' }, d: { es: 'Renders, recorridos y planos de venta que permiten decidir con información, no con imaginación.', en: 'Renders, walkthroughs and sales plans that support decisions with facts, not imagination.' } },
      { t: { es: 'Consultoría 360°', en: '360° consulting' }, d: { es: 'Viabilidad, licencias, estructuración financiera y comercialización en una sola conversación.', en: 'Feasibility, permits, financial structuring and sales in a single conversation.' } }
    ]
  },
  {
    group: { es: 'Inmobiliaria', en: 'Real estate' },
    intro: {
      es: 'Acompañamos la compra, la inversión y la venta con análisis técnico, jurídico y financiero del inmueble.',
      en: 'We support purchases, investments and sales with technical, legal and financial analysis of the property.'
    },
    items: [
      { t: { es: 'Búsqueda y acompañamiento', en: 'Search & advisory' }, d: { es: 'Filtramos opciones según presupuesto, uso y expectativa de valorización. Sin listados infinitos.', en: 'We shortlist options by budget, use and appreciation expectations. No endless listings.' } },
      { t: { es: 'Evaluación y diagnóstico', en: 'Property assessment' }, d: { es: 'Condiciones físicas, técnicas y de entorno de propiedades urbanas y rurales.', en: 'Physical, technical and contextual conditions of urban and rural properties.' } },
      { t: { es: 'Análisis normativo', en: 'Zoning analysis' }, d: { es: 'Qué se puede construir, qué no y con qué riesgo, antes de firmar.', en: 'What can be built, what cannot, and at what risk — before signing.' } },
      { t: { es: 'Evaluación jurídica', en: 'Legal review' }, d: { es: 'Títulos, linderos, afectaciones y antecedentes del inmueble.', en: 'Title, boundaries, encumbrances and property records.' } },
      { t: { es: 'Evaluación financiera', en: 'Financial analysis' }, d: { es: 'Flujo de caja, rentabilidad esperada y sensibilidad a ocupación y precio.', en: 'Cash flow, expected return and sensitivity to occupancy and price.' } },
      { t: { es: 'Estructuración de la compra', en: 'Purchase structuring' }, d: { es: 'Negociación, promesa, cuota inicial y coordinación con el banco o el fondo.', en: 'Negotiation, purchase agreement, down payment and coordination with bank or fund.' } }
    ]
  }
];

const FAQ = [
  {
    q: { es: '¿Qué es la Lista Cero?', en: 'What is the Lista Cero?' },
    a: { es: 'Es el acceso anticipado y privado a un proyecto antes de su lanzamiento comercial público: condiciones de estructuración preferentes, prioridad en asignación de ubicación y cupos exclusivos confirmados directamente con un asesor.', en: 'It is early private access to a project prior to its public launch: preferential structuring terms, priority unit selection and exclusive spots confirmed directly with an advisor.' }
  },
  {
    q: { es: '¿Dónde están ubicados los proyectos?', en: 'Where are the projects located?' },
    a: { es: 'Nuestros proyectos se ubican en sectores de alta valorización en Cartagena de Indias y la costa del Caribe. La sala de ventas atiende con cita previa y también coordinamos recorridos virtuales.', en: 'Our projects are located in prime appreciation areas of Cartagena de Indias and the Caribbean coast. The sales gallery receives visitors by appointment and we also provide virtual tours.' }
  },
  {
    q: { es: '¿Puedo comprar desde el exterior?', en: 'Can I buy from abroad?' },
    a: { es: 'Sí. Acompañamos el proceso completo de forma remota: video-llamadas, firma digital y coordinación con apoderado si se requiere. El pago se realiza en pesos colombianos o transferencia internacional.', en: 'Yes. We support the entire process remotely: video calls, digital signature and a local proxy if needed. Payment is in Colombian pesos or by international transfer.' }
  },
  {
    q: { es: '¿Cómo funciona la financiación?', en: 'How does financing work?' },
    a: { es: 'Ofrecemos esquemas directos con SALMAN durante la etapa de obra, así como crédito fiduciario e hipotecario con entidades bancarias aliadas. Cada plan se personaliza con un asesor.', en: 'We offer direct payment plans with SALMAN during construction, as well as mortgage and fiduciary financing with partner institutions. Each plan is customized with an advisor.' }
  },
  {
    q: { es: '¿Cómo puedo acceder a la información de los proyectos?', en: 'How can I access project information?' },
    a: { es: 'Para preservar la exclusividad de nuestros desarrollos en Lista Cero, compartimos las presentaciones y fichas técnicas detalladas de manera privada y personalizada a través de nuestros canales de contacto.', en: 'To preserve the exclusivity of our developments on Lista Cero, we share detailed technical decks privately and personalized via our direct contact channels.' }
  },
  {
    q: { es: '¿Atienden en inglés?', en: 'Do you provide service in English?' },
    a: { es: 'Sí. Nuestro equipo comercial y la asesora digital atienden en español e inglés, por chat, voz y WhatsApp.', en: 'Yes. Our sales team and digital advisor provide full support in Spanish and English via chat, voice and WhatsApp.' }
  },
  {
    q: { es: '¿Cómo protegen mis datos?', en: 'How do you protect my data?' },
    a: { es: 'Tratamos tus datos con tu autorización previa, solo para atender tu solicitud, conforme a la Ley 1581 de 2012 y la política de tratamiento de SALMAN. Puedes solicitar acceso, corrección o eliminación cuando lo desees.', en: 'We process your data strictly with prior consent, solely to handle your inquiry under Colombian Law 1581 of 2012. You may request access, correction or deletion at any time.' }
  }
];
