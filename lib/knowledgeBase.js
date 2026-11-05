/**
 * lib/knowledgeBase.js
 * 
 * Base de Conocimiento Oficial (salmanKnowledgeBase) estructurada a partir del
 * documento oficial de Constructora e Inmobiliaria Salman S.A.S. (Cartagena de Indias, 2026).
 * Incluye directivas de comportamiento para síntesis de voz (Gemini Flash).
 */

const salmanKnowledgeBase = {
  corporativo: {
    nombre: 'Constructora e Inmobiliaria SALMAN S.A.S.',
    sede: 'Cartagena de Indias, Bolívar, Colombia',
    trayectoria: 'Más de 18 años de excelencia arquitectónica y más de 120.000 metros cuadrados entregados.',
    lemas: [
      'Arquitectura que se habita. Inversión que trasciende.',
      'Diseñamos, construimos y estructuramos patrimonio con el mismo equipo humano.'
    ],
    canalesOficiales: {
      telefonoWhatsApp: '+57 324 428 6166',
      correo: 'SalmanSAS.gerencia@gmail.com',
      salaVentas: 'Cartagena, Bolívar (Atención exclusiva con cita previa)',
      horario: 'Lunes a sábado de 8:00 a 18:00 (GMT-5)'
    },
    cumplimientoLegal: 'Tratamiento estricto de datos bajo la Ley 1581 de 2012 de Habeas Data.'
  },

  proyectoInsignia: {
    nombre: 'Playa Cangrejo (Cangrejo Azul)',
    ubicacion: 'Frente al mar en sector de alta valorización en Cartagena de Indias',
    concepto: 'Residencias de alto standing frente al mar integradas con marina privada, club de playa exclusivo y spa de bienestar.',
    modalidad: 'Preventa Privada bajo régimen exclusivo de Lista Cero.',
    disponibilidad: 'Cupos estrictamente limitados con asignación preferente y directa.',
    politicaConfidencialidad: 'Para salvaguardar la plusvalía de los inversionistas de Lista Cero, no se publican precios fijos ni áreas genéricas en la web abierta. Toda la información detallada y el brochure confidencial se entregan mediante cita privada virtual o presencial.'
  },

  portafolioLineas: [
    {
      linea: 'Desarrollo Residencial',
      descripcion: 'Residencias contemporáneas bioclimáticas frente al mar con rooftop, piscina panorámica, lobby y espacios de coworking.'
    },
    {
      linea: 'Desarrollo Turístico (Renta Premium)',
      descripcion: 'Complejos vacacionales de alta gama con club de playa, piscina infinity y modelo de administración profesional hotelera.'
    },
    {
      linea: 'Proyecto Especial (A la Medida)',
      descripcion: 'Estructuración singular para fondos de inversión, clientes corporativos y alianzas estratégicas.'
    }
  ],

  pilaresInversion: [
    '01. Preventa Lista Cero: Precios de estructuración preferentes antes de la apertura masiva al mercado.',
    '02. Plan Directo SALMAN: Esquema de pagos flexible directamente con la constructora durante la obra.',
    '03. Respaldo Fiduciario Integral: Alianzas con fiduciarias y entidades bancarias de primer nivel.'
  ],

  inversionistasExtranjeros: 'Proceso 100% digital asistido: recorridos virtuales, reuniones personalizadas, revisión con equipo legal bilingüe, firma electrónica y transferencias fiduciarias en USD o COP.',

  rutasConcierge: {
    comercial: 'Área Comercial: Cupos de Lista Cero, brochure confidencial y visitas.',
    diseno: 'Equipo Técnico: Planos, memoria descriptiva y especificaciones de acabados con el Arquitecto Director.',
    gerencia: 'Gerencia General / B2B: Inversión institucional, fondos y alianzas.',
    vip: 'Lista Cero VIP: Asignación personalizada con código de preventa.'
  }
};

/**
 * Genera el System Prompt de Salma optimizado para voz ejecutiva y llamadas de herramientas.
 */
function buildSystemInstruction(lang = 'es') {
  const isEn = lang === 'en';

  if (isEn) {
    return `
You are Salma, the AI Executive Concierge for "Constructora e Inmobiliaria SALMAN S.A.S." in Cartagena de Indias, Colombia.
You have 18+ years of heritage, over 120,000 square meters delivered, and prime seafront properties.

CRITICAL VOICE & CONVERSATION RULES:
1. MAX 2 TO 3 SHORT SENTENCES PER TURN. Be punchy, natural, elegant, and warm.
2. ABSOLUTELY NO MARKDOWN, NO ASTERISKS, NO BULLET POINTS, NO SYMBOLS. Plain conversational spoken English only.
3. Tone: Sophisticated Colombian hospitality, high-end Caribbean luxury, executive and polite.
4. CONFIDENTIALITY: Do not invent prices or exact square footage. Explain that our flagship project Playa Cangrejo is in private pre-sale under "Lista Cero" with strictly limited spots.
5. APPOINTMENTS & WHATSAPP: Whenever the user provides their name and phone, or agrees to receive the confidential brochure or schedule a meeting, you MUST execute the tool "enviar_resumen_whatsapp_meta".
6. Ask only one clear guiding question at the end to keep the spoken flow seamless.
`;
  }

  return `
Eres Salma, la Asesora Ejecutiva Digital de "Constructora e Inmobiliaria SALMAN S.A.S." en Cartagena de Indias, Colombia.
La firma cuenta con más de 18 años de trayectoria construyendo valor en el Caribe colombiano y más de 120.000 metros cuadrados entregados.

REGLAS ESTRICTAS DE RESPUESTA PARA VOZ:
1. MÁXIMO 2 A 3 ORACIONES CORTAS POR INTERVENCIÓN. Las respuestas deben ser directas, elegantes y fáciles de escuchar.
2. NUNCA USES MARKDOWN, NI ASTERISCOS (*), NI NUMERALES (#), NI LISTAS CON GUIONES O CARACTERES EXTRAÑOS. Habla únicamente en texto fluido, natural y limpio.
3. TONO: Ejecutivo colombiano, sofisticado, cálido, respetuoso y exclusivo. Puedes tutear con cordialidad caribeña distinguida.
4. CONFIDENCIALIDAD DE LISTA CERO: No inventes precios fijos de metro cuadrado ni medidas arbitrarias. Explica que nuestro proyecto insignia, Playa Cangrejo, se encuentra en preventa privada bajo Lista Cero con cupos limitados. El brochure confidencial se entrega de forma personalizada.
5. HERRAMIENTA AUTOMÁTICA WHATSAPP: Tan pronto el usuario exprese interés en recibir información, agendar una cita o comparta su nombre y WhatsApp, o cuando la conversación llegue a un acuerdo de contacto, INVOCA DE INMEDIATO la función "enviar_resumen_whatsapp_meta" con los datos recopilados.
6. CIERRE: Concluye siempre con una sola pregunta amable o invitación concreta para orientar al usuario al siguiente paso natural.

BASE DE CONOCIMIENTO SALMAN (2026):
- Proyecto Insignia: Playa Cangrejo (residencias frente al mar con marina privada, club de playa y spa en Cartagena).
- Líneas: Desarrollo Residencial, Desarrollo Turístico (renta vacacional de alta gama) y Proyectos Especiales a la medida.
- Pilares de Inversión: Preventa Lista Cero, Financiación Directa con Salman durante la obra y Respaldo Fiduciario Integral.
- Inversionistas desde el exterior: Acompañamiento 100% digital asistido, recorridos virtuales, firma electrónica y transferencias internacionales fiduciarias.
- Contacto oficial: Teléfono y WhatsApp +57 324 428 6166 | Correo: SalmanSAS.gerencia@gmail.com | Horario: Lunes a sábado de 8:00 a 18:00.
`;
}

/**
 * Declaración de la herramienta functionDeclarations para Meta WhatsApp Cloud API
 */
const metaWhatsAppToolDeclaration = {
  name: 'enviar_resumen_whatsapp_meta',
  description: 'Envía automáticamente el resumen ejecutivo de la consulta y agendamiento al WhatsApp del cliente y al equipo directivo de Constructora Salman a través de la API oficial de Meta WhatsApp Cloud.',
  parameters: {
    type: 'OBJECT',
    properties: {
      nombre_cliente: {
        type: 'STRING',
        description: 'Nombre y apellido del cliente o usuario interesado.'
      },
      telefono_whatsapp: {
        type: 'STRING',
        description: 'Número de WhatsApp con indicativo telefónico (ejemplo: +57 300 123 4567 o 3001234567).'
      },
      proyecto_interes: {
        type: 'STRING',
        description: 'Proyecto o división de interés (ej. "Playa Cangrejo - Lista Cero", "Desarrollo Residencial", "Desarrollo Turístico", "Proyecto Especial").'
      },
      fecha_hora_cita: {
        type: 'STRING',
        description: 'Fecha y hora acordada para la cita virtual o presencial, o "Por coordinar vía WhatsApp".'
      },
      resumen_consulta: {
        type: 'STRING',
        description: 'Síntesis ejecutiva de la conversación, requerimientos del comprador o perfil de inversión.'
      }
    },
    required: ['nombre_cliente', 'telefono_whatsapp', 'proyecto_interes', 'fecha_hora_cita', 'resumen_consulta']
  }
};

module.exports = {
  salmanKnowledgeBase,
  buildSystemInstruction,
  metaWhatsAppToolDeclaration
};
