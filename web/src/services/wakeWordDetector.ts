const WAKE_PATTERNS = [
  'hey sahayak',
  'hey sahaay',
  'hey sahaayak',
  'hey sahayk',
  'hey sahaak',
  'sahayak',
  'sahaay',
];

function normalize(text: string): string {
  // Keep Hindi unicode range \u0900-\u097f alongside alphanumeric
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, '')
    .trim();
}

export const WakeWordDetector = {
  isWakeWord(text: string): boolean {
    if (!text || !text.trim()) return false;
    const normalized = normalize(text);
    return WAKE_PATTERNS.some(pattern => normalized.includes(pattern));
  },
};
