import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  CalendarCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMessageModal } from '../../components/FamilyMessageModal';

export const FamilyOverview: React.FC = () => {
  const {
    checkInCompleted,
    toggleCheckIn,
    bills,
    dailyRequests,
    familyTasks,
    showToast,
  } = useFamily();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalMode, setMessageModalMode] = useState<'message' | 'voice' | 'call'>('call');

  const pendingBills = bills.filter(b => b.status === 'Pending');
  const activeRequests = dailyRequests.filter(r => r.statusType !== 'completed');
  const pendingTasks = familyTasks.filter(t => t.status !== 'Completed');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header & Location Context */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-apple-blue-light text-apple-blue text-xs font-bold rounded-full">
                📍 Supporting Ashutosh from Pune
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                Mumbai • 148 km away
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-800 text-xs font-bold rounded-full">
                👥 Priya co-supporting from Bengaluru
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
              Good morning, Rahul 👋
            </h1>
            <p className="text-sm sm:text-base text-apple-text-muted mt-1">
              Here’s your parent’s daily summary at a glance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setMessageModalMode('call');
                setIsMessageModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-sm rounded-2xl shadow-apple-sm transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Ashutosh</span>
            </button>
            <button
              onClick={() => {
                setMessageModalMode('message');
                setIsMessageModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-sm rounded-2xl border border-apple-border transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-apple-blue" />
              <span>Message</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Main 5-Second Status Card & Smart Check-in */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Parent Current Status */}
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Status
              </span>
              <span className="text-xs text-apple-text-muted font-medium">
                Last check-in: {checkInCompleted ? 'Today, 9:02 AM' : 'Pending'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
              {checkInCompleted ? 'Ashutosh is doing well' : 'Morning check-in pending'}
            </h2>
            <p className="text-sm sm:text-base text-apple-text-secondary mt-2 leading-relaxed">
              {checkInCompleted
                ? 'Ashutosh completed his morning voice check-in and said: "I am feeling good and took my morning medicine."'
                : 'Ashutosh has not checked in yet this morning. You can send a friendly reminder or place a quick call.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-5 mt-4 border-t border-emerald-200/60">
            <button
              onClick={() => {
                setMessageModalMode('call');
                setIsMessageModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Parent</span>
            </button>
            <button
              onClick={toggleCheckIn}
              className="text-xs text-apple-text-muted hover:text-apple-blue font-semibold underline underline-offset-2 ml-auto cursor-pointer"
            >
              Test: {checkInCompleted ? 'Simulate Missed' : 'Simulate Completed'}
            </button>
          </div>
        </div>

        {/* Emergency Quick Badge */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-apple-text-muted uppercase tracking-wider">
                Emergency & Safety
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-apple-text-primary">All Clear</h3>
                <p className="text-xs text-apple-text-muted">No active SOS alerts</p>
              </div>
            </div>
            <p className="text-xs text-apple-text-secondary leading-relaxed mt-2">
              Bandra West home verified. Mumbai 108 Ambulance & Elderline 14567 on standby.
            </p>
          </div>

          <Link
            to="/family/emergency"
            className="mt-4 flex items-center justify-between px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-2xl font-bold text-xs transition-colors"
          >
            <span>Open Emergency Center</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Quick Overview Grid: Health, Pending Requests & Payments */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quick Health Summary */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-apple-blue flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-apple-text-primary">Parent Health</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                2/3 Taken
              </span>
            </div>

            <p className="text-xs text-apple-text-muted mb-3">Daily medicine schedule & doctor visits</p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-apple-canvas">
                <span className="font-semibold text-apple-text-primary">Morning Medicine</span>
                <span className="text-emerald-600 font-bold">✓ Taken (8:30 AM)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-apple-canvas">
                <span className="font-semibold text-apple-text-primary">Next Doctor</span>
                <span className="text-apple-blue font-bold">Dr. Mehta (4 Oct)</span>
              </div>
            </div>
          </div>

          <Link
            to="/family/health"
            className="mt-4 flex items-center justify-between text-xs font-bold text-apple-blue hover:text-apple-blue-dark pt-3 border-t border-apple-border group"
          >
            <span>View Complete Health Tracker</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-apple-text-primary">Daily Life</h3>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                {activeRequests.length} Active
              </span>
            </div>

            <p className="text-xs text-apple-text-muted mb-3">Groceries, repairs, and daily care</p>

            <div className="space-y-2 text-xs">
              {dailyRequests.slice(0, 2).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-2 rounded-xl bg-apple-canvas">
                  <span className="font-semibold text-apple-text-primary truncate max-w-[140px]">
                    {req.title}
                  </span>
                  <span className="text-amber-800 font-bold text-[11px]">{req.status}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/family/daily-life"
            className="mt-4 flex items-center justify-between text-xs font-bold text-apple-blue hover:text-apple-blue-dark pt-3 border-t border-apple-border group"
          >
            <span>Manage Daily Life Requests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-bills-green flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-apple-text-primary">Payments</h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                  pendingBills.length > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {pendingBills.length > 0 ? `${pendingBills.length} Pending` : 'All Paid'}
              </span>
            </div>

            <p className="text-xs text-apple-text-muted mb-3">Remote utility bill management</p>

            <div className="space-y-2 text-xs">
              {bills.slice(0, 2).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-2 rounded-xl bg-apple-canvas">
                  <span className="font-semibold text-apple-text-primary truncate max-w-[140px]">
                    {bill.title}
                  </span>
                  <span
                    className={`font-bold ${
                      bill.status === 'Pending' ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    ₹{bill.amount} ({bill.status})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/family/payments"
            className="mt-4 flex items-center justify-between text-xs font-bold text-apple-blue hover:text-apple-blue-dark pt-3 border-t border-apple-border group"
          >
            <span>Open Payments & Pay Bills</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. Recent Activity Log */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-extrabold text-apple-text-primary">Recent Activity</h3>
            <p className="text-xs text-apple-text-muted mt-0.5">Timeline of recent caregiver and check-in events</p>
          </div>
          <Link
            to="/family/notifications"
            className="text-xs font-bold text-apple-blue hover:underline"
          >
            View all alerts
          </Link>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-apple-canvas border border-apple-border/50">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-apple-text-primary">Morning check-in confirmed</span>
                <span className="text-[11px] text-apple-text-muted">Today, 9:02 AM</span>
              </div>
              <p className="text-xs text-apple-text-secondary mt-0.5">
                Ashutosh spoke to Sahaay voice assistant and rated mood as Energetic 😊
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-apple-canvas border border-apple-border/50">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-apple-blue flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              💊
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-apple-text-primary">Morning medicine logged</span>
                <span className="text-[11px] text-apple-text-muted">Today, 8:30 AM</span>
              </div>
              <p className="text-xs text-apple-text-secondary mt-0.5">
                Amlodipine 5mg taken with warm water as scheduled.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-apple-canvas border border-apple-border/50">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
              🛒
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-apple-text-primary">Grocery request submitted</span>
                <span className="text-[11px] text-apple-text-muted">Yesterday, 8:40 PM</span>
              </div>
              <p className="text-xs text-apple-text-secondary mt-0.5">
                Ashutosh requested dairy milk and fresh vegetables via voice assistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Message Modal */}
      <FamilyMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        initialMode={messageModalMode}
      />
    </div>
  );
};
