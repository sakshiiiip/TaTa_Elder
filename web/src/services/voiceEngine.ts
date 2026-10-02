import { WakeWordDetector } from './wakeWordDetector';

export interface SpeechCallbacks {
  onReadyForSpeech?: () => void;
  onPartialResult?: (text: string) => void;
  onFinalResult?: (text: string) => void;
  onWakeWordDetected?: () => void;
  onError?: (message: string) => void;
  onStopped?: () => void;
}

// Convert app language string to BCP-47 locale tag
export function languageToLocale(language: string): string {
  if (language.includes('Hindi') || language.includes('हिंदी')) return 'hi-IN';
  if (language.includes('Marathi') || language.includes('मराठी')) return 'mr-IN';
  if (language.includes('Tamil') || language.includes('தமிழ்')) return 'ta-IN';
  if (language.includes('Telugu') || language.includes('తెలుగు')) return 'te-IN';
  if (language.includes('Bengali') || language.includes('বাংলা')) return 'bn-IN';
  return 'en-IN';
}

export class BrowserSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private callbacks: SpeechCallbacks = {};
  private currentLanguage: string = 'English (India)';

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onReadyForSpeech?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();

        if (currentText) {
          if (WakeWordDetector.isWakeWord(currentText)) {
            this.callbacks.onWakeWordDetected?.();
          }

          if (finalTranscript) {
            this.callbacks.onFinalResult?.(finalTranscript.trim());
          } else {
            this.callbacks.onPartialResult?.(interimTranscript.trim());
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        let message = 'Something went wrong with speech recognition. Please try again.';
        if (event.error === 'not-allowed') {
          message = 'Microphone permission is needed. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          message = "I didn't hear anything. Please try speaking again.";
        } else if (event.error === 'network') {
          message = 'Network error during voice recognition. Please check your connection.';
        }
        this.callbacks.onError?.(message);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onStopped?.();
      };
    }
  }

  isAvailable(): boolean {
    return !!this.recognition;
  }

  startListening(language: string, callbacks: SpeechCallbacks): void {
    if (!this.recognition) {
      callbacks.onError?.('Voice recognition is not supported in this browser. You can type your request or use modern Chrome/Edge/Safari.');
      return;
    }

    this.currentLanguage = language;
    this.callbacks = callbacks;
    this.recognition.lang = languageToLocale(language);

    try {
      this.recognition.start();
    } catch (e: any) {
      // If already started, stop and restart
      try {
        this.recognition.stop();
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch (_) {}
        }, 100);
      } catch (_) {}
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }
    this.isListening = false;
  }
}

export class BrowserTextToSpeech {
  private isSpeaking: boolean = false;
  private speechRate: number = 0.85; // Elderly-comfortable speed
  private onSpeakingChange?: (speaking: boolean) => void;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
      };
    }
  }

  setSpeakingChangeListener(listener: (speaking: boolean) => void): void {
    this.onSpeakingChange = listener;
  }

  setSpeechRate(rate: number): void {
    this.speechRate = Math.min(Math.max(rate, 0.5), 1.5);
  }

  getSpeechRate(): number {
    return this.speechRate;
  }

  cleanTtsText(text: string): string {
    return text
      .replace(/\*{1,2}/g, '')
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  speak(text: string, language: string, force: boolean = false): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    const cleaned = this.cleanTtsText(text);
    if (!cleaned) return false;

    // Skip auto-play if too long unless user specifically tapped Play
    if (!force && cleaned.length > 400) {
      return false;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(cleaned);
    const targetLocale = languageToLocale(language);
    utterance.lang = targetLocale;
    utterance.rate = this.speechRate;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const langCode = targetLocale.slice(0, 2).toLowerCase();
    const matchingVoice =
      voices.find(v => v.lang.toLowerCase() === targetLocale.toLowerCase()) ||
      voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLocale.toLowerCase())) ||
      voices.find(v => v.lang.toLowerCase().startsWith(langCode)) ||
      voices.find(v => v.name.toLowerCase().includes(langCode)) ||
      voices.find(v => v.lang.includes('IN')) ||
      voices.find(v => v.lang.startsWith('en'));

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.onSpeakingChange?.(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.onSpeakingChange?.(false);
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.onSpeakingChange?.(false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.onSpeakingChange?.(false);
    this.currentUtterance = null;
  }
}
