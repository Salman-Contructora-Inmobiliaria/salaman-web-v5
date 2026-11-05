/**
 * lib/salman.js
 * 
 * Cerebro de Salma AI — Arquitectura In-House para Constructora e Inmobiliaria Salman S.A.S.
 * Conexión nativa con Gemini Flash (@google/genai & REST API) + WhatsApp Cloud API de Meta.
 */

const { GoogleGenAI } = require('@google/genai');
const { buildSystemInstruction, metaWhatsAppToolDeclaration } = require('./knowledgeBase');
const { sendWhatsAppSummary } = require('../api/whatsapp');

const PRIMARY_MODEL = 'gemini-2.5-flash';

/**
 * Normaliza y limpia el historial de mensajes para cumplir con el contrato de Gemini.
 */
function normalizeMessages(messages) {
  const clean = (Array.isArray(messages) ? messages : [])
    .filter((m) => m && typeof m.content === 'string' && m.content.trim())
    .slice(-12)
    .map((m) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      text: m.content.trim().slice(0, 1200)
    }));

  // Asegura alternancia estricta user/model requerida por Gemini
  const merged = [];
  for (const msg of clean) {
    const last = merged[merged.length - 1];
    if (last && last.role === msg.role) {
      last.text += `\n${msg.text}`;
    } else {
      merged.push({ ...msg });
    }
  }

  // La conversación debe iniciar con el usuario
  while (merged.length && merged[0].role === 'model') {
    merged.shift();
  }

  return merged;
}

/**
 * Limpieza de texto para síntesis de voz (elimina markdown, asteriscos, numerales y emojis perturbadores).
 */
function cleanVoiceText(text) {
  if (!text) return '';
  return String(text)
    .replace(/[*#_~`>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Genera la respuesta ejecutiva de Salma usando Gemini Flash con soporte de Function Calling.
 */
async function generateReply({ messages, lang = 'es', channel = 'web' }) {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
  if (!apiKey) {
    const error = new Error('missing_api_key');
    error.code = 'missing_api_key';
    throw error;
  }

  const systemPrompt = buildSystemInstruction(lang);
  const normalized = normalizeMessages(messages);
  if (!normalized.length) {
    throw new Error('empty_conversation');
  }

  let finalReply = '';
  let toolExecuted = null;
  let whatsAppResult = null;
  const modelToUse = process.env.GEMINI_MODEL || PRIMARY_MODEL;

  // 1. INTENTO PRIMARIO: SDK OFICIAL @google/genai
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Mapear contenido al formato SDK
    const contents = normalized.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: modelToUse,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.45,
        maxOutputTokens: 350,
        tools: [
          {
            functionDeclarations: [metaWhatsAppToolDeclaration]
          }
        ]
      }
    });

    const candidate = response.candidates?.[0];
    const functionCalls = response.functionCalls || candidate?.content?.parts?.filter((p) => p.functionCall).map((p) => p.functionCall);

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'enviar_resumen_whatsapp_meta') {
        const args = call.args || {};
        toolExecuted = { name: call.name, args };
        console.log('[Salma Brain] Ejecutando herramienta Meta WhatsApp:', args);

        whatsAppResult = await sendWhatsAppSummary({
          nombre_cliente: args.nombre_cliente,
          telefono_whatsapp: args.telefono_whatsapp,
          proyecto_interes: args.proyecto_interes,
          fecha_hora_cita: args.fecha_hora_cita,
          resumen_consulta: args.resumen_consulta
        });

        // Enviar respuesta de función de vuelta a Gemini para confirmación verbal fluida
        const followUpContents = [
          ...contents,
          {
            role: 'model',
            parts: [{ functionCall: call }]
          },
          {
            role: 'user',
            parts: [
              {
                functionResponse: {
                  name: call.name,
                  response: {
                    status: 'success',
                    message: 'Resumen enviado exitosamente a WhatsApp Meta y registrado con la gerencia.',
                    whatsAppStatus: whatsAppResult
                  }
                }
              }
            ]
          }
        ];

        const followUp = await ai.models.generateContent({
          model: modelToUse,
          contents: followUpContents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.35,
            maxOutputTokens: 150
          }
        });

        finalReply = cleanVoiceText(followUp.text || '');
        if (!finalReply) {
          finalReply = lang === 'en'
            ? 'I have forwarded your details to our WhatsApp direct line. Our sales director will contact you promptly. Can I assist you with anything else?'
            : 'He enviado el resumen de nuestra consulta a tu WhatsApp y a la gerencia de Salman. Un director comercial te contactará en breve. ¿Deseas consultar algo más?';
        }
      }
    } else {
      finalReply = cleanVoiceText(response.text || '');
    }

    if (finalReply) {
      return {
        reply: finalReply,
        model: modelToUse,
        toolCall: toolExecuted,
        whatsApp: whatsAppResult
      };
    }
  } catch (sdkError) {
    console.warn('[Salma Brain] Fallo al invocar @google/genai SDK, intentando fallback REST nativo:', sdkError.message);
  }

  // 2. FALLBACK ULTRA-RESILIENTE: REST API v1beta
  const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelToUse)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const restContents = normalized.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const restResponse = await fetch(restUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: restContents,
      tools: [
        {
          functionDeclarations: [metaWhatsAppToolDeclaration]
        }
      ],
      generationConfig: {
        temperature: 0.45,
        maxOutputTokens: 350
      }
    })
  });

  if (!restResponse.ok) {
    const errorText = await restResponse.text();
    const err = new Error(`gemini_rest_${restResponse.status}`);
    err.code = 'gemini_error';
    err.detail = errorText.slice(0, 500);
    throw err;
  }

  const restData = await restResponse.json();
  const candidate = restData.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  const functionCallPart = parts.find((p) => p.functionCall);
  if (functionCallPart && functionCallPart.functionCall.name === 'enviar_resumen_whatsapp_meta') {
    const args = functionCallPart.functionCall.args || {};
    toolExecuted = { name: functionCallPart.functionCall.name, args };
    console.log('[Salma Brain REST] Invocando WhatsApp Meta:', args);

    whatsAppResult = await sendWhatsAppSummary({
      nombre_cliente: args.nombre_cliente,
      telefono_whatsapp: args.telefono_whatsapp,
      proyecto_interes: args.proyecto_interes,
      fecha_hora_cita: args.fecha_hora_cita,
      resumen_consulta: args.resumen_consulta
    });

    finalReply = lang === 'en'
      ? 'I have successfully sent a summary of our meeting to your WhatsApp. Our management team will reach out shortly. Is there anything else you would like to know?'
      : 'He enviado el resumen de nuestra conversación a tu WhatsApp y al equipo directivo de Salman. Te contactaremos en breve para confirmar los detalles. ¿Deseas consultar algo más?';
  } else {
    finalReply = cleanVoiceText(parts.map((p) => p.text || '').join(' '));
  }

  return {
    reply: finalReply || (lang === 'en' ? 'Welcome to Salman. How may I advise you today?' : 'Bienvenido a Salman. ¿En qué te puedo asesorar hoy?'),
    model: modelToUse,
    toolCall: toolExecuted,
    whatsApp: whatsAppResult
  };
}

module.exports = {
  generateReply,
  cleanVoiceText
};
