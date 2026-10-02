import React from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, Lightbulb, RotateCcw } from 'lucide-react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';

interface ResponseCardProps {
  spokenText: string;
  intent?: string;
  confidence?: number;
  nextStep?: string;
  tip?: string;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStopSpeaking: () => void;
  onRetry: () => void;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  spokenText,
  intent,
  confidence,
  nextStep,
  tip,
  isSpeaking,
  onSpeak,
  onStopSpeaking,
  onRetry,
}) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  if (!spokenText) return null;

  return (
    <div className="w-full bg-white rounded-3xl p-6 border border-gray-100 shadow-card my-4 animate-fade-in">
      {/* Intent & Confidence Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-apple-blue">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {strings.assistantAnswer}
          </span>
          {intent && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {intent.replace('_', ' ')}
            </span>
          )}
        </div>

        {confidence !== undefined && (
          <span className="text-xs font-medium text-gray-400">
            Confidence: {Math.round(confidence * 100)}%
          </span>
        )}
      </div>

      {/* Spoken Response Text */}
      <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed tracking-tight">
        "{spokenText}"
      </p>

      {/* Next Step Banner if present */}
      {nextStep && (
        <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-3">
          <ArrowRight className="w-5 h-5 text-apple-blue flex-shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{strings.nextStepTitle}</p>
            <p className="text-sm font-semibold text-gray-800">{nextStep}</p>
          </div>
        </div>
      )}

      {/* Helpful Tip if present */}
      {tip && (
        <div className="mt-3 p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-xs md:text-sm text-amber-900 font-medium">{tip}</p>
        </div>
      )}

      {/* Actions row: Read aloud, Stop, Retry */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <button
              onClick={onStopSpeaking}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <VolumeX className="w-4 h-4" />
              {strings.stopReading}
            </button>
          ) : (
            <button
              onClick={onSpeak}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-apple-blue font-semibold rounded-xl text-sm transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              {strings.listenAgain}
            </button>
          )}

          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {strings.tryAnotherPhrase}
          </button>
        </div>
      </div>
    </div>
  );
};
