import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import {
  Heart,
  Phone,
  MessageSquare,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface FamilyHelpRequest {
  id: string;
  title: string;
  assignedTo: string;
  category: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Completed';
  note: string;
}

export const ParentFamily: React.FC = () => {
  const { showFeedback, speakText, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [helpRequests, setHelpRequests] = useState<FamilyHelpRequest[]>([
    {
      id: 'FAM-1',
      title: 'Accompany to Dr. Sharma Cardiology Appointment',
      assignedTo: 'Rahul Sharma',
      category: 'Health Visit',
      date: 'Tomorrow, 5:00 PM',
      status: 'Accepted',
      note: 'Rahul booked Uber and will reach Bandra clinic by 4:45 PM.',
    },
    {
      id: 'FAM-2',
      title: 'Verify health insurance renewal documents',
      assignedTo: 'Priya Sharma',
      category: 'Documentation',
      date: 'Today, 2:30 PM',
      status: 'Pending',
      note: 'Priya will review Star Health policy details this evening.',
    },
    {
      id: 'FAM-3',
      title: 'Setup television set-top box remote batteries',
      assignedTo: 'Rahul Sharma',
      category: 'Home Help',
      date: 'Last Sunday',
      status: 'Completed',
      note: 'Replaced AAA cells and tested all DD channels.',
    },
  ]);

  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [selectedChild, setSelectedChild] = useState('Rahul Sharma');

  const familyMembers = [
    {
      name: 'Rahul Sharma',
      relation: strings.sonRelationLabel,
      city: 'Pune (Kalyani Nagar)',
      phone: '+91 98201 23456',
      status: strings.availableStatus,
      avatarBg: 'bg-blue-100 text-apple-blue',
      lastSpoke: 'Today, 9:00 AM',
    },
    {
      name: 'Priya Sharma',
      relation: strings.daughterRelationLabel,
      city: 'Bengaluru (Indiranagar)',
      phone: '+91 98450 78901',
      status: strings.atWorkStatus,
      avatarBg: 'bg-rose-100 text-rose-600',
      lastSpoke: 'Yesterday, 8:15 PM',
    },
  ];

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const newReq: FamilyHelpRequest = {
      id: `FAM-${Date.now().toString().slice(-3)}`,
      title: requestText.trim(),
      assignedTo: selectedChild,
      category: 'Assistance',
      date: 'Just now',
      status: 'Pending',
      note: `${strings.requestSentFeedback} (${selectedChild})`,
    };

    setHelpRequests([newReq, ...helpRequests]);
    setRequestText('');
    setIsNewRequestOpen(false);
    showFeedback(`${strings.requestSentFeedback}: ${selectedChild}!`);
    speakText(`${strings.requestSentFeedback}: ${selectedChild}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
            {strings.familyCareBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1">
            {strings.parentFamilyTitle}
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.parentFamilySub}
          </p>
        </div>

        <button
          onClick={() => setIsNewRequestOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-2xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{strings.requestFamilyHelpBtn}</span>
        </button>
      </div>

      {/* 1. FAMILY MEMBERS CARDS (RAHUL & PRIYA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {familyMembers.map((member) => (
          <div
            key={member.name}
            className="p-5 sm:p-6 bg-white rounded-3xl border border-apple-border shadow-apple-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${member.avatarBg} font-black text-xl flex items-center justify-center shadow-sm shrink-0`}
                >
                  {member.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-apple-text-primary">
                      {member.name}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-apple-canvas text-apple-text-secondary border border-apple-border">
                      {member.relation}
                    </span>
                  </div>
                  <p className="text-xs text-apple-text-muted mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-apple-text-muted" />
                    {member.city}
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    ● {member.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-apple-border flex items-center justify-between">
              <span className="text-xs text-apple-text-muted">
                {strings.directLineBadge}: {member.lastSpoke}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showFeedback(`Calling ${member.name} (${member.phone})...`);
                    speakText(`Calling ${member.name}`);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{strings.callSonBtn}</span>
                </button>
                <button
                  onClick={() => {
                    showFeedback(`Opening message for ${member.name}...`);
                    speakText(`Opening chat with ${member.name}`);
                  }}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-apple-blue font-bold text-xs rounded-xl border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{strings.whatsappSonBtn}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ASK FAMILY FOR HELP SECTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
                {strings.activeFamilyRequestsTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-apple-text-muted mt-0.5">
              {strings.parentFamilySub}
            </p>
          </div>

          <button
            onClick={() => setIsNewRequestOpen(!isNewRequestOpen)}
            className="text-xs font-bold text-apple-blue hover:underline cursor-pointer"
          >
            {isNewRequestOpen ? strings.cancel : `+ ${strings.requestFamilyHelpBtn}`}
          </button>
        </div>

        {/* New Request Inline Form */}
        {isNewRequestOpen && (
          <form
            onSubmit={handleCreateRequest}
            className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3 animate-fadeIn"
          >
            <h4 className="text-sm font-bold text-apple-text-primary">
              {strings.sendRequestModalTitle}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  placeholder={strings.sendRequestPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-apple-border text-sm outline-none focus:border-apple-blue bg-white"
                  required
                />
              </div>
              <div>
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-apple-border text-sm font-semibold outline-none focus:border-apple-blue bg-white"
                >
                  <option value="Rahul Sharma">Rahul (Son)</option>
                  <option value="Priya Sharma">Priya (Daughter)</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewRequestOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-apple-text-secondary hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                {strings.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-apple-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{strings.sendBtn}</span>
              </button>
            </div>
          </form>
        )}

        {/* Requests List */}
        <div className="space-y-3">
          {helpRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl border border-apple-border bg-apple-canvas/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-apple-text-primary">
                    {req.title}
                  </h4>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Accepted'
                        ? 'bg-blue-100 text-blue-800'
                        : req.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status === 'Completed' ? strings.stepCompleted : req.status === 'Accepted' ? strings.stepAssigned : strings.filterPendingLabel}
                  </span>
                </div>
                <p className="text-xs text-apple-text-secondary">{req.note}</p>
                <div className="flex items-center gap-3 text-xs text-apple-text-muted pt-1">
                  <span>{strings.assignedToLabel}: <strong>{req.assignedTo}</strong></span>
                  <span>•</span>
                  <span>{req.date}</span>
                </div>
              </div>

              {req.status !== 'Completed' && (
                <button
                  onClick={() => {
                    setHelpRequests((prev) =>
                      prev.map((r) => (r.id === req.id ? { ...r, status: 'Completed' } : r))
                    );
                    showFeedback(`${strings.markedAsCompleted}: "${req.title}"`);
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 hover:border-emerald-300 border border-apple-border font-bold text-xs rounded-xl transition-all shrink-0 self-start sm:self-center cursor-pointer"
                >
                  {strings.stepCompleted}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentFamily;
