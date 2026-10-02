import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { X, Phone, MessageSquare, Heart, CheckCircle2, Clock, Send, ShieldAlert, Sparkles } from 'lucide-react';

interface FamilyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'call' | 'message' | 'help';
}

export const FamilyContactModal: React.FC<FamilyContactModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'call',
}) => {
  const { showFeedback, speakText } = useSahaay();
  const [activeTab, setActiveTab] = useState<'call' | 'message' | 'help'>(defaultAction);
  const [callingMember, setCallingMember] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState<string | null>(null);
  const [helpRequested, setHelpRequested] = useState<boolean>(false);

  if (!isOpen) return null;

  const familyMembers = [
    {
      id: 'priya',
      name: 'Priya',
      relation: 'Daughter',
      status: 'Available',
      statusColor: 'bg-emerald-500',
      statusTextColor: 'text-emerald-700',
      phone: '+91 98765 24680',
      avatarBg: 'bg-rose-100 text-rose-700',
      lastCall: 'Yesterday, 8:30 PM (12 mins)',
    },
    {
      id: 'rahul',
      name: 'Rahul',
      relation: 'Son',
      status: 'Busy at work',
      statusColor: 'bg-amber-500',
      statusTextColor: 'text-amber-700',
      phone: '+91 98765 43210',
      avatarBg: 'bg-blue-100 text-blue-700',
      lastCall: '2 days ago, 7:15 PM',
    },
  ];

  const quickMessages = [
    'Please call me when you are free.',
    'I had my lunch and took all my medicines on time.',
    'Everything is good at home, no need to worry.',
    'Could you please help me order my monthly medicine refill?',
  ];

  const handleStartCall = (member: typeof familyMembers[0]) => {
    setCallingMember(member.name);
    speakText(`Calling your daughter ${member.name} now...`, true);
    setTimeout(() => {
      showFeedback(`Connected call with ${member.name} (${member.phone})`);
    }, 1500);
  };

  const handleSendMessage = (msg: string, recipientName: string) => {
    setMessageSent(`Message sent to ${recipientName}: "${msg}"`);
    speakText(`Message sent to ${recipientName}.`, true);
    setTimeout(() => {
      setMessageSent(null);
    }, 4000);
  };

  const handleRequestHelp = () => {
    setHelpRequested(true);
    speakText('We have sent a gentle assistance alert to Priya and Rahul.', true);
    showFeedback('Family alerted: Rahul and Priya have been notified to check in on you.');
    setTimeout(() => {
      setHelpRequested(false);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="family-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-50 to-blue-50 border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-apple-sm flex items-center justify-center text-rose-600">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h2 id="family-modal-title" className="text-xl sm:text-2xl font-bold text-apple-text-primary">
                Your Family
              </h2>
              <p className="text-xs sm:text-sm text-apple-text-muted">
                Always just one tap away
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-apple-text-muted transition-colors shadow-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex border-b border-apple-border bg-gray-50/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('call')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'call'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-text-secondary hover:bg-white'
            }`}
          >
            <Phone className="w-4 h-4" />
            Call Family
          </button>
          <button
            onClick={() => setActiveTab('message')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'message'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-text-secondary hover:bg-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Quick Message
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              activeTab === 'help'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-text-secondary hover:bg-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Request Help
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Ongoing Call Simulation Toast */}
          {callingMember && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-base">Calling {callingMember}...</h4>
                  <p className="text-xs text-emerald-700">Connecting your speakerphone now</p>
                </div>
              </div>
              <button
                onClick={() => setCallingMember(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                End Call
              </button>
            </div>
          )}

          {messageSent && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3 text-blue-900 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-apple-blue shrink-0" />
              <span>{messageSent}</span>
            </div>
          )}

          {helpRequested && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-amber-950 text-sm">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
                Help Request Dispatched
              </div>
              <p className="text-xs text-amber-800">
                Priya and Rahul received an SMS & WhatsApp notification. Rahul will call you shortly.
              </p>
            </div>
          )}

          {/* TAB 1: CALL */}
          {activeTab === 'call' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-apple-text-secondary font-medium">
                Tap any family member to start a high-volume direct phone or speaker call:
              </p>

              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-gray-50 hover:bg-blue-50/50 rounded-2xl border border-apple-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl ${member.avatarBg} font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-apple-text-primary">
                            {member.name}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-apple-border text-apple-text-secondary">
                            {member.relation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${member.statusColor}`} />
                          <span className={`text-xs font-semibold ${member.statusTextColor}`}>
                            {member.status}
                          </span>
                          <span className="text-apple-border">•</span>
                          <span className="text-xs text-apple-text-muted">{member.phone}</span>
                        </div>
                        <div className="text-[11px] text-apple-text-muted flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          Last call: {member.lastCall}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartCall(member)}
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Call {member.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: QUICK MESSAGE */}
          {activeTab === 'message' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-apple-text-secondary font-medium">
                Tap any pre-written message to send it instantly via SMS/WhatsApp to both Priya and Rahul:
              </p>

              <div className="space-y-2.5">
                {quickMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(msg, 'Family')}
                    className="w-full p-4 bg-white hover:bg-blue-50/70 border border-apple-border hover:border-apple-blue rounded-2xl text-left font-medium text-apple-text-primary text-sm sm:text-base transition-all flex items-center justify-between group shadow-apple-sm"
                  >
                    <span>"{msg}"</span>
                    <span className="w-8 h-8 rounded-full bg-apple-blue-light text-apple-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ml-2">
                      <Send className="w-4 h-4" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REQUEST HELP */}
          {activeTab === 'help' && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-5 sm:p-6 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-950">
                  Non-Emergency Family Support
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 mt-1 max-w-md mx-auto">
                  Need non-urgent help with groceries, technology, medicines, or travel? Tap below to notify Rahul and Priya.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRequestHelp}
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Family Assistance Notice
                </button>
              </div>
              <p className="text-[11px] text-amber-700 font-medium">
                For immediate medical or safety emergencies, always use the red <strong>SOS</strong> button.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-apple-border flex items-center justify-between text-xs text-apple-text-muted">
          <span>Last family call: Yesterday, 8:30 PM</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-apple-border text-apple-text-primary font-bold hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
