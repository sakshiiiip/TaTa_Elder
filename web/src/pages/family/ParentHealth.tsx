import React, { useState } from 'react';
import {
  Stethoscope,
  Heart,
  Pill,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  User,
  ShieldCheck,
  Plus,
  Phone,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const ParentHealth: React.FC = () => {
  const { showToast } = useFamily();

  const [medicines, setMedicines] = useState([
    {
      id: 'm1',
      name: 'Amlodipine 5mg',
      purpose: 'Blood Pressure regulation',
      timing: '08:30 AM (After breakfast)',
      slot: 'Morning',
      taken: true,
      takenAt: '8:30 AM',
    },
    {
      id: 'm2',
      name: 'Multivitamin & Zinc',
      purpose: 'General immunity & bone health',
      timing: '02:00 PM (After lunch)',
      slot: 'Afternoon',
      taken: true,
      takenAt: '2:05 PM',
    },
    {
      id: 'm3',
      name: 'Telmisartan 40mg',
      purpose: 'Cardiovascular maintenance',
      timing: '09:00 PM (Before bedtime)',
      slot: 'Night',
      taken: false,
      takenAt: null,
    },
  ]);

  const toggleMedicine = (id: string) => {
    setMedicines(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextState = !m.taken;
          showToast(`${m.name} marked as ${nextState ? 'taken' : 'pending'}`);
          return {
            ...m,
            taken: nextState,
            takenAt: nextState ? 'Just now' : null,
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-apple-blue text-xs font-bold rounded-full">
              🩺 Remote Health Tracker
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full">
              Stable Condition
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
            Parent Health & Medication
          </h1>
          <p className="text-sm text-apple-text-muted mt-1">
            Tracking Ashutosh Pandey’s daily prescriptions, appointments, and vitals from afar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-apple-canvas rounded-2xl p-3 border border-apple-border flex items-center gap-3">
            <Activity className="w-5 h-5 text-emerald-600" />
            <div>
              <div className="text-[11px] font-bold text-apple-text-muted">Today's BP</div>
              <div className="text-sm font-extrabold text-apple-text-primary">128 / 82 mmHg</div>
            </div>
          </div>
          <div className="bg-apple-canvas rounded-2xl p-3 border border-apple-border flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500" />
            <div>
              <div className="text-[11px] font-bold text-apple-text-muted">Heart Rate</div>
              <div className="text-sm font-extrabold text-apple-text-primary">72 bpm</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Today's Medicines & Schedule */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-apple-text-primary">Today’s Medicine Schedule</h2>
            <p className="text-xs text-apple-text-muted mt-0.5">
              Tap any medicine to manually update status if parent reports verbally.
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 self-start sm:self-auto">
            {medicines.filter(m => m.taken).length} of {medicines.length} Doses Taken
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {medicines.map((med) => (
            <div
              key={med.id}
              onClick={() => toggleMedicine(med.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                med.taken
                  ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-apple-border hover:border-apple-blue shadow-apple-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-apple-text-muted">
                    {med.slot} Dose
                  </span>
                  <div className="flex items-center gap-1.5">
                    {med.taken ? (
                      <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Taken
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      med.taken ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-apple-blue'
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-apple-text-primary leading-tight">
                      {med.name}
                    </h3>
                    <p className="text-xs text-apple-text-secondary mt-1">{med.purpose}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-apple-border/50 text-xs flex items-center justify-between text-apple-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {med.timing}
                </span>
                {med.taken && <span className="font-semibold text-emerald-700">{med.takenAt}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Upcoming Doctor Appointments & Records */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Appointment Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-apple-blue bg-blue-50 px-3 py-1 rounded-full">
                Upcoming Appointment
              </span>
              <span className="text-xs text-apple-text-muted font-semibold">Booked by Priya</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-apple-blue flex items-center justify-center shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-apple-text-primary">
                  Dr. Rajesh Mehta
                </h3>
                <p className="text-sm font-semibold text-apple-text-secondary">Senior Cardiologist (MD, DM)</p>
                <p className="text-xs text-apple-text-muted mt-1">Bandra Medical Center • 1.8 km from home</p>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-apple-canvas border border-apple-border grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-apple-text-muted block">Date & Time</span>
                <span className="font-bold text-apple-text-primary text-sm">4 Oct 2026 • 11:00 AM</span>
              </div>
              <div>
                <span className="text-apple-text-muted block">Consultation Type</span>
                <span className="font-bold text-apple-text-primary text-sm">In-Clinic Follow-up</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-apple-border flex items-center justify-between">
            <span className="text-xs text-apple-text-muted">Society driver auto-arranged</span>
            <button
              onClick={() => showToast('Clinic reminder SMS sent to Ashutosh')}
              className="text-xs font-bold text-apple-blue hover:underline cursor-pointer"
            >
              Send Reminder to Parent
            </button>
          </div>
        </div>

        {/* Emergency Medical Sheet */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-extrabold text-apple-text-primary">
                Emergency Health Profile
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-apple-canvas border border-apple-border/50">
                <span className="font-semibold text-apple-text-secondary">Blood Group</span>
                <span className="font-extrabold text-apple-text-primary text-sm">O Positive (O+)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-apple-canvas border border-apple-border/50">
                <span className="font-semibold text-apple-text-secondary">Known Allergies</span>
                <span className="font-bold text-red-600">Penicillin, Sulfa drugs</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-apple-canvas border border-apple-border/50">
                <span className="font-semibold text-apple-text-secondary">Chronic Conditions</span>
                <span className="font-bold text-apple-text-primary">Hypertension (controlled)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-apple-canvas border border-apple-border/50">
                <span className="font-semibold text-apple-text-secondary">Regular Pharmacy</span>
                <span className="font-bold text-apple-text-primary">Apollo Pharmacy Bandra (+91 98200 11223)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-apple-border">
            <button
              onClick={() => showToast('Emergency Medical Card downloaded as PDF')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-xs rounded-xl border border-apple-border transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-apple-blue" />
              <span>Download Emergency Medical Summary</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
