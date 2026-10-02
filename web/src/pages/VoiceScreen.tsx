import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { VoiceInputPanel } from '../components/VoiceInputPanel';
import { WakeWordBadge } from '../components/WakeWordBadge';
import { ClarificationCard } from '../components/ClarificationCard';
import { ResponseCard } from '../components/ResponseCard';
import { ConversationPanel } from '../components/ConversationPanel';
import { Send, MessageSquare, Info } from 'lucide-react';

export const VoiceScreen: React.FC = () => {
  const {
    voiceState,
    conversation,
    currentResponse,
    transcript,
    isSpeaking,
    startListening,
    stopListening,
    speakCurrentResponse,
    speakText,
    stopSpeaking,
    processUserInput,
    currentLanguage,
  } = useSahaay();

  const strings = getStrings(currentLanguage);
  const [textInput, setTextInput] = useState('');

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput.trim();
    setTextInput('');
    await processUserInput(query);
  };

  const handleQuickPrompt = async (promptText: string) => {
    await processUserInput(promptText);
  };

  const handleToggleListening = () => {
    if (voiceState.kind === 'Listening' || voiceState.kind === 'PartialResult') {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16 animate-fade-in space-y-6">
      {/* Header & Wake Word Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            {strings.navVoice}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {strings.heroSubheading}
          </p>
        </div>

        <WakeWordBadge
          isListening={voiceState.kind === 'Listening' || voiceState.kind === 'PartialResult'}
          onClick={handleToggleListening}
        />
      </div>

      {/* Two Column Layout on Desktop: Interactive Mic + Realtime Output vs History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Input & Active Answer) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Interactive Mic Panel */}
          <VoiceInputPanel
            voiceState={voiceState}
            liveTranscript={transcript || voiceState.partialText || ''}
            isSpeaking={isSpeaking}
            onToggleListen={handleToggleListening}
            onStop={stopSpeaking}
          />

          {/* Quick Voice Suggestions */}
          <div className="bg-gray-50 rounded-3xl p-5 border border-gray-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block mb-3">
              {strings.suggestedPhrasesTitle}
            </span>
            <div className="flex flex-wrap gap-2">
              {strings.suggestedPhrases.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-3.5 py-2 bg-white hover:bg-blue-50 text-gray-800 hover:text-apple-blue border border-gray-200 hover:border-blue-200 text-xs md:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Clarification prompt card if assistant needs details */}
          {currentResponse?.needsClarification && currentResponse.clarifyingQuestion && (
            <ClarificationCard
              question={currentResponse.clarifyingQuestion}
              onRespond={startListening}
              onRetry={() => {
                if (currentResponse?.response) speakCurrentResponse();
              }}
            />
          )}

          {/* Assistant active response card */}
          {currentResponse && (
            <ResponseCard
              spokenText={currentResponse.response}
              intent={currentResponse.intent}
              nextStep={currentResponse.suggestedNextStep || undefined}
              tip={currentResponse.helpfulTip || undefined}
              isSpeaking={isSpeaking}
              onSpeak={speakCurrentResponse}
              onStopSpeaking={stopSpeaking}
              onRetry={startListening}
            />
          )}

          {/* Manual Text Fallback in case mic is restricted */}
          <form
            onSubmit={handleSendText}
            className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:border-apple-blue focus-within:ring-2 focus-within:ring-blue-100"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={strings.typePlaceholder}
              className="flex-1 px-4 py-2.5 text-sm md:text-base outline-none text-gray-900 bg-transparent placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-3 bg-apple-blue hover:bg-primary-dark disabled:bg-gray-200 text-white rounded-xl transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column (Conversation Transcript Log) - 5 cols */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <MessageSquare className="w-5 h-5 text-apple-blue" />
              <span>{strings.conversationTranscript}</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-apple-blue-light text-apple-blue">
              {conversation.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <ConversationPanel history={conversation} />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span>{strings.voiceCommandsHelp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
