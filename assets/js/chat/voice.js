/* ==========================================================================
   SALMAN — Módulo de Voz en Modo Llamada Continua (chat/voice.js)
   Arquitectura In-House Hands-Free (Estilo Dapta / Vapi):
   - Al tocar el botón inicia una llamada en vivo.
   - Salma habla y, al terminar de hablar, abre automáticamente el micrófono.
   - La conversación continúa de forma fluida y natural sin tener que tocar la pantalla.
   ========================================================================== */
(() => {
  'use strict';

  const S = (window.SALMAN = window.SALMAN || {});
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

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
     1. Desbloqueo Crítico de AudioContext & Autoplay en el primer toque
     -------------------------------------------------------------------------- */
  function unlockBrowserAudio() {
    if (isAudioUnlocked) return;

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        if (!sharedAudioContext) {
          sharedAudioContext = new AudioCtxClass();
        }
        if (sharedAudioContext.state === 'suspended') {
          sharedAudioContext.resume().catch(() => {});
        }
        const buffer = sharedAudioContext.createBuffer(1, 1, 22050);
        const source = sharedAudioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(sharedAudioContext.destination);
        source.start(0);
      }

      if (synth) {
        synth.cancel();
        if (synth.paused) synth.resume();
        const dummyUtterance = new SpeechSynthesisUtterance(' ');
        dummyUtterance.volume = 0.01;
        synth.speak(dummyUtterance);
      }

      isAudioUnlocked = true;
      console.log('[Salma Call] AudioContext y síntesis desbloqueados para modo llamada.');
    } catch (e) {
      console.warn('[Salma Call] Error en unlockBrowserAudio:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const earlyUnlockEvents = ['click', 'touchstart', 'touchend'];
    const earlyUnlockHandler = () => {
      unlockBrowserAudio();
      earlyUnlockEvents.forEach((evt) => window.removeEventListener(evt, earlyUnlockHandler));
    };
    earlyUnlockEvents.forEach((evt) => window.addEventListener(evt, earlyUnlockHandler, { passive: true }));
  }

  /* --------------------------------------------------------------------------
     2. Selector de Voces Neurales / Naturales de Alta Calidad
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
      // 1. Prioridad: Microsoft Salma Online (Natural) - Colombia
      const salmaVoice = candidates.find((v) => /salma/i.test(v.name) && /colombia|es-co/i.test(v.name + (v.lang || '')));
      if (salmaVoice) return salmaVoice;

      const anySalma = candidates.find((v) => /salma/i.test(v.name));
      if (anySalma) return anySalma;

      // 2. Voces Colombianas / Latinoamericanas Naturales
      const latinNatural = candidates.find((v) =>
        /natural|neural|online/i.test(v.name) &&
        /colombia|dalia|paulina|monica|camila|sofia/i.test(v.name + (v.lang || ''))
      );
      if (latinNatural) return latinNatural;

      // 3. Voces Google (Android / Chrome)
      const googleFemale = candidates.find((v) => /google/i.test(v.name) && !maleRegex.test(v.name));
      if (googleFemale) return googleFemale;

      // 4. Sabina u otras estándar
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
     3. Controlador Principal de Llamada Continua (Hands-Free Call Loop)
     -------------------------------------------------------------------------- */
  function createVoiceController(ctx) {
    const { chat, el, t, track, addUser, addBot, route } = ctx;

    function setState(state, statusText = '') {
      chat.voiceState = state; // 'inactive' | 'listening' | 'processing' | 'speaking'
      chat.listening = state === 'listening';
      chat.speaking = state === 'speaking';
      chat.processing = state === 'processing';

      if (!el.voice) return;

      // Animaciones de orbe
      el.orb?.classList.toggle('is-listening', state === 'listening');
      el.orb?.classList.toggle('is-processing', state === 'processing');
      el.orb?.classList.toggle('is-speaking', state === 'speaking');

      // Texto de estado dinámico estilo llamada
      if (el.voiceStatus) {
        if (statusText) {
          el.voiceStatus.textContent = statusText;
        } else {
          switch (state) {
            case 'listening':
              el.voiceStatus.textContent = chat.lang === 'es' ? 'Te escucho… (habla con confianza)' : 'Listening to you…';
              break;
            case 'processing':
              el.voiceStatus.textContent = chat.lang === 'es' ? 'Salma está pensando…' : 'Salma is thinking…';
              break;
            case 'speaking':
              el.voiceStatus.textContent = chat.lang === 'es' ? 'Salma está hablando…' : 'Salma is speaking…';
              break;
            case 'inactive':
            default:
              el.voiceStatus.textContent = chat.lang === 'es' ? 'Llamada conectada · Salma te escucha' : 'Call connected · Salma is listening';
              break;
          }
        }
      }

      // Botón principal de llamada
      if (el.voiceListen) {
        if (chat.voiceOpen) {
          el.voiceListen.innerHTML = `
            <svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg>
            <span>${chat.lang === 'es' ? 'Finalizar llamada' : 'End call'}</span>
          `;
          el.voiceListen.disabled = false;
        } else {
          el.voiceListen.innerHTML = `
            <svg class="icon" aria-hidden="true"><use href="#i-mic"></use></svg>
            <span>${t('voice.speak') || 'Llamar a Salma'}</span>
          `;
        }
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
     * Síntesis de voz (TTS) con reapertura automática de micrófono al terminar
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
      if (voice) {
        utterance.voice = voice;
        console.log('[Salma Voice] Voz seleccionada:', voice.name, '| lang:', voice.lang);
      }

      const meta = getLangMeta(chat.lang);
      utterance.lang = meta.tts || (chat.lang === 'es' ? 'es-CO' : 'en-US');
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      setState('speaking', clean.slice(0, 240) + (clean.length > 240 ? '…' : ''));

      // Keep-Alive para Chromium
      keepAliveTimer = setInterval(() => {
        if (!synth.speaking) {
          clearInterval(keepAliveTimer);
        } else {
          synth.pause();
          synth.resume();
        }
      }, 9000);

      // EVENTO CRÍTICO: Cuando Salma termina de hablar, se abre automáticamente el micrófono (Hands-Free)
      utterance.onend = () => {
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        activeUtterance = null;
        window._salmaActiveUtterance = null;

        if (chat.voiceOpen) {
          console.log('[Salma Call Loop] Salma terminó de hablar. Abriendo micrófono automáticamente...');
          setTimeout(() => {
            if (chat.voiceOpen && !chat.speaking) {
              startListening();
            }
          }, 350);
        } else {
          setState('inactive');
        }
      };

      utterance.onerror = (e) => {
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        activeUtterance = null;
        window._salmaActiveUtterance = null;
        console.warn('[Salma Voice TTS Warning]:', e.error || e);
        if (chat.voiceOpen) {
          setTimeout(() => {
            if (chat.voiceOpen && !chat.speaking) startListening();
          }, 400);
        } else {
          setState('inactive');
        }
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
      chat.speaking = false;
    }

    async function requestHardwareMic() {
      unlockBrowserAudio();

      if (navigator.permissions && navigator.permissions.query) {
        try {
          const perm = await navigator.permissions.query({ name: 'microphone' });
          if (perm.state === 'granted') return true;
          if (perm.state === 'denied') return false;
        } catch (_) {}
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach((track) => track.stop());
          await new Promise((r) => setTimeout(r, 120));
          return true;
        } catch (permErr) {
          console.warn('[Salma Call] Permiso de micrófono no otorgado:', permErr);
          return false;
        }
      }
      return true;
    }

    /**
     * Inicia captura y escucha continua
     */
    async function startListening() {
      if (!chat.voiceOpen) return;
      unlockBrowserAudio();

      if (!SR) {
        addBot(t('chat.voiceUnsupported') || 'Navegador sin soporte de voz. Puedes escribir.', { speak: false });
        return;
      }

      if (chat.listening || chat.speaking) return;

      chat.voiceFinal = '';
      if (el.voiceTranscript) el.voiceTranscript.textContent = '';

      setState('listening', chat.lang === 'es' ? 'Te escucho… (habla libremente)' : 'Listening to you…');

      const micGranted = await requestHardwareMic();
      if (!micGranted) {
        setState('inactive', t('chat.micDenied') || 'Permiso de micrófono bloqueado.');
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
          console.warn('[Salma Call STT Event]:', errCode);

          if (errCode === 'not-allowed') {
            setState('inactive', t('chat.micDenied'));
          } else if (errCode === 'no-speech') {
            // Silencio temporal: en modo llamada, volver a escuchar suavemente
            if (chat.voiceOpen && !chat.speaking && !chat.processing) {
              setTimeout(() => {
                if (chat.voiceOpen && !chat.speaking && !chat.processing) {
                  startListening();
                }
              }, 400);
            }
          }
        };

        recognition.onend = () => {
          chat.listening = false;
          if (!chat.voiceOpen) {
            setState('inactive');
            return;
          }

          const text = (chat.voiceFinal || '').trim();
          if (text) {
            addUser(text);
            setState('processing');

            // Consultar a Gemini Flash
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
                if (chat.voiceOpen) startListening();
              }
            });
          } else {
            // Si no hubo texto detectado (pausa del usuario), reiniciar escucha continua en la llamada
            if (chat.voiceOpen && !chat.speaking && !chat.processing) {
              setTimeout(() => {
                if (chat.voiceOpen && !chat.speaking && !chat.processing && !chat.listening) {
                  startListening();
                }
              }, 400);
            }
          }
        };

        recognition.start();
        track('chat_voice_start');
      } catch (err) {
        console.error('[Salma Call Start Error]:', err);
        chat.listening = false;
      }
    }

    function stopListening() {
      if (chat.recognition) {
        try { chat.recognition.abort(); } catch (_) {}
      }
      chat.listening = false;
    }

    /**
     * Inicia la llamada con Salma (Llamada en Vivo)
     */
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
      // Nota: Al terminar speak(greeting), su evento utterance.onend llama automáticamente a startListening()
    }

    /**
     * Cuelga la llamada
     */
    function closeVoice() {
      chat.voiceOpen = false;
      stopListening();
      stopSpeech();
      if (el.voice) el.voice.hidden = true;
      setState('inactive');
      if (chat.open && el.text) el.text.focus();
      track('chat_call_ended');
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
