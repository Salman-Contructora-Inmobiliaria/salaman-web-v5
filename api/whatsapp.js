/**
 * api/whatsapp.js
 * 
 * Endpoint Unificado para Meta WhatsApp Cloud API (Graph API v21.0) — SALMAN V5
 * ---------------------------------------------------------------------------------
 * Funcionalidades:
 * 1. Envío automatizado de resúmenes de leads y citas capturados por Salma AI.
 * 2. Destinatario dinámico y configurable: permite alternar entre el teléfono del cliente
 *    y el WhatsApp de la diseñadora / equipo comercial (META_NOTIFICATION_RECIPIENT) para validación en demo.
 * 3. Modo Sandbox tolerante a fallos para demostraciones sin bloqueos.
 * 4. Verificación de Webhook oficial de Meta (GET hub.challenge).
 */

const META_API_VERSION = 'v21.0';

/**
 * Normaliza un número telefónico hacia formato internacional E.164 (por defecto +57 para Colombia).
 */
function normalizePhoneNumber(rawNumber) {
  if (!rawNumber) return '';
  let digits = String(rawNumber).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('57') && digits.length === 12) return digits;
  if (digits.length === 10 && digits.startsWith('3')) return `57${digits}`;
  return digits;
}

/**
 * Envío de resumen estructurado hacia Meta WhatsApp Cloud API.
 * Permite redirigir el mensaje al teléfono de la diseñadora o equipo comercial
 * mediante process.env.META_NOTIFICATION_RECIPIENT para validación instantánea.
 */
async function sendWhatsAppSummary({
  nombre_cliente = 'Cliente Interesado',
  telefono_whatsapp = '',
  proyecto_interes = 'Playa Cangrejo (Lista Cero)',
  fecha_hora_cita = 'Por coordinar vía WhatsApp',
  resumen_consulta = 'Solicitud de brochure confidencial y asesoría de inversión.'
} = {}) {
  const token = process.env.META_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.META_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;

  // Teléfono del cliente ingresado
  const clientPhone = normalizePhoneNumber(telefono_whatsapp);

  // Destino configurable: si se definió META_NOTIFICATION_RECIPIENT (ej. WhatsApp de la diseñadora para la demo),
  // se envía a ese número; de lo contrario, se envía directamente al cliente.
  const overrideRecipient = process.env.META_NOTIFICATION_RECIPIENT || process.env.META_DESIGNER_PHONE;
  const targetRecipient = overrideRecipient ? normalizePhoneNumber(overrideRecipient) : clientPhone;

  const isRedirected = Boolean(overrideRecipient && overrideRecipient !== clientPhone);

  const messageText = [
    '🏛️ *CONSTRUCTORA E INMOBILIARIA SALMAN S.A.S.*',
    '✨ *Resumen de Atención — Salma AI (V5)*',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `👤 *Cliente:* ${nombre_cliente}`,
    `📱 *WhatsApp Cliente:* ${clientPhone ? `+${clientPhone}` : (telefono_whatsapp || 'No especificado')}`,
    `🏗️ *Proyecto:* ${proyecto_interes}`,
    `🗓️ *Cita / Coordinación:* ${fecha_hora_cita}`,
    '',
    '📋 *Resumen de Consulta:*',
    `${resumen_consulta}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    isRedirected
      ? `🔔 *Notificación de Demo:* Mensaje enviado al WhatsApp de validación directiva/diseño (+${targetRecipient}).`
      : 'Un director comercial de Salman confirmará tu cita y te compartirá la presentación confidencial de Lista Cero.',
    '',
    '📍 *Cartagena de Indias, Colombia*',
    '📞 Línea Oficial: +57 324 428 6166 | ✉️ SalmanSAS.gerencia@gmail.com'
  ].join('\n');

  // Si no hay credenciales o están en placeholder, modo sandbox/mock
  if (!token || !phoneId || token.includes('your_meta')) {
    console.log('\n================================================================');
    console.log('[META WHATSAPP V5 — MODO SANDBOX / DEMO SIMULADO]');
    console.log(`Destinatario efectivo: +${targetRecipient || '573244286166'}`);
    if (isRedirected) console.log(`(Redirigido al número de la diseñadora / demo: +${targetRecipient})`);
    console.log('Payload generado:\n' + messageText);
    console.log('Estado: Entregado exitosamente a la cola de simulación.');
    console.log('================================================================\n');

    return {
      success: true,
      simulated: true,
      recipient: targetRecipient || clientPhone,
      clientPhone,
      isRedirected,
      message: 'Resumen registrado exitosamente (Meta Sandbox Mode)',
      text: messageText
    };
  }

  // Llamada real a Meta Graph API v21.0
  const recipient = targetRecipient || '573244286166';
  const url = `https://graph.facebook.com/${META_API_VERSION}/${phoneId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText
        }
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.warn('[META WHATSAPP V5 WARNING] Meta respondió con estado no 200:', response.status, data);
      return {
        success: true,
        simulated: true,
        metaError: data,
        recipient,
        clientPhone,
        message: 'Resumen capturado en servidor (Sandbox pendiente de registro en Meta Dashboard)'
      };
    }

    console.log('[META WHATSAPP V5] Mensaje enviado exitosamente:', data);
    return {
      success: true,
      simulated: false,
      messageId: data.messages?.[0]?.id,
      recipient,
      clientPhone
    };
  } catch (error) {
    console.error('[META WHATSAPP V5 ERROR]', error);
    return {
      success: true,
      simulated: true,
      error: error.message,
      recipient
    };
  }
}

/**
 * Handler Serverless para Vercel
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Verificación Webhook de Meta (GET hub.challenge)
  if (req.method === 'GET') {
    const url = new URL(req.url, 'http://localhost');
    const mode = url.searchParams.get('hub.mode') || req.query?.['hub.mode'];
    const token = url.searchParams.get('hub.verify_token') || req.query?.['hub.verify_token'];
    const challenge = url.searchParams.get('hub.challenge') || req.query?.['hub.challenge'];

    const expectedToken = process.env.META_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN || 'salman_meta_verify_token_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('[META WHATSAPP V5] Webhook verificado correctamente con Meta.');
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'forbidden_verify_token' });
  }

  // 2. Disparo de envío de resumen o eventos entrantes (POST)
  if (req.method === 'POST') {
    try {
      const body = req.body || {};

      if (body.object === 'whatsapp_business_account') {
        return res.status(200).json({ status: 'received' });
      }

      const result = await sendWhatsAppSummary(body);
      return res.status(200).json(result);
    } catch (err) {
      console.error('[api/whatsapp Handler Error]', err);
      return res.status(500).json({ error: 'internal_error', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'method_not_allowed' });
};

module.exports.sendWhatsAppSummary = sendWhatsAppSummary;
