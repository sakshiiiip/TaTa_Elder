import React from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { Mic, Square } from 'lucide-react';

interface MicrophoneHeroButtonProps {
  onClick?: () => void;
}

export const MicrophoneHeroButton: React.FC<MicrophoneHeroButtonProps> = ({ onClick }) => {
  const { voiceState, currentLanguage, setCurrentTab, startListening } = useSahaay();
  const strings = getStrings(currentLanguage);

  const isListening = voiceState.kind === 'Listening' || voiceState.kind === 'PartialResult';

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setCurrentTab(1);
      startListening();
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-apple-md border border-apple-border flex flex-col items-center justify-center text-center transition-all hover:shadow-apple-lg">
      {/* Hero Circular Trigger with Pulsing Aura Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-4">
        {/* Pulsing Aura Ring */}
        <div
          className={`absolute rounded-full transition-all duration-700 pointer-events-none ${
            isListening
              ? 'w-44 h-44 bg-red-500/20 animate-pulse-glow'
              : 'w-44 h-44 bg-apple-blue/15 animate-pulse-glow'
          }`}
        />

        {/* Secondary Accent Layer */}
        <div
          className={`absolute rounded-full transition-all duration-500 pointer-events-none ${
            isListening ? 'w-38 h-38 bg-red-500/30' : 'w-38 h-38 bg-apple-blue/20'
          }`}
        />

        {/* Core Microphone Button */}
        <button
          onClick={handleClick}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-apple-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-apple-blue/30 cursor-pointer ${
            isListening
              ? 'bg-gradient-to-b from-[#FF3B30] to-[#D70015] scale-105'
              : 'bg-gradient-to-b from-[#0066CC] to-[#004499] hover:scale-102'
          }`}
          aria-label={isListening ? strings.tapToStop : strings.tapToSpeak}
        >
          {isListening ? (
            <Square className="w-12 h-12 text-white fill-white animate-pulse" />
          ) : (
            <Mic className="w-14 h-14 text-white" />
          )}
        </button>
      </div>

      {/* Main Action Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary mb-1">
        {isListening ? strings.tapToStop : strings.tapToSpeak}
      </h2>

      {/* Helper text */}
      <p className="text-sm sm:text-base text-apple-text-muted max-w-md">
        {isListening ? strings.listeningText : strings.micSubtitle}
      </p>
    </div>
  );
};
