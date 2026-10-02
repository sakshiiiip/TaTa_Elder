import React, { useState } from 'react';
import { X, Send, Mic, Phone, CheckCircle2, User, Clock } from 'lucide-react';

interface MessageItem {
  id: string;
  sender: 'Rahul' | 'Ashutosh';
  text: string;
  time: string;
  isVoice?: boolean;
}

interface FamilyMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'message' | 'voice' | 'call';
  onCallParent?: () => void;
}

export const FamilyMessageModal: React.FC<FamilyMessageModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'message',
  onCallParent,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      sender: 'Rahul',
      text: 'Good morning! Did you have breakfast?',
      time: 'Today, 8:45 AM',
    },
    {
      id: '2',
      sender: 'Ashutosh',
      text: "I'm fine beta 😊 Had poha and warm water.",
      time: 'Today, 9:05 AM',
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Did you take your medicine with lunch?',
    'I just paid the electricity bill for this month!',
    'Calling you in 15 mins after my team meeting.',
    'Priya called to say she will visit next weekend.',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: MessageItem = {
      id: String(Date.now()),
      sender: 'Rahul',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate gentle response from Ashutosh after a moment
    setTimeout(() => {
      const replies = [
        'Thank you beta, God bless you 🙏',
        'Yes, taken on time! Take care of yourself.',
        'Okay beta, will keep the phone nearby.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'Ashutosh',
          text: randomReply,
          time: 'Just now',
        },
      ]);
    }, 2000);
  };

  const handleSendVoiceMessage = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceMsg: MessageItem = {
        id: String(Date.now()),
        sender: 'Rahul',
        text: '🎙️ Voice note (0:14) • "Hi Dad, checking in before my evening drive."',
        time: 'Just now',
        isVoice: true,
      };
      setMessages((prev) => [...prev, voiceMsg]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col h-[650px] max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="family-message-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-apple-blue-light text-apple-blue font-extrabold flex items-center justify-center text-lg shadow-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="family-message-title" className="text-base sm:text-lg font-bold text-apple-text-primary">
                  Ashutosh Pandey (Dad)
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-apple-text-muted">Active in Mumbai • Bandra West</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (onCallParent) {
                  onCallParent();
                } else {
                  window.open('tel:+919876501234');
                }
              }}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
              title="Call Ashutosh"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-apple-text-muted transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-gray-50/50">
          {messages.map((m) => {
            const isRahul = m.sender === 'Rahul';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isRahul ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm ${
                    isRahul
                      ? 'bg-apple-blue text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-apple-border text-apple-text-primary rounded-bl-none shadow-apple-sm'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[10px] text-apple-text-muted mt-1 px-1">
                  {m.sender} • {m.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-apple-border bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-blue-50 text-apple-text-secondary hover:text-apple-blue text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              "{p}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-apple-border flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Send a warm message to dad..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl text-sm text-apple-text-primary outline-none focus:ring-2 focus:ring-apple-blue"
          />

          <button
            onClick={handleSendVoiceMessage}
            className={`p-3 rounded-2xl transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-gray-100 hover:bg-gray-200 text-apple-text-secondary'
            }`}
            title="Send Voice Note"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-3 bg-apple-blue hover:bg-apple-blue-dark disabled:opacity-40 text-white rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
