import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mic,
  Send,
  Play,
  Pause,
  User,
  Clock,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMessageModal } from '../../components/FamilyMessageModal';

interface ChatMessage {
  id: string;
  sender: 'Rahul' | 'Ashutosh' | 'Priya';
  text?: string;
  isVoice?: boolean;
  voiceDuration?: string;
  time: string;
}

export const Messages: React.FC = () => {
  const { showToast } = useFamily();
  const [inputText, setInputText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'message' | 'voice' | 'call'>('call');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'Rahul',
      text: 'Good morning papa! Did you take the blood pressure medicine after tea?',
      time: 'Today, 8:45 AM',
    },
    {
      id: 'msg-2',
      sender: 'Ashutosh',
      text: 'Ha beta, sab theek hai 😊 I had warm water, took Amlodipine, and garden walk is done.',
      time: 'Today, 9:05 AM',
    },
    {
      id: 'msg-3',
      sender: 'Ashutosh',
      isVoice: true,
      voiceDuration: '0:18',
      time: 'Today, 9:06 AM',
    },
    {
      id: 'msg-4',
      sender: 'Priya',
      text: 'Papa, I booked Dr. Mehta for Friday at 11 AM. Society driver will take you.',
      time: 'Today, 10:15 AM',
    },
    {
      id: 'msg-5',
      sender: 'Ashutosh',
      text: 'Dhanyawad beta, I will be ready on time.',
      time: 'Today, 10:20 AM',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Rahul',
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    showToast('Message sent to Ashutosh');

    // Simulate gentle parent reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'Ashutosh',
        text: 'Received beta, don’t worry about me. Work peacefully!',
        time: 'Just now',
      };
      setMessages(prev => [...prev, replyMsg]);
      showToast('New message from Ashutosh');
    }, 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-apple-blue-light text-apple-blue flex items-center justify-center font-bold text-xl shrink-0">
            👴
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-apple-text-primary">
                Family Chat with Ashutosh
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-apple-text-muted">
              Shared thread between Ashutosh, Rahul (Pune), and Priya (Bengaluru)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setModalMode('call');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Call Parent</span>
          </button>
          <button
            onClick={() => {
              setModalMode('voice');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-xs rounded-xl border border-apple-border transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-apple-blue" />
            <span className="hidden sm:inline">Voice Note</span>
          </button>
        </div>
      </section>

      {/* 2. Messages Conversation Container */}
      <div className="bg-white rounded-3xl border border-apple-border shadow-apple-sm overflow-hidden flex flex-col min-h-[480px]">
        {/* Messages List */}
        <div className="flex-1 p-5 sm:p-7 space-y-4 overflow-y-auto max-h-[500px]">
          {messages.map((msg) => {
            const isRahul = msg.sender === 'Rahul';
            const isAshutosh = msg.sender === 'Ashutosh';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isRahul ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-[11px] font-bold text-apple-text-muted mb-1 px-1">
                  {msg.sender} {isAshutosh && '• Father'}
                </span>

                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-3xl text-sm leading-relaxed shadow-xs ${
                    isRahul
                      ? 'bg-apple-blue text-white rounded-tr-xs'
                      : isAshutosh
                      ? 'bg-blue-50 text-apple-text-primary border border-blue-200/60 rounded-tl-xs'
                      : 'bg-purple-50 text-apple-text-primary border border-purple-200/60 rounded-tl-xs'
                  }`}
                >
                  {msg.isVoice ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setIsPlayingVoice(!isPlayingVoice);
                          showToast(isPlayingVoice ? 'Voice note paused' : 'Playing Ashutosh’s voice: "Namaste beta, sab badhiya hai"');
                        }}
                        className="w-10 h-10 rounded-full bg-apple-blue text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
                      >
                        {isPlayingVoice ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div>
                        <div className="text-xs font-bold text-apple-text-primary">
                          Voice message from Father
                        </div>
                        <div className="text-[11px] text-apple-text-muted mt-0.5">
                          {isPlayingVoice ? 'Playing...' : `Duration: ${msg.voiceDuration}`}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-apple-text-muted">
                  <span>{msg.time}</span>
                  {isRahul && <CheckCheck className="w-3.5 h-3.5 text-apple-blue" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-apple-canvas border-t border-apple-border flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => {
              setModalMode('voice');
              setIsModalOpen(true);
            }}
            className="p-2.5 rounded-full hover:bg-white text-apple-text-secondary hover:text-apple-blue transition-colors cursor-pointer"
            title="Record Voice Message"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Type a message to Ashutosh... (speaks automatically on his tablet)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white px-4 py-2.5 rounded-full border border-apple-border text-sm outline-none focus:ring-2 focus:ring-apple-blue"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-dark text-white disabled:opacity-40 transition-all cursor-pointer shadow-apple-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Message Modal */}
      <FamilyMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={modalMode}
      />
    </div>
  );
};
