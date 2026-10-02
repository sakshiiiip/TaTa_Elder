import React from 'react';
import { HelpCircle, Mic, RefreshCw } from 'lucide-react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';

interface ClarificationCardProps {
  question: string;
  onRespond: () => void;
  onRetry: () => void;
}

export const ClarificationCard: React.FC<ClarificationCardProps> = ({
  question,
  onRespond,
  onRetry,
}) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  return (
    <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 md:p-6 shadow-sm animate-fade-in my-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-amber-200 text-amber-800 rounded-2xl flex-shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800">
            {strings.clarificationHeader}
          </span>
          <p className="text-lg md:text-xl font-bold text-gray-900 mt-1 leading-snug">
            {question}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onRespond}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              {strings.answerWithVoice}
            </button>

            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-100 text-amber-900 font-semibold rounded-xl border border-amber-300 transition-colors text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              {strings.repeatButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
