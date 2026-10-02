import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import { DoctorAppointmentModal } from '../../components/DoctorAppointmentModal';
import {
  Stethoscope,
  Heart,
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Activity,
  Droplet,
  ChevronRight,
  ShieldCheck,
  Check,
  Phone,
  MapPin,
} from 'lucide-react';

interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Night';
  time: string;
  taken: boolean;
  instruction: string;
}

export const ParentHealth: React.FC = () => {
  const { bookedAppointment, showFeedback, speakText, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 'med-1',
      name: 'Amlodipine Besylate',
      dosage: '5mg (1 tablet)',
      timeSlot: 'Morning',
      time: '08:30 AM',
      taken: true,
      instruction: 'Take after breakfast with warm water',
    },
    {
      id: 'med-2',
      name: 'Multivitamin Complex (Becosules)',
      dosage: '1 capsule',
      timeSlot: 'Afternoon',
      time: '02:00 PM',
      taken: true,
      instruction: 'Take after lunch',
    },
    {
      id: 'med-3',
      name: 'Telmisartan (Micardis)',
      dosage: '40mg (1 tablet)',
      timeSlot: 'Night',
      time: '09:00 PM',
      taken: false,
      instruction: 'Take 30 mins before sleep. Keep water nearby.',
    },
  ]);

  const handleToggleMedicine = (id: string) => {
    setMedicines((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          const next = !med.taken;
          showFeedback(next ? `${strings.markedTakenFeedback}: ${med.name}` : `${strings.markedAsPending}: ${med.name}`);
          if (next) speakText(`${strings.markedTakenFeedback}: ${med.name}`);
          return { ...med, taken: next };
        }
        return med;
      })
    );
  };

  const takenCount = medicines.filter((m) => m.taken).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-doctor-blue uppercase tracking-wider">
              {strings.healthTrackerBadge}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {strings.vitalsNormalBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1">
            {strings.parentHealthTitle}
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.parentHealthSub}
          </p>
        </div>

        <button
          onClick={() => setIsDoctorModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-doctor-blue hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>{strings.bookAppointmentBtn}</span>
        </button>
      </div>

      {/* 1. VITALS OVERVIEW (4 HIGH-CONTRAST CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-apple-border shadow-apple-sm">
          <div className="flex items-center justify-between text-apple-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{strings.vitalBloodPressure}</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-apple-text-primary">125 / 82</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{strings.vitalsNormalBadge}</span>
            <span className="text-[11px] text-apple-text-muted">Today 8:00 AM</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-apple-border shadow-apple-sm">
          <div className="flex items-center justify-between text-apple-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{strings.vitalBloodSugar}</span>
            <Droplet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-apple-text-primary">110 <span className="text-xs text-apple-text-muted font-normal">mg/dL</span></div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Fasting OK</span>
            <span className="text-[11px] text-apple-text-muted">Yesterday</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-apple-border shadow-apple-sm">
          <div className="flex items-center justify-between text-apple-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{strings.vitalHeartRate}</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-apple-text-primary">72 <span className="text-xs text-apple-text-muted font-normal">bpm</span></div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Steady</span>
            <span className="text-[11px] text-apple-text-muted">Resting</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-apple-border shadow-apple-sm">
          <div className="flex items-center justify-between text-apple-text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">SpO2</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-apple-text-primary">98%</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Optimal</span>
            <span className="text-[11px] text-apple-text-muted">Room Air</span>
          </div>
        </div>
      </div>

      {/* 2. DOCTOR APPOINTMENTS SECTION */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-doctor-blue" />
            <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
              {strings.doctorCardTitle}
            </h2>
          </div>
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="text-xs font-bold text-doctor-blue hover:underline cursor-pointer"
          >
            {strings.bookAppointmentBtn}
          </button>
        </div>

        {/* Appointment Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-doctor-blue text-white flex items-center justify-center shrink-0 shadow-sm">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-apple-text-primary">
                  Dr. Sharma
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-doctor-blue">
                  {bookedAppointment?.specialty || 'Senior Cardiologist'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-apple-text-secondary mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-doctor-blue" />
                  Tomorrow • 5:00 PM
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-doctor-blue" />
                  Apollo Clinic, Bandra West
                </span>
              </p>
              <p className="text-xs text-apple-text-muted mt-1">
                {strings.doctorCardSub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                showFeedback('Calling Apollo Clinic (+91 22 2640 1234)...');
                speakText('Calling Apollo Clinic');
              }}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-apple-text-primary font-bold text-xs rounded-xl border border-apple-border transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{strings.doctorBtn}</span>
            </button>
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="px-4 py-2 bg-doctor-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {strings.viewDetails}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MEDICINE SCHEDULE */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
              {strings.todaysMedicinesTitle} ({takenCount}/{medicines.length})
            </h2>
          </div>
          <span className="text-xs font-bold text-apple-text-muted">
            {strings.allDosesOnTrack}
          </span>
        </div>

        <div className="space-y-3">
          {medicines.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                med.taken
                  ? 'bg-gray-50/80 border-gray-200'
                  : 'bg-white border-apple-border hover:border-purple-300 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => handleToggleMedicine(med.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 mt-0.5 cursor-pointer ${
                    med.taken
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-gray-300 hover:border-purple-500'
                  }`}
                  title={med.taken ? strings.markedAsPending : strings.markTaken}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-bold ${med.taken ? 'line-through text-gray-500' : 'text-apple-text-primary'}`}>
                      {med.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                      {med.dosage}
                    </span>
                  </div>
                  <p className="text-xs text-apple-text-muted mt-0.5">
                    {med.instruction}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pl-10 sm:pl-0">
                <span className="text-xs font-bold text-apple-text-secondary flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-apple-text-muted" />
                  {med.timeSlot === 'Morning' ? strings.goodMorning : med.timeSlot === 'Afternoon' ? strings.goodAfternoon : strings.goodEvening} • {med.time}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    med.taken
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}
                >
                  {med.taken ? strings.stepCompleted : strings.filterPendingLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Refill Alert Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-amber-900">
              Prescription Refill: Telmisartan (Micardis) (4 days remaining).
            </span>
          </div>
          <button
            onClick={() => {
              showFeedback('Refill request sent to Apollo Pharmacy & Rahul.');
              speakText('Refill request sent to Apollo Pharmacy');
            }}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            {strings.doctorBtn}
          </button>
        </div>
      </div>

      {/* Appointment Modal */}
      <DoctorAppointmentModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />
    </div>
  );
};

export default ParentHealth;
