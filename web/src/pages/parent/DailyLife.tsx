import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import { DailyNeedModal } from '../../components/DailyNeedModal';
import {
  ShoppingBag,
  Utensils,
  Wrench,
  Sparkles,
  Pill,
  CheckCircle2,
  Clock,
  Plus,
  ChevronRight,
  Phone,
  UserCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface ActivePipelineRequest {
  id: string;
  category: 'Groceries' | 'Cooking' | 'Repairs' | 'Cleaning' | 'Medicine';
  title: string;
  details: string;
  requestedAt: string;
  status: 'Requested' | 'Assigned' | 'In Progress' | 'Completed';
  assignedTo: string;
  contactNumber: string;
  eta: string;
}

export const DailyLife: React.FC = () => {
  const { showFeedback, speakText, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('groceries');

  const [activeRequests, setActiveRequests] = useState<ActivePipelineRequest[]>([
    {
      id: 'REQ-802',
      category: 'Repairs',
      title: 'Kitchen Tap Leaking Repair',
      details: 'Plumber inspection & washer replacement',
      requestedAt: 'Today, 10:15 AM',
      status: 'Assigned',
      assignedTo: 'Sunil Verma (Verified Plumber)',
      contactNumber: '+91 98234 56789',
      eta: 'Today, 4:00 PM',
    },
    {
      id: 'REQ-801',
      category: 'Groceries',
      title: 'Weekly Fresh Produce & Milk',
      details: '2L Cow Milk, 1kg Apples, Whole Wheat Bread',
      requestedAt: 'Today, 8:30 AM',
      status: 'In Progress',
      assignedTo: 'Blinkit Senior Assist Partner',
      contactNumber: '+91 98901 12345',
      eta: 'Arriving in 15 mins',
    },
    {
      id: 'REQ-799',
      category: 'Cooking',
      title: 'Home-cooked Satvik Lunch Box',
      details: 'Low-salt moong dal, phulkas, bottle gourd sabzi',
      requestedAt: 'Yesterday, 6:00 PM',
      status: 'Completed',
      assignedTo: 'Annapurna Senior Kitchen',
      contactNumber: '+91 98220 54321',
      eta: 'Delivered at 1:15 PM',
    },
  ]);

  const pipelineSteps = [
    { key: 'Requested', label: strings.stepRequested },
    { key: 'Assigned', label: strings.stepAssigned },
    { key: 'In Progress', label: strings.stepInProgress },
    { key: 'Completed', label: strings.stepCompleted },
  ];

  const services = [
    {
      id: 'groceries',
      name: strings.serviceGroceriesTitle,
      icon: ShoppingBag,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-300',
      desc: strings.serviceGroceriesDesc,
      helper: 'Rahul (Son) can also review',
    },
    {
      id: 'cooking',
      name: strings.serviceCookingTitle,
      icon: Utensils,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'hover:border-amber-300',
      desc: strings.serviceCookingDesc,
      helper: 'Lunch & dinner tiffins',
    },
    {
      id: 'repair',
      name: strings.serviceRepairsTitle,
      icon: Wrench,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'hover:border-blue-300',
      desc: strings.serviceRepairsDesc,
      helper: 'Verified technicians',
    },
    {
      id: 'cleaning',
      name: strings.serviceCleaningTitle,
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'hover:border-purple-300',
      desc: strings.serviceCleaningDesc,
      helper: 'Senior-friendly assistance',
    },
  ];

  const handleOpenCategory = (catId: string) => {
    setSelectedCategory(catId);
    setIsModalOpen(true);
  };

  const getStepIndex = (status: string) => {
    const idx = pipelineSteps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <span className="text-xs font-semibold text-forms-orange uppercase tracking-wider">
            {strings.dailyConciergeBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1">
            {strings.dailyLifeTitle}
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.dailyLifeSub}
          </p>
        </div>

        <button
          onClick={() => handleOpenCategory('groceries')}
          className="flex items-center gap-2 px-5 py-2.5 bg-forms-orange hover:bg-orange-600 text-white font-bold text-sm rounded-2xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{strings.requestServiceBtn}</span>
        </button>
      </div>

      {/* 1. SERVICES CATALOG (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <button
              key={srv.id}
              onClick={() => handleOpenCategory(srv.id)}
              className={`p-4 sm:p-5 rounded-3xl bg-white border border-apple-border ${srv.border} shadow-apple-sm transition-all text-left flex flex-col justify-between group hover:scale-[1.02] cursor-pointer`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${srv.bg} ${srv.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-apple-text-primary mb-1">
                  {srv.name}
                </h3>
                <p className="text-xs text-apple-text-secondary leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-apple-border/60 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-apple-text-muted">
                  {srv.helper}
                </span>
                <span className="text-xs font-bold text-apple-blue flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  {strings.doctorBtn} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. REQUEST STATUS PIPELINE TRACKER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
              {strings.activeRequestsPipeline}
            </h2>
            <p className="text-xs sm:text-sm text-apple-text-muted">
              {pipelineSteps.map(s => s.label).join(' → ')}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-apple-blue rounded-full border border-blue-200">
            {activeRequests.filter((r) => r.status !== 'Completed').length} {strings.activeRequestsBadge}
          </span>
        </div>

        <div className="space-y-6">
          {activeRequests.map((req) => {
            const currentIdx = getStepIndex(req.status);
            return (
              <div
                key={req.id}
                className="p-5 rounded-2xl border border-apple-border bg-apple-canvas/40 space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-apple-border text-apple-text-primary">
                      {req.id}
                    </span>
                    <h3 className="font-bold text-base text-apple-text-primary">
                      {req.title}
                    </h3>
                  </div>
                  <span className="text-xs text-apple-text-muted">
                    {req.requestedAt}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-apple-text-secondary">
                  {req.details}
                </p>

                {/* 4-Stage Status Pipeline */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {pipelineSteps.map((step, stepIdx) => {
                      const isPastOrCurrent = stepIdx <= currentIdx;
                      const isCurrent = stepIdx === currentIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCurrent
                                ? 'bg-apple-blue text-white ring-4 ring-blue-100 scale-110 shadow-sm'
                                : isPastOrCurrent
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {isPastOrCurrent && !isCurrent ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              stepIdx + 1
                            )}
                          </div>
                          <span
                            className={`text-xs font-semibold mt-1.5 ${
                              isCurrent
                                ? 'text-apple-blue font-bold'
                                : isPastOrCurrent
                                ? 'text-apple-text-primary'
                                : 'text-gray-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned partner & ETA */}
                <div className="pt-3 border-t border-apple-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-semibold text-apple-text-primary">
                      <UserCheck className="w-4 h-4 text-apple-blue" />
                      <span>{req.assignedTo}</span>
                    </div>
                    <span className="text-apple-text-muted">•</span>
                    <div className="flex items-center gap-1 text-apple-text-secondary font-medium">
                      <Clock className="w-3.5 h-3.5 text-apple-blue" />
                      <span>{req.eta}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        showFeedback(`Calling ${req.assignedTo} (${req.contactNumber})...`);
                        speakText(`Calling ${req.assignedTo}`);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-apple-border text-apple-text-primary font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-apple-blue" />
                      <span>{strings.callSonBtn}</span>
                    </button>
                    {req.status !== 'Completed' && (
                      <button
                        onClick={() => {
                          setActiveRequests((prev) =>
                            prev.map((r) => (r.id === req.id ? { ...r, status: 'Completed' } : r))
                          );
                          showFeedback(`${strings.markedAsCompleted}: ${req.title}`);
                          speakText(`${strings.markedAsCompleted}: ${req.title}`);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        {strings.stepCompleted}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Need Modal */}
      <DailyNeedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCategory={selectedCategory}
      />
    </div>
  );
};

export default DailyLife;
