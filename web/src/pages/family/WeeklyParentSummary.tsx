import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  CalendarCheck,
  Pill,
  Stethoscope,
  Smile,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CreditCard,
  ShoppingBag,
  Wrench,
  Clock,
  ShieldCheck,
  Check,
  Sun,
  Coffee,
  Footprints,
} from 'lucide-react';

export const WeeklyParentSummary: React.FC = () => {
  const navigate = useNavigate();
  const currentParent = { name: 'Ashutosh Pandey', age: 74, location: 'Bandra West, Mumbai' };
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePayBill = () => {
    navigate('/family/payments');
  };

  const handleBookDoctor = () => {
    navigate('/family/appointments');
  };

  const handleArrangeGrocery = () => {
    navigate('/family/daily-life');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-apple-text-primary text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-apple-lg flex items-center gap-2.5 animate-slide-up border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-apple-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>Supportive Family Insights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Weekly Parent Summary
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              A simple overview of how your parent is doing this week. Designed with love and respect — keeping you connected without surveillance.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shrink-0 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-apple-blue font-extrabold text-lg flex items-center justify-center shadow-sm">
              {currentParent.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">
                {currentParent.name}
              </div>
              <div className="text-xs text-blue-100">
                Week: 24 Sep – 30 Sep 2026
              </div>
              <div className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Status: Doing Well</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Grid: 4 Core Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Well-being Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-apple-text-muted">
                Well-being
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-emerald-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xl sm:text-2xl font-extrabold text-apple-text-primary">
                  Doing well
                </span>
              </div>
              <p className="text-xs text-apple-text-muted mt-1">
                Overall health and comfort stable
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-apple-border/70 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-apple-text-muted font-medium">Smart Check-ins:</span>
              <span className="font-extrabold text-apple-text-primary">6 / 7 completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-apple-text-muted font-medium">Last check-in:</span>
              <span className="font-semibold text-emerald-700">Today, 9:02 AM</span>
            </div>
          </div>
        </div>

        {/* 2. Health & Medicines Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-apple-text-muted">
                Health & Care
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-apple-blue flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-extrabold text-apple-text-primary">
                  19 / 21
                </span>
                <span className="text-xs font-bold text-apple-blue">
                  90.5% adherence
                </span>
              </div>
              <p className="text-xs text-apple-text-muted mt-1">
                Prescribed doses taken on schedule
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-apple-border/70 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-apple-text-muted font-medium">Medicines:</span>
              <span className="font-extrabold text-apple-text-primary">19 / 21 completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-apple-text-muted font-medium">Appointments:</span>
              <span className="font-semibold text-apple-blue">1 completed, 1 upcoming</span>
            </div>
          </div>
        </div>

        {/* 3. Daily Routine Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-apple-text-muted">
                Daily Routine
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-apple-text-primary">
                Consistent
              </div>
              <p className="text-xs text-apple-text-muted mt-1">
                Healthy circadian rhythm and active habits
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-apple-border/70 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>Morning routine</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>Meals & Hydration</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>Medicines taken</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
              <span>Evening walk</span>
            </div>
          </div>
        </div>

        {/* 4. Mood & Emotional Tone Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-apple-text-muted">
                Mood & Tone
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Smile className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">😊</span>
                <span className="text-xl sm:text-2xl font-extrabold text-apple-text-primary">
                  Good
                </span>
              </div>
              <p className="text-xs text-apple-text-muted mt-1">
                Positive spirits during check-in calls
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-apple-border/70 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-apple-text-muted font-medium">😊 Good:</span>
              <span className="font-extrabold text-apple-text-primary">5 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-apple-text-muted font-medium">🙂 Okay:</span>
              <span className="font-bold text-apple-text-secondary">2 days</span>
            </div>
            <p className="text-[11px] text-purple-700 font-medium italic pt-1">
              &ldquo;Your parent has generally been feeling good this week.&rdquo;
            </p>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MIDDLE ROW: DAILY LIFE ACCOMPLISHMENTS & THINGS NEEDING ATTENTION
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Life Completed Items */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-apple-text-primary">
                  Daily Life Support
                </h3>
                <p className="text-xs text-apple-text-muted">
                  Assistance provided and completed this week
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Item 1: Grocery Request */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-apple-canvas/70 border border-apple-border/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-apple-text-primary">
                    Grocery Request
                  </div>
                  <div className="text-xs text-apple-text-muted">
                    Fresh fruits, milk & whole wheat flour
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Completed ✓
              </span>
            </div>

            {/* Item 2: Home Repair */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-apple-canvas/70 border border-apple-border/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-apple-blue flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-apple-text-primary">
                    Home Repair
                  </div>
                  <div className="text-xs text-apple-text-muted">
                    Bathroom light repair & switch inspection
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Completed ✓
              </span>
            </div>

            {/* Item 3: Electricity Bill */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-apple-canvas/70 border border-apple-border/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-apple-text-primary">
                    Electricity Bill (Previous Cycle)
                  </div>
                  <div className="text-xs text-apple-text-muted">
                    Adani Electricity Bandra • ₹2,450
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Paid ✓
              </span>
            </div>
          </div>
        </div>

        {/* Things Needing Attention */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-apple-text-primary">
                  Things Needing Attention
                </h3>
                <p className="text-xs text-apple-text-muted">
                  Important pending items only — family action recommended
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              3 items
            </span>
          </div>

          <div className="space-y-3">
            {/* Attention Item 1 */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0 animate-ping" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-amber-950 flex items-center justify-between">
                  <span>Electricity bill due tomorrow</span>
                  <span className="text-xs font-extrabold text-amber-700">₹2,840</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  Adani Electricity Mumbai — due 1 Oct. Family can pay directly with 1 tap.
                </p>
              </div>
            </div>

            {/* Attention Item 2 */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-amber-950 flex items-center justify-between">
                  <span>Doctor follow-up needs booking</span>
                  <span className="text-xs font-extrabold text-apple-blue">Cardiology</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  Dr. Sharma recommended a blood pressure review appointment in early October.
                </p>
              </div>
            </div>

            {/* Attention Item 3 */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-amber-950 flex items-center justify-between">
                  <span>Grocery request waiting for confirmation</span>
                  <span className="text-xs font-extrabold text-purple-700">Kitchen</span>
                </div>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  Parent requested monthly grains & cooking oil delivery via Blinkit Senior Care.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 3: FAMILY ACTION BUTTONS
          ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-lg text-apple-text-primary">
            Quick Family Actions
          </h3>
          <p className="text-xs text-apple-text-muted">
            Resolve pending parent needs with a single click
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Action 1: Pay Electricity Bill */}
          <button
            onClick={handlePayBill}
            className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-apple-sm hover:shadow-apple-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="block leading-tight">Pay Electricity Bill</span>
                <span className="text-[11px] text-amber-100 font-semibold">₹2,840 Due Tomorrow</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 2: Book Doctor Appointment */}
          <button
            onClick={handleBookDoctor}
            className="p-4 rounded-2xl bg-apple-blue hover:bg-blue-600 text-white font-extrabold text-sm shadow-apple-sm hover:shadow-apple-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <span className="block leading-tight">Book Doctor Appointment</span>
                <span className="text-[11px] text-blue-100 font-semibold">Dr. Sharma Cardiology</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 3: Arrange Grocery Delivery */}
          <button
            onClick={handleArrangeGrocery}
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-apple-sm hover:shadow-apple-md transition-all flex items-center justify-between gap-3 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="block leading-tight">Arrange Grocery Delivery</span>
                <span className="text-[11px] text-emerald-100 font-semibold">Confirm Blinkit Request</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
