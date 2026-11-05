/**
 * GET /api/health
 * Diagnóstico del servicio y estado de Gemini AI.
 */
const { generateReply } = require('../lib/salman');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  const rawModel = (process.env.GEMINI_MODEL || 'gemini-3.8-flash').trim();
  const model = /gemini-(1\.5|2\.0|2\.5)/i.test(rawModel) || !rawModel ? 'gemini-3.8-flash' : rawModel;
  const isConfigured = Boolean(apiKey);

  const data = {
    ok: true,
    service: 'salman-chat',
    geminiConfigured: isConfigured,
    model,
    voice: 'browser-webspeech',
    timestamp: new Date().toISOString()
  };

  if (req.query && req.query.test === '1' && isConfigured) {
    try {
      const test = await generateReply({
        messages: [{ role: 'user', content: 'Di Salma lista' }],
        lang: 'es',
        channel: 'web'
      });
      data.geminiWorking = true;
      data.reply = test.reply;
      data.modelUsed = test.model;
    } catch (err) {
      data.geminiWorking = false;
      data.error = err.detail || err.message;
    }
  }

  res.status(200).json(data);
};
