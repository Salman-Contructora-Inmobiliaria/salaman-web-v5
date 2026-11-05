/**
 * scripts/test-local.js
 * 
 * Verificación integral de Salman v5:
 * 1. Base de conocimiento (salmanKnowledgeBase).
 * 2. Meta WhatsApp Cloud API unificada (api/whatsapp) con soporte de número de diseñadora/demo.
 * 3. Endpoints serverless de Gemini Flash (api/salma-chat, api/salma-voice, api/chat).
 * 4. Sintaxis de todos los módulos frontend.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('--- INICIANDO VERIFICACIÓN DE ARQUITECTURA SALMAN V5 ---');

// 1. Base de Conocimiento
console.log('[Test 1] Verificando Base de Conocimiento oficial grounded...');
const { salmanKnowledgeBase, buildSystemInstruction, metaWhatsAppToolDeclaration } = require('../lib/knowledgeBase');
assert.ok(salmanKnowledgeBase.corporativo.nombre.includes('SALMAN'));
assert.strictEqual(salmanKnowledgeBase.proyectoInsignia.nombre, 'Playa Cangrejo (Cangrejo Azul)');
const promptEs = buildSystemInstruction('es');
assert.ok(promptEs.includes('Playa Cangrejo'));
assert.ok(promptEs.includes('enviar_resumen_whatsapp_meta'));
console.log('✅ Base de Conocimiento y directivas de voz validadas.');

// 2. WhatsApp Cloud API Unificada (Destinatario dinámico y demo diseñadora)
console.log('[Test 2] Verificando WhatsApp Cloud API Unificada (api/whatsapp)...');
const { sendWhatsAppSummary } = require('../api/whatsapp');

(async () => {
  try {
    // A. Envío estándar a cliente
    const waResult = await sendWhatsAppSummary({
      nombre_cliente: 'Arq. Giselle Diseñadora',
      telefono_whatsapp: '+57 324 428 6166',
      proyecto_interes: 'Playa Cangrejo (Lista Cero)',
      fecha_hora_cita: 'Jueves 4:00 PM',
      resumen_consulta: 'Revisión final de propuesta de alta fidelidad e integración de voz.'
    });
    assert.strictEqual(waResult.success, true);
    assert.strictEqual(waResult.simulated, true);
    assert.strictEqual(waResult.recipient, '573244286166');

    // B. Envío con destinatario de diseñadora configurado (META_NOTIFICATION_RECIPIENT)
    process.env.META_NOTIFICATION_RECIPIENT = '573009998877';
    const waRedirect = await sendWhatsAppSummary({
      nombre_cliente: 'Comprador Inversionista',
      telefono_whatsapp: '+57 311 000 1122',
      proyecto_interes: 'Desarrollo Residencial',
      fecha_hora_cita: 'Viernes 11:00 AM',
      resumen_consulta: 'Cliente interesado en preventa.'
    });
    assert.strictEqual(waRedirect.recipient, '573009998877');
    assert.strictEqual(waRedirect.isRedirected, true);
    delete process.env.META_NOTIFICATION_RECIPIENT;

    console.log('✅ WhatsApp Cloud API Unificada con redirección a diseñadora/demo validada.');

    // 3. Handlers Serverless
    console.log('[Test 3] Verificando Handlers Serverless...');
    const salmaVoice = require('../api/salma-voice');
    const salmaChat = require('../api/salma-chat');
    const chat = require('../api/chat');
    const waHandler = require('../api/whatsapp');
    assert.strictEqual(typeof salmaVoice, 'function');
    assert.strictEqual(typeof salmaChat, 'function');
    assert.strictEqual(typeof chat, 'function');
    assert.strictEqual(typeof waHandler, 'function');
    console.log('✅ Todos los endpoints serverless (/api) validados.');

    // 4. Sintaxis Frontend
    console.log('[Test 4] Verificando módulos JavaScript frontend...');
    const jsFiles = [
      'assets/js/core/config.js',
      'assets/js/core/dom.js',
      'assets/js/core/events.js',
      'assets/js/core/storage.js',
      'assets/js/data/projects.js',
      'assets/js/data/concierge.js',
      'assets/js/data/kb.js',
      'assets/js/i18n/es.js',
      'assets/js/i18n/en.js',
      'assets/js/i18n/index.js',
      'assets/js/ui/navigation.js',
      'assets/js/ui/forms.js',
      'assets/js/ui/calculator.js',
      'assets/js/ui/reveal.js',
      'assets/js/main.js',
      'assets/js/chat/voice.js',
      'assets/js/chat/concierge.js',
      'assets/js/chat/chat.js'
    ];
    for (const file of jsFiles) {
      const fullPath = path.join(__dirname, '..', file);
      const code = fs.readFileSync(fullPath, 'utf8');
      new Function(code);
    }
    console.log(`✅ ${jsFiles.length} módulos frontend compilados con sintaxis 100% válida.`);

    console.log('\n🎉 VERIFICACIÓN COMPLETA DE SALMAN V5 EXITOSA (0 ERRORES).');
  } catch (err) {
    console.error('❌ Error en test:', err);
    process.exit(1);
  }
})();
