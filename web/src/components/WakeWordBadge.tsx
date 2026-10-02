import React from 'react';
import { Sparkles } from 'lucide-react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';

interface WakeWordBadgeProps {
  isListening: boolean;
  wakeWord?: string;
  onClick?: () => void;
}

export const WakeWordBadge: React.FC<WakeWordBadgeProps> = ({
  isListening,
  wakeWord = 'Hey Sahayak',
  onClick,
}) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  return (
    <div
      onClick={onClick}
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs md:text-sm font-semibold transition-all cursor-pointer select-none shadow-sm ${
        isListening
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-200'
          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {isListening && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isListening ? 'bg-emerald-600' : 'bg-gray-400'
          }`}
        />
      </span>

      <Sparkles className={`w-3.5 h-3.5 ${isListening ? 'text-emerald-600' : 'text-gray-400'}`} />

      <span>
        {isListening ? (
          strings.sayWakeWord
        ) : (
          strings.micStandby
        )}
      </span>
    </div>
  );
};
