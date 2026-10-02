import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import { VoiceInputPanel } from '../../components/VoiceInputPanel';
import { WakeWordBadge } from '../../components/WakeWordBadge';
import { ClarificationCard } from '../../components/ClarificationCard';
import { ResponseCard } from '../../components/ResponseCard';
import { ConversationPanel } from '../../components/ConversationPanel';
import { Send, Sparkles, MessageSquare, History, Mic, Volume2 } from 'lucide-react';

export const SahaayAssistant: React.FC = () => {
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
    showFeedback,
  } = useSahaay();

  const strings = getStrings(currentLanguage);
  const [textInput, setTextInput] = useState('');

  const sampleCommands = [
    { label: strings.suggestedPhrases[0] || 'Book doctor consultation', desc: strings.doctorSubtitle },
    { label: strings.suggestedPhrases[1] || 'Pay electricity bill', desc: strings.billsSubtitle },
    { label: strings.suggestedPhrases[2] || 'Help with pension form', desc: strings.formsSubtitle },
    { label: strings.suggestedPhrases[3] || 'Call emergency contact', desc: strings.sosSubtitle },
  ];

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput.trim();
    setTextInput('');
    await processUserInput(query);
  };

  const handleQuickPrompt = async (promptText: string) => {
    showFeedback(`${strings.thinkingStatus}: "${promptText}"`);
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
    <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header & Wake Word Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
              {strings.voiceCompanionBadge}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-apple-blue border border-blue-200">
              <Sparkles className="w-3 h-3 text-apple-blue" />
              {strings.sahaayAiBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1 flex items-center gap-2.5">
            {strings.assistantPageTitle}
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.assistantPageSub}
          </p>
        </div>

        <WakeWordBadge
          isListening={voiceState.kind === 'Listening' || voiceState.kind === 'PartialResult'}
          onClick={handleToggleListening}
        />
      </div>

      {/* Main Grid: Interactive Mic & Controls vs Conversation History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Voice Interaction & Response */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Interactive Mic Panel */}
          <VoiceInputPanel
            voiceState={voiceState}
            liveTranscript={transcript || voiceState.partialText || ''}
            isSpeaking={isSpeaking}
            onToggleListen={handleToggleListening}
            onStop={stopSpeaking}
          />

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

          {/* Suggested Example Commands */}
          <div className="bg-white rounded-3xl p-5 border border-apple-border shadow-apple-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-apple-blue" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-apple-text-muted">
                {strings.suggestedCommandsTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sampleCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(cmd.label)}
                  className="flex flex-col text-left p-3 rounded-2xl bg-apple-canvas hover:bg-blue-50/80 border border-apple-border hover:border-blue-200 transition-all group cursor-pointer"
                >
                  <span className="text-sm font-bold text-apple-text-primary group-hover:text-apple-blue">
                    "{cmd.label}"
                  </span>
                  <span className="text-xs text-apple-text-muted mt-0.5">{cmd.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Text Fallback */}
          <form
            onSubmit={handleSendText}
            className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-apple-border shadow-apple-sm focus-within:border-apple-blue focus-within:ring-2 focus-within:ring-blue-100"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={strings.typePlaceholder}
              className="flex-1 px-4 py-2.5 text-sm md:text-base outline-none text-apple-text-primary bg-transparent placeholder-apple-text-muted"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-3 bg-apple-blue hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Conversation History */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-apple-border mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-apple-blue" />
              <h3 className="font-bold text-sm text-apple-text-primary">{strings.conversationTranscript}</h3>
            </div>
            <span className="text-xs text-apple-text-muted">
              {conversation.length} {strings.exploreTasks}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <ConversationPanel history={conversation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SahaayAssistant;
