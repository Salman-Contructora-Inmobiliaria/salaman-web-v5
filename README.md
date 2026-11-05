# SALMAN Constructora + Inmobiliaria — Web v3

Sitio web comercial bilingüe (ES/EN) para **SALMAN Constructora + Inmobiliaria S.A.S.** (Cartagena de Indias, Colombia). Incluye landing de proyectos residenciales y turísticos, calculadora financiera, captura de leads, asesora digital **Salma** con IA (texto + voz con Web Speech API), pestaña **Concierge** con 5 rutas de derivación a WhatsApp y funciones serverless para Gemini (`/api/chat`) y WhatsApp Cloud API (`/api/whatsapp`).

## Cómo ejecutar en local

1. **Modo demo con API local (Node 20+):**
   ```powershell
   node scripts/dev-server.js
   ```
   Abre `http://localhost:8080/` y `http://localhost:8080/voz.html`. Sin `GEMINI_API_KEY`, Salma usa la base local y la voz sigue funcionando.

2. **Modo completo con funciones Serverless (Vercel CLI):**
   Copia `.env.example` a `.env.local`, agrega tu `GEMINI_API_KEY` y ejecuta:
   ```powershell
   npx vercel dev
   ```

3. **Voice Lab:** abre `http://localhost:8080/voz.html` para probar micrófono, STT, TTS, API y fallback.

## Cómo desplegar en Vercel

1. Importa el repositorio en Vercel (Framework Preset: **Other**, sin comando de build).
2. Configura en **Settings → Environment Variables**:
   - `GEMINI_API_KEY` y `GEMINI_MODEL=gemini-2.5-flash`.
   - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN` y `WHATSAPP_API_VERSION=v21.0` (para el webhook de Meta).
3. Despliega y verifica `/`, `/api/chat` y `/api/whatsapp`.

## Voice Lab

- `voz.html` prueba micrófono, reconocimiento de voz, síntesis, `/api/health` y `/api/chat`.
- `api/health.js` informa si Gemini está configurado sin exponer la clave.
- `scripts/dev-server.js` sirve el sitio y la API en local.

## Documentación del proyecto

- **[DOCUMENTACION.md](DOCUMENTACION.md):** Documentación técnica y funcional completa (arquitectura, flujos de Salma/Concierge/VIP, contratos de API, modelo de datos, seguridad, accesibilidad y rollback).
- **[docs/AUDITORIA-CODIGO.md](docs/AUDITORIA-CODIGO.md):** Auditoría de código antes y después del refactor, métricas, hallazgos y riesgos residuales.
- **[docs/BASELINE.md](docs/BASELINE.md):** Evidencia de la línea base (Fase 0).

## Advertencias importantes

> **1. Indexación desactivada (`noindex`):** `vercel.json` incluye la cabecera `X-Robots-Tag: noindex, nofollow` para proteger el dominio de demostración. No retirarla sin autorización expresa del cliente antes de salir a producción en el dominio definitivo.
>
> **2. Precios y fichas ilustrativas:** Los nombres de proyectos, precios, áreas y disponibilidades en la capa de datos del cliente son contenido ilustrativo del prototipo y no deben tratarse como fuente de verdad contractual. El backend (`lib/salman.js`) tiene prohibido citar precios, disponibilidad o validar códigos VIP.
