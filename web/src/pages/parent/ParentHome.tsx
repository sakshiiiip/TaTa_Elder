import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import {
  Volume2,
  Heart,
  Pill,
  Calendar,
  CreditCard,
  Mic,
  Stethoscope,
  Receipt,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Check,
  Smile,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface RoutineItem {
  id: string;
  time: string;
  category: 'medicine' | 'meal' | 'activity';
  completed: boolean;
}

export const ParentHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    bookedAppointment,
    speakText,
    showFeedback,
    currentLanguage,
  } = useSahaay();

  const strings = getStrings(currentLanguage);

  // Routine timeline items
  const [routineStatus, setRoutineStatus] = useState<Record<string, boolean>>({
    '1': true,
    '2': true,
    '3': true,
    '4': false,
    '5': false,
  });

  // Well-being check-in selection
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodMessage, setMoodMessage] = useState<string | null>(null);

  // Time-based greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return strings.goodMorning;
    if (hour < 17) return strings.goodAfternoon;
    return strings.goodEvening;
  };

  const currentDateFormatted = new Intl.DateTimeFormat(
    currentLanguage.includes('Hindi') || currentLanguage.includes('हिंदी')
      ? 'hi-IN'
      : currentLanguage.includes('Marathi') || currentLanguage.includes('मराठी')
      ? 'mr-IN'
      : currentLanguage.includes('Tamil') || currentLanguage.includes('தமிழ்')
      ? 'ta-IN'
      : currentLanguage.includes('Telugu') || currentLanguage.includes('తెలుగు')
      ? 'te-IN'
      : currentLanguage.includes('Bengali') || currentLanguage.includes('বাংলা')
      ? 'bn-IN'
      : 'en-IN',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(new Date());

  const displayName = (!userProfile.fullName || userProfile.fullName.includes('Ramesh')) ? 'Ashutosh Pandey' : userProfile.fullName;

  const routineItems: { id: string; time: string; title: string; category: 'medicine' | 'meal' | 'activity' }[] = [
    { id: '1', time: '08:30 AM', title: strings.routineMorningMed, category: 'medicine' },
    { id: '2', time: '09:00 AM', title: strings.routineBreakfast, category: 'meal' },
    { id: '3', time: '02:00 PM', title: strings.routineAfternoonMed, category: 'medicine' },
    { id: '4', time: '05:30 PM', title: strings.routineEveningWalk, category: 'activity' },
    { id: '5', time: '09:00 PM', title: strings.routineNightMed, category: 'medicine' },
  ];

  const handleReadGreeting = () => {
    const greetingText = `${getGreeting()}, ${displayName}. ${strings.dailyOverviewSub} ${strings.doctorCardTitle}.`;
    speakText(greetingText, true);
    showFeedback(strings.readingStatusAloud);
  };

  const handleToggleRoutine = (id: string, title: string) => {
    const nextState = !routineStatus[id];
    setRoutineStatus((prev) => ({ ...prev, [id]: nextState }));
    const feedbackText = nextState
      ? `${strings.markedAsCompleted}: "${title}"`
      : `${strings.markedAsPending}: "${title}"`;
    showFeedback(feedbackText);
    speakText(feedbackText);
  };

  const handleMoodSelect = (label: string, message: string) => {
    setSelectedMood(label);
    setMoodMessage(message);
    speakText(message, true);
    showFeedback(`${strings.checkInRecorded}: ${label}`);
  };

  const completedCount = Object.values(routineStatus).filter(Boolean).length;

  const moodOptions = [
    {
      label: strings.moodGreat,
      emoji: '😊',
      bg: 'hover:bg-emerald-50 hover:border-emerald-300',
      active: 'bg-emerald-50 border-emerald-400 text-emerald-800',
      msg: strings.moodGreatResponse,
    },
    {
      label: strings.moodGood,
      emoji: '🙂',
      bg: 'hover:bg-blue-50 hover:border-blue-300',
      active: 'bg-blue-50 border-blue-400 text-blue-800',
      msg: strings.moodGoodResponse,
    },
    {
      label: strings.moodOkay,
      emoji: '😐',
      bg: 'hover:bg-amber-50 hover:border-amber-300',
      active: 'bg-amber-50 border-amber-400 text-amber-800',
      msg: strings.moodOkayResponse,
    },
    {
      label: strings.moodNotWell,
      emoji: '😔',
      bg: 'hover:bg-rose-50 hover:border-rose-300',
      active: 'bg-rose-50 border-rose-400 text-rose-800',
      msg: strings.moodNotWellResponse,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-10">
      {/* 1. WELCOME / STATUS HEADER */}
      <section
        className="bg-white rounded-3xl p-5 sm:p-7 border border-apple-border shadow-apple-sm relative overflow-hidden"
        aria-label="Welcome & Daily Overview"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-apple-text-muted uppercase tracking-wider">
                {currentDateFormatted}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {strings.familyConnected}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight">
              {getGreeting()}, {displayName}
            </h1>
            <p className="text-sm sm:text-base text-apple-text-secondary max-w-xl">
              {strings.dailyOverviewSub}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReadGreeting}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-apple-blue font-bold text-sm rounded-2xl border border-blue-200 transition-all shadow-sm active:scale-95"
              title="Listen to today's summary"
            >
              <Volume2 className="w-5 h-5 text-apple-blue" />
              <span>{strings.readAloud}</span>
            </button>
            <button
              onClick={() => navigate('/parent/sahaay')}
              className="flex items-center gap-2 px-5 py-2.5 bg-apple-blue hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-apple transition-all active:scale-95"
            >
              <Mic className="w-5 h-5" />
              <span>{strings.speakToSahaay}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S QUICK ACTIONS (4 LARGE CARDS) */}
      <section aria-label="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Voice Assistant */}
          <button
            onClick={() => navigate('/parent/sahaay')}
            className="flex flex-col items-start p-4 sm:p-5 bg-white hover:bg-blue-50/50 rounded-3xl border border-apple-border shadow-apple-sm transition-all text-left group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-apple-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">{strings.navVoice}</span>
            <span className="text-base sm:text-lg font-bold text-apple-text-primary mt-0.5">{strings.navSahaay}</span>
            <span className="text-xs text-apple-text-muted mt-1">{strings.tapToSpeak}</span>
          </button>

          {/* Action 2: Health & Medicines */}
          <button
            onClick={() => navigate('/parent/health')}
            className="flex flex-col items-start p-4 sm:p-5 bg-white hover:bg-emerald-50/50 rounded-3xl border border-apple-border shadow-apple-sm transition-all text-left group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{strings.navHealth}</span>
            <span className="text-base sm:text-lg font-bold text-apple-text-primary mt-0.5">{strings.todaysMedicinesTitle}</span>
            <span className="text-xs text-apple-text-muted mt-1">{strings.allDosesOnTrack}</span>
          </button>

          {/* Action 3: Daily Life Assistance */}
          <button
            onClick={() => navigate('/parent/daily-life')}
            className="flex flex-col items-start p-4 sm:p-5 bg-white hover:bg-amber-50/50 rounded-3xl border border-apple-border shadow-apple-sm transition-all text-left group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">{strings.dailyConciergeBadge}</span>
            <span className="text-base sm:text-lg font-bold text-apple-text-primary mt-0.5">{strings.navDailyLife}</span>
            <span className="text-xs text-apple-text-muted mt-1">{strings.dailyLifeTitle}</span>
          </button>

          {/* Action 4: Emergency SOS */}
          <button
            onClick={() => navigate('/parent/emergency')}
            className="flex flex-col items-start p-4 sm:p-5 bg-red-50/60 hover:bg-red-100/70 rounded-3xl border border-red-200 shadow-apple-sm transition-all text-left group hover:scale-[1.02]"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">{strings.emergencySos}</span>
            <span className="text-base sm:text-lg font-bold text-red-700 mt-0.5">{strings.navSos}</span>
            <span className="text-xs text-red-600/80 mt-1">{strings.sosSubtitle}</span>
          </button>
        </div>
      </section>

      {/* 3. MAIN DASHBOARD SPLIT: ROUTINE CHECKLIST & UPCOMING PREVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Today's Routine Checklist */}
        <section className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-apple-blue" />
              <h2 className="text-lg font-bold text-apple-text-primary">{strings.todaysRoutineTitle}</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-apple-blue border border-blue-200">
              {completedCount} / {routineItems.length} {strings.routineDoneCount}
            </span>
          </div>

          <p className="text-xs text-apple-text-muted">
            {strings.dailyOverviewSub}
          </p>

          <div className="space-y-2.5 pt-1">
            {routineItems.map((item) => {
              const isDone = !!routineStatus[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleRoutine(item.id, item.title)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isDone
                      ? 'bg-gray-50/80 border-gray-200 text-apple-text-muted'
                      : 'bg-white border-apple-border hover:border-apple-blue text-apple-text-primary shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-gray-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <span
                        className={`text-sm font-semibold block ${
                          isDone ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-xs text-apple-text-muted">{item.time}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      item.category === 'medicine'
                        ? 'bg-purple-50 text-purple-700'
                        : item.category === 'meal'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {item.category === 'medicine' ? strings.navHealth : item.category === 'meal' ? strings.serviceCookingTitle : strings.serviceRepairsTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Column: Upcoming Previews & Family Quick Access */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preview 1: Doctor Appointment */}
          <div className="bg-white rounded-3xl p-5 border border-apple-border shadow-apple-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-apple-text-muted uppercase tracking-wider">
                {strings.upcomingAppointments}
              </span>
              <button
                onClick={() => navigate('/parent/health')}
                className="text-xs font-bold text-apple-blue hover:underline flex items-center gap-0.5"
              >
                {strings.viewDetails} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-apple-blue text-white flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-apple-text-primary">
                  {strings.doctorCardTitle}
                </h4>
                <p className="text-xs text-apple-text-secondary mt-0.5">
                  {strings.doctorCardSub}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 bg-white text-apple-blue rounded-md border border-blue-200">
                    {strings.vitalsNormalBadge}
                  </span>
                  <span className="text-[11px] text-apple-text-muted">{strings.familyConnected}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview 2: Pending Bill */}
          <div className="bg-white rounded-3xl p-5 border border-apple-border shadow-apple-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-apple-text-muted uppercase tracking-wider">
                {strings.totalPendingLabel}
              </span>
              <button
                onClick={() => navigate('/parent/payments')}
                className="text-xs font-bold text-apple-blue hover:underline flex items-center gap-0.5"
              >
                {strings.seeAll} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-apple-text-primary">{strings.pendingBillCardTitle}</h4>
                  <p className="text-xs text-amber-800">{strings.pendingBillCardSub}</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/parent/payments')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {strings.payNowBtn}
              </button>
            </div>
          </div>

          {/* Preview 3: Family Contacts Quick Dial */}
          <div className="bg-white rounded-3xl p-5 border border-apple-border shadow-apple-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-apple-text-muted uppercase tracking-wider">
                {strings.familyCareBadge}
              </span>
              <button
                onClick={() => navigate('/parent/family')}
                className="text-xs font-bold text-apple-blue hover:underline flex items-center gap-0.5"
              >
                {strings.navFamilyPortal} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-apple-canvas border border-apple-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-apple-blue font-bold text-xs flex items-center justify-center">
                    R
                  </div>
                  <div>
                    <div className="text-xs font-bold text-apple-text-primary">Rahul Sharma</div>
                    <div className="text-[10px] text-apple-text-muted">{strings.sonRelationLabel} • Pune</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      showFeedback('Calling Rahul Sharma (+91 98201 23456)...');
                      speakText('Calling Rahul Sharma');
                    }}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title={strings.callSonBtn}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate('/parent/family')}
                    className="p-2 rounded-xl bg-blue-50 text-apple-blue hover:bg-blue-100 transition-colors"
                    title={strings.whatsappSonBtn}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-apple-canvas border border-apple-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-apple-text-primary">Priya Sharma</div>
                    <div className="text-[10px] text-apple-text-muted">{strings.daughterRelationLabel} • Bengaluru</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      showFeedback('Calling Priya Sharma (+91 98450 78901)...');
                      speakText('Calling Priya Sharma');
                    }}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title={strings.callSonBtn}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate('/parent/family')}
                    className="p-2 rounded-xl bg-blue-50 text-apple-blue hover:bg-blue-100 transition-colors"
                    title={strings.whatsappSonBtn}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DAILY WELL-BEING CHECK-IN */}
      <section
        className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm"
        aria-label="Daily Well-Being Check-in"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-apple-text-primary">
              {strings.checkInTitle.replace('Ashutosh', displayName).replace('आशुतोष', displayName).replace('असुதோஷ்', displayName).replace('అశుతోష్', displayName).replace('আশুতোষ', displayName)}
            </h2>
          </div>
          <span className="text-xs text-apple-text-muted">{strings.checkInSubtitle}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moodOptions.map((item) => (
            <button
              key={item.label}
              onClick={() => handleMoodSelect(item.label, item.msg)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedMood === item.label
                  ? `${item.active} shadow-sm font-bold scale-[1.02]`
                  : `border-apple-border bg-apple-canvas/40 ${item.bg} text-apple-text-primary`
              }`}
            >
              <div className="text-3xl mb-1.5">{item.emoji}</div>
              <div className="text-sm font-bold">{item.label}</div>
            </button>
          ))}
        </div>

        {moodMessage && (
          <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-apple-blue text-sm font-medium flex items-center justify-between animate-fadeIn">
            <span>{moodMessage}</span>
            <button
              onClick={() => speakText(moodMessage, true)}
              className="p-1.5 hover:bg-blue-100 rounded-lg text-apple-blue"
              title="Replay message"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ParentHome;
