/* ==========================================================================
   SALMAN — Módulo de Voz Cross-Browser de Salma (chat/voice.js)
   Arquitectura In-House: Web Speech API + AudioContext Unlock + Gemini Flash
   Compatible con Chrome, Edge, Safari iOS/macOS y navegadores móviles.
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // AudioContext global para desbloqueo de Autoplay en Safari iOS/macOS
  let sharedAudioContext = null;
  let isAudioUnlocked = false;

  const LANG_FALLBACK = {
    es: { speech: 'es-CO', tts: 'es-CO' },
    en: { speech: 'en-US', tts: 'en-US' }
  };

  const getLangMeta = (lang) =>
    (S.LANG_META && S.LANG_META[lang]) ||
    (window.LANG_META && window.LANG_META[lang]) ||
    LANG_FALLBACK[lang] ||
    LANG_FALLBACK.es;

  /* --------------------------------------------------------------------------
     1. Desbloqueo Crítico de AudioContext & Autoplay (Gesto de Usuario síncrono)
     -------------------------------------------------------------------------- */
  function unlockBrowserAudio() {
    if (isAudioUnlocked) return;

    try {
      // 1. Desbloqueo de AudioContext (Web Audio API)
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        if (!sharedAudioContext) {
          sharedAudioContext = new AudioCtxClass();
        }
        if (sharedAudioContext.state === 'suspended') {
          sharedAudioContext.resume().catch(() => {});
        }
        // Reproducir micro-buffer mudo de 1 sample (esencial para Safari iOS)
        const buffer = sharedAudioContext.createBuffer(1, 1, 22050);
        const source = sharedAudioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(sharedAudioContext.destination);
        source.start(0);
      }

      // 2. Desbloqueo de SpeechSynthesis
      if (synth) {
        synth.cancel();
        if (synth.paused) synth.resume();
        // Emisión de micro-utterance silencioso para ganar el permiso permanente de voz en Chromium/WebKit
        const dummyUtterance = new SpeechSynthesisUtterance('');
        dummyUtterance.volume = 0;
        synth.speak(dummyUtterance);
      }

      isAudioUnlocked = true;
      console.log('[Salma Voice] AudioContext & SpeechSynthesis desbloqueados exitosamente.');
    } catch (e) {
      console.warn('[Salma Voice] Advertencia en unlockBrowserAudio:', e);
    }
  }

  // Vincular eventos tempranos del usuario para garantizar desbloqueo en primera interacción
  if (typeof window !== 'undefined') {
    const earlyUnlockEvents = ['click', 'touchstart', 'touchend'];
    const earlyUnlockHandler = () => {
      unlockBrowserAudio();
      earlyUnlockEvents.forEach((evt) => window.removeEventListener(evt, earlyUnlockHandler));
    };
    earlyUnlockEvents.forEach((evt) => window.addEventListener(evt, earlyUnlockHandler, { passive: true }));
  }

  /* --------------------------------------------------------------------------
     2. Precarga y Selección Inteligente de Voces Naturales
     -------------------------------------------------------------------------- */
  let cachedVoices = [];
  let activeUtterance = null;
  let keepAliveTimer = null;

  function refreshVoices() {
    if (!synth) return [];
    try {
      const list = synth.getVoices() || [];
      if (list.length > 0) cachedVoices = list;
    } catch (_) {}
    return cachedVoices;
  }

  refreshVoices();
  if (synth) {
    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', refreshVoices);
    }
    synth.onvoiceschanged = refreshVoices;
  }

  function selectBestVoice(targetLang = 'es') {
    let voices = refreshVoices();
    if (!voices.length && synth) {
      try { voices = synth.getVoices() || []; } catch (_) {}
    }
    if (!voices.length) return null;

    const isEs = targetLang.toLowerCase().startsWith('es');
    const langPrefix = isEs ? 'es' : 'en';
    const pool = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(langPrefix));
    const effectivePool = pool.length > 0 ? pool : voices;

    const femaleRegex = /salma|dalia|paulina|monica|mónica|camila|sofía|sofia|sabina|helena|elena|paloma|laura|elvira|jimena|karina|lucia|lucía|carmen|valeria|female|mujer/i;
    const maleRegex = /gonzalo|jorge|alvaro|álvaro|carlos|diego|alberto|mateo|manuel|enrique|luis|raul|raúl|fernando|miguel|javier|david|mark|george|alonso|pablo|arnau|ignacio|esteban|tomas|tomás|mario|dario|darío|guillermo|nestor|néstor|gerardo|andres|andrés|emilio|rodrigo|helio|julio|pedro|hector|héctor|male\b|hombre/i;

    const strictlyFemale = effectivePool.filter((v) => femaleRegex.test(v.name) && !maleRegex.test(v.name));
    const nonMalePool = effectivePool.filter((v) => !maleRegex.test(v.name));
    const candidates = strictlyFemale.length > 0 ? strictlyFemale : (nonMalePool.length > 0 ? nonMalePool : effectivePool);

    if (isEs) {
      // 1. Salma Online Natural (Microsoft Edge / Windows)
      const salmaVoice = candidates.find((v) => /salma/i.test(v.name));
      if (salmaVoice) return salmaVoice;

      // 2. Voces Colombianas / Latinoamericanas Naturales
      const latinNatural = candidates.find((v) =>
        /natural|neural|online/i.test(v.name) &&
        /colombia|dalia|paulina|monica|camila|sofia/i.test(v.name + (v.lang || ''))
      );
      if (latinNatural) return latinNatural;

      // 3. Voces de Google (Android / Chrome)
      const googleFemale = candidates.find((v) => /google/i.test(v.name) && !maleRegex.test(v.name));
      if (googleFemale) return googleFemale;

      // 4. Sabina o estándar femenino
      const standardFemale = candidates.find((v) => /sabina|paulina|monica|helena|elena/i.test(v.name));
      if (standardFemale) return standardFemale;

      return candidates[0] || pool[0] || voices[0] || null;
    }

    // Inglés
    const naturalEn = pool.find((v) => /natural|neural|online/i.test(v.name) && /jenny|aria|female|zira/i.test(v.name)) ||
                      pool.find((v) => /zira|female/i.test(v.name)) ||
                      pool[0] || voices[0];
    return naturalEn || null;
  }

  /* --------------------------------------------------------------------------
     3. Controlador Principal de Voz y Estados Visuales
     -------------------------------------------------------------------------- */
  function createVoiceController(ctx) {
    const { chat, el, t, track, addUser, addBot, route } = ctx;

    /**
     * Gestión estricta y elegante de los 4 estados visuales:
     * - 'inactive': en reposo
     * - 'listening': escuchando al usuario
     * - 'processing': Gemini Flash procesando respuesta
     * - 'speaking': Salma leyendo en voz alta
     */
    function setState(state, statusText = '') {
      chat.voiceState = state; // 'inactive' | 'listening' | 'processing' | 'speaking'
      chat.listening = state === 'listening';
      chat.speaking = state === 'speaking';
      chat.processing = state === 'processing';

      if (!el.voice) return;

      // Actualizar clases CSS del Orbe
      el.orb?.classList.toggle('is-listening', state === 'listening');
      el.orb?.classList.toggle('is-processing', state === 'processing');
      el.orb?.classList.toggle('is-speaking', state === 'speaking');

      // Actualizar texto de estado
      if (el.voiceStatus) {
        if (statusText) {
          el.voiceStatus.textContent = statusText;
        } else {
          switch (state) {
            case 'listening':
              el.voiceStatus.textContent = t('chat.listening') || 'Escuchando tu voz…';
              break;
            case 'processing':
              el.voiceStatus.textContent = chat.lang === 'es' ? 'Salma está pensando…' : 'Salma is thinking…';
              break;
            case 'speaking':
              el.voiceStatus.textContent = chat.lang === 'es' ? 'Salma está hablando… (toca para pausar)' : 'Salma is speaking… (tap to interrupt)';
              break;
            case 'inactive':
            default:
              el.voiceStatus.textContent = t('voice.tap') || 'Toca el micrófono y habla. Puedes interrumpirme cuando quieras.';
              break;
          }
        }
      }

      // Actualizar botón de acción principal de voz
      if (el.voiceListen) {
        const isStopAction = state === 'listening' || state === 'speaking';
        const buttonText = isStopAction
          ? (chat.lang === 'es' ? 'Detener' : 'Stop')
          : (state === 'processing'
              ? (chat.lang === 'es' ? 'Pensando…' : 'Thinking…')
              : (t('voice.speak') || 'Hablar con Salma'));

        const iconHref = isStopAction ? '#i-pause' : '#i-mic';
        el.voiceListen.innerHTML = `
          <svg class="icon" aria-hidden="true"><use href="${iconHref}"></use></svg>
          <span>${buttonText}</span>
        `;
        el.voiceListen.disabled = (state === 'processing');
      }
    }

    function updateVoiceUI() {
      if (!el.voice) return;
      el.voice.hidden = !chat.voiceOpen;
      if (!chat.voiceOpen) return;

      if (chat.speaking) setState('speaking');
      else if (chat.processing) setState('processing');
      else if (chat.listening) setState('listening');
      else setState('inactive');
    }

    /**
     * Síntesis de voz (TTS) con retención de Garbage Collection y Keep-Alive
     */
    function speak(text) {
      if (!synth || chat.muted) return;
      unlockBrowserAudio();

      const clean = String(text)
        .replace(/[•*#_~`>]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, 900);

      if (activeUtterance) {
        activeUtterance.onend = null;
        activeUtterance.onerror = null;
      }
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
      }

      try {
        synth.cancel();
      } catch (_) {}

      const utterance = new SpeechSynthesisUtterance(clean);
      activeUtterance = utterance;
      window._salmaActiveUtterance = utterance;

      const voice = selectBestVoice(chat.lang);
      if (voice) utterance.voice = voice;

      const meta = getLangMeta(chat.lang);
      utterance.lang = meta.tts || (chat.lang === 'es' ? 'es-CO' : 'en-US');
      utterance.rate = 0.98;
      utterance.pitch = 1.02;

      setState('speaking', clean.slice(0, 240) + (clean.length > 240 ? '…' : ''));

      // Keep-Alive para evitar que Chromium pause síntesis largas a los 14 segundos
      keepAliveTimer = setInterval(() => {
        if (!synth.speaking) {
          clearInterval(keepAliveTimer);
        } else {
          synth.pause();
          synth.resume();
        }
      }, 9000);

      utterance.onend = () => {
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        activeUtterance = null;
        window._salmaActiveUtterance = null;
        setState('inactive');
      };

      utterance.onerror = (e) => {
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        activeUtterance = null;
        window._salmaActiveUtterance = null;
        console.warn('[Salma Voice TTS Warning]:', e.error || e);
        setState('inactive');
      };

      setTimeout(() => {
        try {
          if (synth.paused) synth.resume();
          synth.speak(utterance);
        } catch (err) {
          console.warn('[Salma Voice Speak Error]', err);
          setState('inactive');
        }
      }, 50);
    }

    function stopSpeech() {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      if (activeUtterance) {
        activeUtterance.onend = null;
        activeUtterance.onerror = null;
        activeUtterance = null;
        window._salmaActiveUtterance = null;
      }
      if (synth) {
        try { synth.cancel(); } catch (_) {}
      }
      setState('inactive');
    }

    /**
     * Solicitud y verificación limpia de hardware de micrófono
     */
    async function requestHardwareMic() {
      unlockBrowserAudio();

      // 1. Permiso previo concedido en Permissions API
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const perm = await navigator.permissions.query({ name: 'microphone' });
          if (perm.state === 'granted') return true;
          if (perm.state === 'denied') return false;
        } catch (_) {}
      }

      // 2. getUserMedia con liberación adecuada
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
          await new Promise((r) => setTimeout(r, 120));
          return true;
        } catch (permErr) {
          console.warn('[Salma Voice] Permiso de micrófono no otorgado:', permErr);
          return false;
        }
      }
      return true;
    }

    /**
     * Inicia captura y reconocimiento de voz (STT)
     */
    async function startListening() {
      unlockBrowserAudio();

      if (!SR) {
        addBot(t('chat.voiceUnsupported') || 'Tu navegador no soporta entrada de voz. Puedes escribir tu mensaje.', {
          speak: false,
          chips: ['advisor', 'projects']
        });
        return;
      }

      if (chat.listening || !chat.voiceOpen) return;
      stopSpeech();

      chat.voiceFinal = '';
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';

      setState('listening', t('chat.listening') || 'Escuchando tu voz…');

      const micGranted = await requestHardwareMic();
      if (!micGranted) {
        setState('inactive', t('chat.micDenied') || 'Permiso de micrófono denegado. Habilítalo en tu navegador.');
        return;
      }

      try {
        const recognition = new SR();
        chat.recognition = recognition;
        const meta = getLangMeta(chat.lang);
        recognition.lang = meta.speech || (chat.lang === 'es' ? 'es-CO' : 'en-US');
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setState('listening');
        };

        recognition.onresult = (event) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const result = event.results[i];
            if (result.isFinal) {
              chat.voiceFinal += `${result[0].transcript} `;
            } else {
              interim += result[0].transcript;
            }
          }
          if (el.voiceTranscript) {
            el.voiceTranscript.textContent = (chat.voiceFinal + interim).trim();
          }
        };

        recognition.onerror = (event) => {
          const errCode = event.error || 'unknown';
          console.warn('[Salma Voice STT Error]:', errCode);

          if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
            setState('inactive', t('chat.micDenied') || 'Permiso de micrófono bloqueado.');
            track('chat_voice_error', { error: errCode });
          } else if (errCode === 'no-speech') {
            setState('inactive', chat.lang === 'es' ? 'No escuché tu voz. Toca para intentar de nuevo.' : 'I did not catch that. Tap to try again.');
          } else {
            setState('inactive', chat.lang === 'es' ? 'Conexión de voz interrumpida. Intenta nuevamente.' : 'Voice connection interrupted. Please try again.');
          }
        };

        recognition.onend = () => {
          if (!chat.voiceOpen) {
            setState('inactive');
            return;
          }

          const text = (chat.voiceFinal || '').trim();
          if (text) {
            addUser(text);
            setState('processing');

            // Envío al backend de Gemini Flash
            route(text, {
              speak: true,
              fast: true,
              onReply: (replyText) => {
                if (chat.voiceOpen) {
                  setState('speaking', replyText.slice(0, 240) + (replyText.length > 240 ? '…' : ''));
                  if (el.voiceTranscript) el.voiceTranscript.textContent = text;
                }
              },
              onError: () => {
                setState('inactive');
              }
            });
          } else {
            setState('inactive');
          }
        };

        recognition.start();
        track('chat_voice_start');
      } catch (err) {
        console.error('[Salma Voice Start Error]:', err);
        setState('inactive', t('chat.micDenied'));
      }
    }

    function stopListening() {
      if (chat.recognition) {
        try { chat.recognition.abort(); } catch (_) {}
      }
      setState('inactive');
    }

    function openVoice() {
      unlockBrowserAudio();
      refreshVoices();

      chat.voiceOpen = true;
      if (el.voice) el.voice.hidden = false;
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';

      const greeting = chat.lang === 'es'
        ? 'Hola, soy Salma. ¿En qué te puedo asesorar hoy?'
        : 'Hi, I am Salma. How can I help you today?';

      setState('speaking', greeting);
      speak(greeting);
    }

    function closeVoice() {
      chat.voiceOpen = false;
      stopListening();
      stopSpeech();
      if (el.voice) el.voice.hidden = true;
      setState('inactive');
      if (chat.open && el.text) el.text.focus();
    }

    return {
      speak,
      stopSpeech,
      updateVoiceUI,
      startListening,
      stopListening,
      openVoice,
      closeVoice,
      selectBestVoice,
      setState,
      unlockBrowserAudio
    };
  }

  S.createVoiceController = createVoiceController;
  S.selectBestVoice = selectBestVoice;
  S.unlockBrowserAudio = unlockBrowserAudio;
})();
