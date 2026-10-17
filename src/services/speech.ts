/**
 * Finnish text-to-speech via the browser's built-in Web Speech API.
 *
 * No network call and no paid service: this uses whatever Finnish voice the
 * device already has. On devices with no fi-FI voice installed, `canSpeak()`
 * returns false and the UI hides the speaker buttons instead of playing
 * Finnish text in an English accent.
 */

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function supported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function findFinnishVoice(): SpeechSynthesisVoice | null {
  if (!supported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find((v) => v.lang === 'fi-FI') ??
    voices.find((v) => v.lang.toLowerCase().startsWith('fi')) ??
    null
  );
}

/**
 * Voices load asynchronously in most browsers, so this resolves once the list
 * is populated (or immediately if it already is).
 */
export function initSpeech(): Promise<boolean> {
  if (!supported()) return Promise.resolve(false);

  cachedVoice = findFinnishVoice();
  if (cachedVoice) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      cachedVoice = findFinnishVoice();
      resolve(Boolean(cachedVoice));
    }, 1200);

    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timer);
      cachedVoice = findFinnishVoice();
      resolve(Boolean(cachedVoice));
    };
  });
}

export function canSpeak(): boolean {
  if (!supported()) return false;
  if (cachedVoice === undefined) cachedVoice = findFinnishVoice();
  return Boolean(cachedVoice);
}

export function speak(text: string): void {
  if (!supported() || !text) return;
  if (cachedVoice === undefined) cachedVoice = findFinnishVoice();
  if (!cachedVoice) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = cachedVoice;
    utterance.lang = cachedVoice.lang;
    // Slightly below normal rate; these are study examples, not conversation.
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch {
    /* Speech is a nice-to-have; never let it break the page. */
  }
}

export function stopSpeaking(): void {
  if (!supported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
