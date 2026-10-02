import React, { useState, useEffect } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { MicrophoneHeroButton } from '../components/MicrophoneHeroButton';
import { DoctorAppointmentModal } from '../components/DoctorAppointmentModal';
import { BillSelectionModal } from '../components/BillSelectionModal';
import { BillPaymentModal } from '../components/BillPaymentModal';
import { PensionFormScreen } from '../components/PensionFormScreen';
import { ProfileModal } from '../components/ProfileModal';
import { EmergencySosModal } from '../components/EmergencySosModal';
import { FamilyContactModal } from '../components/FamilyContactModal';
import { DailyNeedModal } from '../components/DailyNeedModal';
import { WakeWordBadge } from '../components/WakeWordBadge';
import { BillCategoryType } from '../types';
import {
  Volume2,
  Heart,
  Pill,
  Calendar,
  CreditCard,
  Mic,
  Stethoscope,
  Receipt,
  ShoppingCart,
  Wrench,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Check,
  Smile,
  Utensils,
  BellRing,
  ArrowUpRight,
} from 'lucide-react';

interface RoutineItem {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  category: 'medicine' | 'meal' | 'activity';
}

export const HomeScreen: React.FC = () => {
  const {
    userProfile,
    bookedAppointment,
    voiceState,
    startListening,
    speakText,
    setCurrentTab,
    currentLanguage,
    showFeedback,
  } = useSahaay();

  const strings = getStrings(currentLanguage);

  // Modals state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isBillSelectionModalOpen, setIsBillSelectionModalOpen] = useState(false);
  const [isBillPaymentModalOpen, setIsBillPaymentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BillCategoryType>('ELECTRICITY');
  const [isPensionModalOpen, setIsPensionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [familyModalDefaultTab, setFamilyModalDefaultTab] = useState<'call' | 'message' | 'help'>('call');
  const [isDailyNeedModalOpen, setIsDailyNeedModalOpen] = useState(false);
  const [dailyNeedCategory, setDailyNeedCategory] = useState<string>('groceries');

  // Routine timeline items
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([
    { id: '1', time: '08:30 AM', title: 'Morning medicine (Amlodipine)', completed: true, category: 'medicine' },
    { id: '2', time: '09:00 AM', title: 'Breakfast & warm water', completed: true, category: 'meal' },
    { id: '3', time: '02:00 PM', title: 'Afternoon medicine (Multivitamin)', completed: true, category: 'medicine' },
    { id: '4', time: '05:30 PM', title: 'Evening walk in garden', completed: false, category: 'activity' },
    { id: '5', time: '09:00 PM', title: 'Night medicine (Blood pressure)', completed: false, category: 'medicine' },
  ]);

  // Well-being check-in selection
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodMessage, setMoodMessage] = useState<string | null>(null);

  // Alert dismissed state
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Time-based greeting calculation
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const handleHeroMicClick = () => {
    setCurrentTab(1);
    startListening();
  };

  const handleBillSelect = (type: BillCategoryType) => {
    setSelectedCategory(type);
    setIsBillPaymentModalOpen(true);
  };

  const handleReadGreeting = () => {
    const greetingText = `${getGreeting()}, ${userProfile.fullName}. Here is your day at a glance. You are doing well today.`;
    speakText(greetingText, true);
  };

  const toggleRoutineItem = (id: string) => {
    setRoutineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState) {
            speakText(`Great! Marked ${item.title} as completed.`, true);
          }
          return { ...item, completed: nextState };
        }
        return item;
      })
    );
  };

  const handleMoodSelect = (mood: string, label: string) => {
    setSelectedMood(mood);
    if (mood === 'good' || mood === 'okay') {
      const msg = `Wonderful to hear you are feeling ${label} today, ${userProfile.fullName.split(' ')[0]}!`;
      setMoodMessage(msg);
      speakText(msg, true);
    } else {
      const msg = `Thank you for sharing. We're here for you. Would you like to call Rahul or Priya?`;
      setMoodMessage(msg);
      speakText(msg, true);
    }
  };

  const completedMedicines = routineItems.filter((i) => i.category === 'medicine' && i.completed).length;
  const totalMedicines = routineItems.filter((i) => i.category === 'medicine').length;

  return (
    <div className="w-full pb-28 md:pb-16 animate-fade-in space-y-6 sm:space-y-8">
      {/* =========================================================================
          1. WELCOME / STATUS HEADER
          ========================================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 bg-apple-blue-light text-apple-blue text-xs font-bold rounded-full">
                📅 {currentDateFormatted}
              </span>
              <WakeWordBadge
                isListening={voiceState.kind === 'Listening' || voiceState.kind === 'PartialResult'}
                onClick={() => setCurrentTab(1)}
              />
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-apple-text-primary tracking-tight">
                {getGreeting()}, {userProfile.fullName}
              </h1>
              <button
                onClick={handleReadGreeting}
                className="p-2 rounded-full hover:bg-apple-blue-light text-apple-blue transition-colors cursor-pointer"
                title="Listen to daily summary"
                aria-label="Listen to daily summary"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <p className="text-base sm:text-lg text-apple-text-secondary font-medium mt-1">
              Here's your day at a glance.
            </p>
          </div>

          {/* Simple status indicator pill: 🟢 "You're doing well today" */}
          <div className="self-start md:self-auto flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-emerald-900 text-sm sm:text-base">
              You're doing well today
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. IMPORTANT ALERTS (CALM, CLEAR, ACTIONABLE)
          ========================================================================= */}
      {!isAlertDismissed && (
        <section aria-label="Important Alerts">
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-apple-sm transition-all">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-amber-950 text-base">
                    Electricity Bill Due in 3 Days
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-xs font-bold rounded-md">
                    ₹1,450
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                  Adani Electricity bill is due on 02 Oct. No rush, you have plenty of time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
              <button
                onClick={() => handleBillSelect('ELECTRICITY')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all active:scale-95"
              >
                Pay ₹1,450 Now
              </button>
              <button
                onClick={() => setIsAlertDismissed(true)}
                className="px-3.5 py-2.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          2. TODAY'S OVERVIEW (4 KEY METRICS - HIGH CONTRAST & READABLE)
          ========================================================================= */}
      <section id="section-overview" aria-label="Today's Overview">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-apple-blue" />
              Today's Overview
            </h2>
            <span className="text-xs text-apple-text-muted font-medium">Updated just now</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. Health */}
            <div
              onClick={() => setIsDoctorModalOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200/70 hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-rose-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  Health
                </span>
                <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-emerald-700 flex items-center gap-1">
                  <Check className="w-5 h-5 stroke-[3]" />
                  Good
                </div>
                <p className="text-xs text-apple-text-muted mt-0.5">Vitals steady & normal</p>
              </div>
            </div>

            {/* 2. Medicines */}
            <div
              onClick={() => {
                const el = document.getElementById('section-routine');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/70 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-blue-900 flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-apple-blue" />
                  Medicines
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-apple-blue group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-apple-blue">
                  {completedMedicines}/{totalMedicines} completed
                </div>
                <p className="text-xs text-apple-text-muted mt-0.5">Next dose at 9:00 PM</p>
              </div>
            </div>

            {/* 3. Appointments */}
            <div
              onClick={() => setIsDoctorModalOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200/70 hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-purple-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Appointment
                </span>
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-base sm:text-lg font-extrabold text-purple-950">
                  Tomorrow, 5:00 PM
                </div>
                <p className="text-xs text-apple-text-muted mt-0.5">Dr. Sharma (Cardiology)</p>
              </div>
            </div>

            {/* 4. Payments */}
            <div
              onClick={() => setIsBillSelectionModalOpen(true)}
              className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/70 hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  Payments
                </span>
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-lg sm:text-xl font-extrabold text-amber-700">
                  1 pending
                </div>
                <p className="text-xs text-apple-text-muted mt-0.5">Electricity bill (₹1,450)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          VOICE ASSISTANT HERO BANNER (VOICE FIRST IDENTITY PRESERVED)
          ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-600 via-primary to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-apple-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2.5">
            <Mic className="w-3.5 h-3.5" /> Voice Assistant Ready
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ask Sahaay Anything
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-1.5 leading-relaxed">
            Tap the blue button or speak naturally. Say "Check my medicines", "Book a doctor", or "Call my son".
          </p>
          <div className="mt-3.5 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold text-blue-200">
            <span className="px-2.5 py-1 bg-white/10 rounded-lg">✓ Speaks Hindi & English</span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg">✓ Patient & Slow Cadence</span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <MicrophoneHeroButton onClick={handleHeroMicClick} />
        </div>
      </section>

      {/* =========================================================================
          3. QUICK ACTIONS (6 LARGE ELDERLY-FRIENDLY CARDS)
          ========================================================================= */}
      <section aria-label="Quick Actions">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xl font-bold text-apple-text-primary">
            Quick Actions
          </h2>
          <span className="text-xs text-apple-text-muted font-medium">Large 1-tap buttons</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* 1. Ask Sahaay */}
          <button
            onClick={() => {
              setCurrentTab(1);
              startListening();
            }}
            className="p-4 sm:p-5 bg-white hover:bg-blue-50/70 border border-apple-border hover:border-apple-blue rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-apple-sm hover:shadow-apple-md group active:scale-95 cursor-pointer min-h-[125px]"
          >
            <div className="w-13 h-13 rounded-2xl bg-blue-100 text-apple-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">Ask Sahaay</h3>
              <p className="text-[11px] text-apple-text-muted mt-0.5">Voice Help</p>
            </div>
          </button>

          {/* 2. Doctor Appointment */}
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="p-4 sm:p-5 bg-white hover:bg-sky-50/70 border border-apple-border hover:border-sky-300 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-apple-sm hover:shadow-apple-md group active:scale-95 cursor-pointer min-h-[125px]"
          >
            <div className="w-13 h-13 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">Doctor</h3>
              <p className="text-[11px] text-apple-text-muted mt-0.5">Book Clinic Visit</p>
            </div>
          </button>

          {/* 3. Pay Bill */}
          <button
            onClick={() => setIsBillSelectionModalOpen(true)}
            className="p-4 sm:p-5 bg-white hover:bg-emerald-50/70 border border-apple-border hover:border-emerald-300 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-apple-sm hover:shadow-apple-md group active:scale-95 cursor-pointer min-h-[125px]"
          >
            <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">Pay Bill</h3>
              <p className="text-[11px] text-apple-text-muted mt-0.5">Light, Water, Mobile</p>
            </div>
          </button>

          {/* 4. Groceries */}
          <button
            onClick={() => {
              setDailyNeedCategory('groceries');
              setIsDailyNeedModalOpen(true);
            }}
            className="p-4 sm:p-5 bg-white hover:bg-amber-50/70 border border-apple-border hover:border-amber-300 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-apple-sm hover:shadow-apple-md group active:scale-95 cursor-pointer min-h-[125px]"
          >
            <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">Groceries</h3>
              <p className="text-[11px] text-apple-text-muted mt-0.5">Vegetables & Milk</p>
            </div>
          </button>

          {/* 5. Request Repair */}
          <button
            onClick={() => {
              setDailyNeedCategory('repair');
              setIsDailyNeedModalOpen(true);
            }}
            className="p-4 sm:p-5 bg-white hover:bg-indigo-50/70 border border-apple-border hover:border-indigo-300 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-apple-sm hover:shadow-apple-md group active:scale-95 cursor-pointer min-h-[125px]"
          >
            <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">Repair</h3>
              <p className="text-[11px] text-apple-text-muted mt-0.5">Fan, Tap & Electric</p>
            </div>
          </button>

          {/* 6. Contact Family */}
          <button
            onClick={() => {
              setFamilyModalDefaultTab('call');
              setIsFamilyModalOpen(true);
            }}
            className="p-4 sm:p-5 bg-white hover:bg-rose-50/70 border border-apple-border hover:border-rose-300 rounded-3xl flex flex-col items-center justify-center text-center gap-3 transition-all shadow-apple-sm hover:shadow-apple-md group active:scale-95 cursor-pointer min-h-[125px]"
          >
            <div className="w-13 h-13 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">Family</h3>
              <p className="text-[11px] text-apple-text-muted mt-0.5">Rahul & Priya</p>
            </div>
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. TODAY'S ROUTINE & 5. UPCOMING (TWO-COLUMN SECTION)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Today's Routine (7 cols) */}
        <section id="section-routine" className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-apple-text-primary">
                  Today's Routine
                </h2>
                <p className="text-xs text-apple-text-muted mt-0.5">
                  Your gentle reminders • Tap to mark done
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-apple-blue-light text-apple-blue rounded-full">
                {routineItems.filter((i) => i.completed).length} of {routineItems.length} done
              </span>
            </div>

            <div className="space-y-2.5">
              {routineItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleRoutineItem(item.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer select-none ${
                    item.completed
                      ? 'bg-gray-50/80 border-gray-200 text-apple-text-muted'
                      : 'bg-white hover:bg-blue-50/50 border-apple-border hover:border-apple-blue text-apple-text-primary shadow-apple-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        item.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-apple-border hover:border-apple-blue text-transparent'
                      }`}
                      aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div>
                      <h3
                        className={`font-bold text-sm sm:text-base ${
                          item.completed ? 'line-through text-gray-500 font-semibold' : 'text-apple-text-primary'
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-apple-text-muted">{item.time}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      item.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-50 text-apple-blue'
                    }`}
                  >
                    {item.completed ? 'Done ✓' : 'Pending ○'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Upcoming Important Events (5 cols) */}
        <section id="section-upcoming" className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-apple-text-primary">
                  Upcoming
                </h2>
                <span className="text-xs text-apple-text-muted font-medium">Next commitments</span>
              </div>

              <div className="space-y-3">
                {/* 1. Doctor Appointment */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5" /> Doctor Visit
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-200 text-sky-900">
                      Tomorrow • 5:00 PM
                    </span>
                  </div>
                  <h4 className="font-bold text-sky-950 text-base mt-2">
                    Cardiologist Appointment
                  </h4>
                  <p className="text-xs text-sky-800 mt-0.5">
                    Bandra Medical Clinic (Dr. Sharma)
                  </p>
                  <button
                    onClick={() => setIsDoctorModalOpen(true)}
                    className="mt-3 w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    View Appointment Details
                  </button>
                </div>

                {/* 2. Medicine Reminder */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-apple-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-apple-text-secondary flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-apple-blue" /> Night Medicine
                    </span>
                    <span className="font-semibold text-apple-text-muted">Today • 9:00 PM</span>
                  </div>
                  <p className="font-bold text-sm text-apple-text-primary mt-1">
                    Amlodipine (5mg) with warm water
                  </p>
                </div>

                {/* 3. Bill Due Date */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-apple-border flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" /> Utility Bill
                    </span>
                    <p className="font-bold text-sm text-apple-text-primary mt-0.5">
                      Adani Electricity • ₹1,450
                    </p>
                    <span className="text-[11px] text-apple-text-muted">Due 02 Oct (in 3 days)</span>
                  </div>
                  <button
                    onClick={() => handleBillSelect('ELECTRICITY')}
                    className="px-3 py-1.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Pay
                  </button>
                </div>

                {/* 4. Family Call Reminder */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-apple-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-800 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-600" /> Family Call
                    </span>
                    <span className="font-semibold text-apple-text-muted">Sunday • 7:00 PM</span>
                  </div>
                  <p className="font-bold text-sm text-apple-text-primary mt-1">
                    Weekly video call with Rahul & kids
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          6. DAILY NEEDS & 7. FAMILY CONNECTION (TWO-COLUMN SECTION)
          ========================================================================= */}
      <div id="section-daily-life" className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Daily Needs (6 cols) */}
        <section className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h2 className="text-xl font-bold text-apple-text-primary whitespace-nowrap">
                    Daily Needs
                  </h2>
                  <p className="text-xs text-apple-text-muted mt-0.5 whitespace-nowrap">Everyday home requests</p>
                </div>
                <button
                  onClick={() => setIsDailyNeedModalOpen(true)}
                  className="px-3.5 py-1.5 bg-apple-blue-light text-apple-blue hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0"
                >
                  + New Request
                </button>
              </div>

              {/* Category Quick Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mb-4">
                {[
                  { id: 'groceries', label: '🛒 Groceries' },
                  { id: 'cooking', label: '🍲 Cooking / Food' },
                  { id: 'repair', label: '🔧 Repair' },
                  { id: 'cleaning', label: '🧹 Cleaning' },
                  { id: 'medicine', label: '💊 Medicine' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setDailyNeedCategory(item.id);
                      setIsDailyNeedModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-apple-text-primary font-semibold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Recent/Pending Request Card */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    🔧 Home Maintenance
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-200/80 text-amber-900">
                    Waiting for confirmation
                  </span>
                </div>
                <h4 className="font-bold text-amber-950 text-base mt-1.5">
                  Fan repair requested
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Electrician Sunil is scheduled for tomorrow at 11:00 AM.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-apple-border flex items-center justify-between text-xs text-apple-text-muted">
              <span>Need help ordering lunch or fixing a tap?</span>
              <button
                onClick={() => setIsDailyNeedModalOpen(true)}
                className="text-apple-blue font-bold hover:underline"
              >
                Request Help →
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Family Connection (6 cols) */}
        <section id="section-family" className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h2 className="text-xl font-bold text-apple-text-primary">
                    Your Family
                  </h2>
                  <p className="text-xs text-apple-text-muted mt-0.5">Warm & close connection</p>
                </div>
                <span className="text-xs text-apple-text-muted">
                  Last call: Yesterday, 8:30 PM
                </span>
              </div>

              {/* Family Members List */}
              <div className="space-y-2.5 mb-4">
                {/* Priya */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-apple-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-extrabold flex items-center justify-center text-sm">
                      P
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-apple-text-primary">Priya</h4>
                      <p className="text-xs text-apple-text-muted">Daughter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-emerald-700">Available</span>
                  </div>
                </div>

                {/* Rahul */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-apple-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm">
                      R
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-apple-text-primary">Rahul</h4>
                      <p className="text-xs text-apple-text-muted">Son (Emergency Contact)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-bold text-amber-700">Busy</span>
                  </div>
                </div>
              </div>

              {/* 3 Clear Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setFamilyModalDefaultTab('call');
                    setIsFamilyModalOpen(true);
                  }}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Family
                </button>
                <button
                  onClick={() => {
                    setFamilyModalDefaultTab('message');
                    setIsFamilyModalOpen(true);
                  }}
                  className="py-2.5 px-3 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setFamilyModalDefaultTab('help');
                    setIsFamilyModalOpen(true);
                  }}
                  className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Request Help
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          8. WELL-BEING CHECK-IN (EMOTIONAL & NON-DIAGNOSTIC)
          ========================================================================= */}
      <section aria-label="Well-Being Check-In">
        <div className="bg-gradient-to-r from-blue-50/70 via-purple-50/50 to-rose-50/60 rounded-3xl p-5 sm:p-7 border border-apple-border shadow-apple-sm">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-bold text-apple-text-primary">
              How are you feeling today, {userProfile.fullName || 'Ashutosh Pandey'}?
            </h2>
            <p className="text-xs sm:text-sm text-apple-text-secondary mt-1">
              Tap an option to share your day with your family
            </p>

            {/* Emoji Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { id: 'good', label: 'Good', emoji: '😊', bg: 'hover:bg-emerald-50 hover:border-emerald-300' },
                { id: 'okay', label: 'Okay', emoji: '🙂', bg: 'hover:bg-blue-50 hover:border-blue-300' },
                { id: 'not_great', label: 'Not great', emoji: '😐', bg: 'hover:bg-amber-50 hover:border-amber-300' },
                { id: 'low', label: 'Low', emoji: '😔', bg: 'hover:bg-rose-50 hover:border-rose-300' },
              ].map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id, mood.label)}
                    className={`py-3.5 px-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-white border-apple-blue ring-2 ring-apple-blue/20 shadow-apple-sm scale-105 font-bold'
                        : `bg-white border-apple-border ${mood.bg} font-semibold text-apple-text-primary`
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-sm">{mood.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Friendly Response / Sub-action */}
            {moodMessage && (
              <div className="mt-4 p-4 bg-white rounded-2xl border border-apple-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-apple-sm">
                <p className="text-xs sm:text-sm font-semibold text-apple-text-primary">
                  {moodMessage}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-apple-text-muted">Want to talk to someone?</span>
                  <button
                    onClick={() => {
                      setFamilyModalDefaultTab('call');
                      setIsFamilyModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Call Family
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HEALTHCARE REASSURANCE (DOCTOR CLINIC SUMMARY & VERIFICATION)
          ========================================================================= */}
      <section id="section-health" className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-apple-text-primary">
                Verified Senior Healthcare & Doctor Network
              </h3>
              <p className="text-xs sm:text-sm text-apple-text-secondary mt-0.5 max-w-2xl">
                Dr. Sharma (Cardiologist) and Bandra Clinic are connected to your health profile. Prescriptions and lab records are securely organized.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="px-5 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
            >
              Doctor Appointments
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODALS & DIALOGS
          ========================================================================= */}
      <DoctorAppointmentModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />

      <BillSelectionModal
        isOpen={isBillSelectionModalOpen}
        onClose={() => setIsBillSelectionModalOpen(false)}
        onSelectCategory={handleBillSelect}
      />

      <BillPaymentModal
        isOpen={isBillPaymentModalOpen}
        onClose={() => setIsBillPaymentModalOpen(false)}
        category={selectedCategory}
      />

      <PensionFormScreen
        isOpen={isPensionModalOpen}
        onClose={() => setIsPensionModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      <FamilyContactModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        defaultAction={familyModalDefaultTab}
      />

      <DailyNeedModal
        isOpen={isDailyNeedModalOpen}
        onClose={() => setIsDailyNeedModalOpen(false)}
        initialCategory={dailyNeedCategory}
      />
    </div>
  );
};
