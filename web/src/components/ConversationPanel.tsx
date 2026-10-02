import React from 'react';
import { Bot, User } from 'lucide-react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { ConversationMessage } from '../types';

interface ConversationPanelProps {
  history: ConversationMessage[];
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({ history }) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  if (history.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400">
        <p className="text-sm">{strings.noMessages}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 max-h-[420px] overflow-y-auto p-2 pr-3 scroll-smooth">
      {history.map((turn, index) => {
        const isUser = turn.role === 'USER';
        return (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              isUser ? 'flex-row-reverse self-end' : 'flex-row self-start'
            } max-w-[85%]`}
          >
            {/* Avatar Icon */}
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                isUser
                  ? 'bg-apple-blue text-white'
                  : 'bg-white border border-gray-200 text-apple-blue'
              }`}
            >
              {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Chat Bubble */}
            <div
              className={`p-4 rounded-3xl shadow-sm text-sm md:text-base leading-relaxed ${
                isUser
                  ? 'bg-apple-blue text-white rounded-tr-none'
                  : 'bg-white border border-gray-100 text-gray-900 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{turn.text}</p>
              <span
                className={`block text-[10px] mt-1.5 font-medium ${
                  isUser ? 'text-blue-100 text-right' : 'text-gray-400'
                }`}
              >
                {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
