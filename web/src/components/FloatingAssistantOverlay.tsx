import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { GeminiLlmService } from '../services/geminiService';
import { Mic, Eye, Lightbulb, AlertTriangle, X, Volume2 } from 'lucide-react';

interface FloatingAssistantOverlayProps {
  onOpenSos: () => void;
}

export const FloatingAssistantOverlay: React.FC<FloatingAssistantOverlayProps> = ({ onOpenSos }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const { setCurrentTab, startListening, speakText, currentLanguage, showFeedback } = useSahaay();

  const handleVoice = () => {
    setIsExpanded(false);
    setCurrentTab(1);
    startListening();
  };

  const handleReadScreen = () => {
    setIsExpanded(false);
    // Extract main text content of visible screen
    const mainEl = document.querySelector('main') || document.body;
    const textToRead = Array.from(mainEl.querySelectorAll('h1, h2, h3, p, button, label'))
      .map(el => (el as HTMLElement).innerText)
      .filter(t => t && t.length > 2)
      .slice(0, 15)
      .join('. ');

    if (textToRead) {
      showFeedback('🔊 Reading page aloud...');
      speakText(`Here is what is on this page: ${textToRead}`, true);
    } else {
      showFeedback('No text content found to read.');
    }
  };

  const handleExplainScreen = async () => {
    setIsExpanded(false);
    setIsExplaining(true);
    showFeedback('💡 Sahaay is analyzing this screen...');

    const mainEl = document.querySelector('main') || document.body;
    const screenSnippet = (mainEl.innerText || '').slice(0, 500);

    const prompt = `Briefly explain to an elderly senior citizen in 2 simple sentences what they can do on this screen: ${screenSnippet}`;
    const response = await GeminiLlmService.analyze(prompt, [], currentLanguage);

    setIsExplaining(false);
    showFeedback(`💡 ${response.response}`);
    speakText(response.response, true);
  };

  const handleHelp = () => {
    setIsExpanded(false);
    onOpenSos();
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 z-40 flex flex-col items-end">
      {/* Expanded Radial Menu */}
      {isExpanded && (
        <div className="mb-3 bg-white/95 backdrop-blur-md rounded-3xl p-3 shadow-apple-lg border border-apple-border flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={handleVoice}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-apple-canvas transition-colors text-left text-apple-text-primary font-bold text-sm w-44 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-apple-blue-light text-apple-blue flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Voice Assistant</div>
              <div className="text-[11px] text-apple-text-muted font-normal">Talk to Sahaay</div>
            </div>
          </button>

          <button
            onClick={handleReadScreen}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-apple-canvas transition-colors text-left text-apple-text-primary font-bold text-sm w-44 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Read Page</div>
              <div className="text-[11px] text-apple-text-muted font-normal">Hear screen aloud</div>
            </div>
          </button>

          <button
            onClick={handleExplainScreen}
            disabled={isExplaining}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-apple-canvas transition-colors text-left text-apple-text-primary font-bold text-sm w-44 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Explain Screen</div>
              <div className="text-[11px] text-apple-text-muted font-normal">AI easy summary</div>
            </div>
          </button>

          <button
            onClick={handleHelp}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-red-50 transition-colors text-left text-sos-red font-bold text-sm w-44 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-sos-bg text-sos-red flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Emergency SOS</div>
              <div className="text-[11px] text-red-400 font-normal">Instant 3s dial</div>
            </div>
          </button>
        </div>
      )}

      {/* Main Floating Sahaay Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-apple-blue hover:bg-apple-blue-dark text-white flex items-center justify-center shadow-apple-lg hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-apple-blue/30 relative"
        title="Sahaay Floating Assistant"
        aria-label="Sahaay Floating Assistant"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <span className="text-2xl">🎙️</span>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></span>
          </>
        )}
      </button>
    </div>
  );
};
