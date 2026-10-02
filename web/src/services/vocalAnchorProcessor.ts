import { VocalAnchorAction } from '../types';

const REPEAT_PATTERNS = [
  'repeat',
  'फिर से बोलो',
  'phir se bolo',
  'dobara bolo',
  'again',
  'ek baar aur',
  'say again',
  'repeat that',
];

const GO_BACK_PATTERNS = [
  'go back',
  'पीछे जाओ',
  'peeche jao',
  'wapas jao',
  'wapas',
  'back jao',
  'previous screen',
  'take me back',
];

const STOP_PATTERNS = [
  'stop',
  'रुको',
  'ruko',
  'band karo',
  'chup',
  'bas',
  'shut up',
  'pause',
  'halt',
];

const NEXT_STEP_PATTERNS = [
  'what should i do next',
  'अब क्या करना है',
  'ab kya karna hai',
  'next step',
  'aage kya karna hai',
  'aage kya',
  'ab kya',
  'next',
  'what next',
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[?!.,;:]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export const VocalAnchorProcessor = {
  detect(transcript: string): VocalAnchorAction | null {
    if (!transcript || !transcript.trim()) return null;
    const normalized = normalize(transcript);

    if (REPEAT_PATTERNS.some(p => normalized.includes(p))) {
      return 'REPEAT';
    }
    if (GO_BACK_PATTERNS.some(p => normalized.includes(p))) {
      return 'GO_BACK';
    }
    if (STOP_PATTERNS.some(p => normalized.includes(p))) {
      return 'STOP';
    }
    if (NEXT_STEP_PATTERNS.some(p => normalized.includes(p))) {
      return 'NEXT_STEP';
    }

    return null;
  },
};
