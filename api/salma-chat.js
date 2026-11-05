/**
 * api/salma-chat.js
 * 
 * Endpoint Serverless en Vercel para Salma (Gemini 2.5 Flash + Knowledge Base + Meta WhatsApp Tool).
 * Acepta: POST { messages: [...], lang: 'es'|'en', channel: 'web'|'voice' }
 * Retorna: { reply, model, toolCall, whatsApp }
 */

const { generateReply } = require('../lib/salman');

const hits = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_HITS = 40;

function rateLimited(ip) {
  const now = Date.now();
  const bucket = hits.get(ip) || [];
  const recent = bucket.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, value] of hits) {
      if (!value.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_HITS;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited', message: 'Demasiadas solicitudes. Espera un momento.' });
  }

  const body = req.body || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length) {
    return res.status(400).json({ error: 'messages_required' });
  }

  const lang = body.lang === 'en' ? 'en' : 'es';
  const channel = body.channel || 'voice';

  try {
    const result = await generateReply({ messages, lang, channel });
    return res.status(200).json(result);
  } catch (error) {
    console.error('[api/salma-chat]', error.code || error.message, error.detail || '');
    const isMissingKey = error.code === 'missing_api_key' || error.message === 'missing_api_key';
    return res.status(isMissingKey ? 503 : 502).json({
      error: isMissingKey ? 'missing_api_key' : 'ai_unavailable',
      message: error.message,
      detail: error.detail || null
    });
  }
};
