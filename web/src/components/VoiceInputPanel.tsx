import React from 'react';
import { Mic, Square, Volume2 } from 'lucide-react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { VoiceState } from '../types';

interface VoiceInputPanelProps {
  voiceState: VoiceState;
  liveTranscript: string;
  isSpeaking: boolean;
  onToggleListen: () => void;
  onStop: () => void;
  statusText?: string;
}

export const VoiceInputPanel: React.FC<VoiceInputPanelProps> = ({
  voiceState,
  liveTranscript,
  isSpeaking,
  onToggleListen,
  onStop,
  statusText,
}) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const isListening = voiceState.kind === 'Listening' || voiceState.kind === 'PartialResult';
  const isProcessing = voiceState.kind === 'Processing';

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-gray-100 shadow-card">
      {/* Visual Ripple & Mic Button */}
      <div className="relative flex items-center justify-center my-4">
        {/* Ripple Rings */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-apple-blue/15 animate-ping" />
            <div className="absolute w-44 h-44 rounded-full bg-apple-blue/10 animate-pulse" />
          </>
        )}

        {isProcessing && (
          <div className="absolute w-36 h-36 rounded-full border-4 border-apple-blue border-t-transparent animate-spin" />
        )}

        {/* Central Button */}
        <button
          onClick={onToggleListen}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-xl cursor-pointer ${
            isListening
              ? 'bg-gradient-to-tr from-sos-red to-red-500 text-white shadow-red-300'
              : isProcessing
              ? 'bg-amber-500 text-white shadow-amber-300'
              : 'bg-gradient-to-tr from-primary to-apple-blue text-white shadow-blue-300 hover:shadow-2xl hover:scale-105'
          }`}
          aria-label={isListening ? strings.tapToStop : strings.tapToSpeak}
        >
          {isListening ? (
            <Square className="w-10 h-10 fill-current" />
          ) : (
            <Mic className="w-11 h-11" />
          )}
        </button>
      </div>

      {/* Status label */}
      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          {statusText ||
            (isListening
              ? strings.listeningStatus
              : isProcessing
              ? strings.thinkingStatus
              : strings.tapMicPrompt)}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isListening ? strings.listeningText : strings.speakPrompt}
        </p>
      </div>

      {/* Live Transcript Bubble */}
      {liveTranscript && (
        <div className="mt-5 w-full max-w-lg p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-apple-blue animate-pulse flex-shrink-0" />
          <p className="text-base text-gray-800 italic font-medium leading-relaxed">
            "{liveTranscript}"
          </p>
        </div>
      )}

      {/* Stop speaking banner if TTS is speaking */}
      {isSpeaking && (
        <button
          onClick={onStop}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-full border border-gray-300 transition-colors cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-primary animate-pulse" />
          {strings.assistantIsSpeaking}
        </button>
      )}
    </div>
  );
};
