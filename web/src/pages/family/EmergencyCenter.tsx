import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  AlertTriangle,
  MapPin,
  Clock,
  Heart,
  Users,
  ExternalLink,
  ChevronRight,
  Ambulance,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { EmergencySupportModal } from '../../components/EmergencySupportModal';
import { FamilyMessageModal } from '../../components/FamilyMessageModal';

export const EmergencyCenter: React.FC = () => {
  const { showToast } = useFamily();
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const emergencyContacts = [
    {
      role: 'Primary Emergency Contact',
      name: 'Rahul Sharma (Son)',
      phone: '+91 98765 43210',
      relation: 'Pune (148 km away)',
      status: 'Ready / Primary',
    },
    {
      role: 'Secondary Emergency Contact',
      name: 'Priya Sharma (Daughter)',
      phone: '+91 98765 24680',
      relation: 'Bengaluru (980 km away)',
      status: 'Standby',
    },
    {
      role: 'Immediate Physical Responder',
      name: 'Shanti Kunj Society Security Gate',
      phone: '+91 98200 44556',
      relation: 'Building Gate • 2 min away',
      status: 'On Duty 24/7',
    },
    {
      role: 'Trusted Neighbor',
      name: 'Mr. Arvind Joshi (Flat 401)',
      phone: '+91 98199 77889',
      relation: 'Next Door neighbor',
      status: 'Has Spare Key',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* 1. Emergency Status Banner */}
      <section className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-white rounded-3xl p-6 sm:p-7 border border-emerald-300 shadow-apple-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
                Emergency Status: Normal
              </h1>
            </div>
            <p className="text-sm text-apple-text-secondary mt-1">
              No active distress signals. Ashutosh's tablet and fall-detection sensors are fully operational.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-xs sm:text-sm rounded-xl border border-apple-border transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Parent</span>
          </button>
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sos-red hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Emergency Escalation</span>
          </button>
        </div>
      </section>

      {/* 2. Parent Location & Medical Summary for First Responders */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-apple-text-muted">
                Physical Residence & GPS Dispatch
              </span>
              <span className="text-xs font-bold text-apple-blue bg-blue-50 px-2.5 py-1 rounded-lg">
                Verified Address
              </span>
            </div>

            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-apple-blue flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-apple-text-primary">
                  Flat 402, Shanti Kunj Apartments
                </h3>
                <p className="text-sm text-apple-text-secondary mt-0.5">
                  14th Road, Off Khar-Danda Road, Bandra West, Mumbai, MH 400050
                </p>
                <p className="text-xs text-apple-text-muted mt-1">
                  Landmark: Opposite Joggers Park, 2nd Gate
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-apple-canvas border border-apple-border text-xs">
              <div>
                <span className="text-apple-text-muted block font-medium">Nearest Hospital</span>
                <span className="font-bold text-apple-text-primary mt-0.5 block">Lilavati Hospital (2.1 km)</span>
              </div>
              <div>
                <span className="text-apple-text-muted block font-medium">Blood Group</span>
                <span className="font-bold text-apple-text-primary mt-0.5 block">O Positive (O+)</span>
              </div>
              <div>
                <span className="text-apple-text-muted block font-medium">Known Allergies</span>
                <span className="font-bold text-red-600 mt-0.5 block">Penicillin, Sulfa</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-apple-border flex items-center justify-between text-xs">
            <span className="text-apple-text-muted">Building elevator active • Stretcher accessible</span>
            <button
              onClick={() => showToast('GPS coordinates shared via SMS to family')}
              className="font-bold text-apple-blue hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Share Location Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* National Helplines Box */}
        <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-apple-text-primary mb-1">
              National Emergency Hotlines
            </h3>
            <p className="text-xs text-apple-text-muted mb-4">Direct governmental & medical lines</p>

            <div className="space-y-3">
              <a
                href="tel:108"
                className="flex items-center justify-between p-3 rounded-2xl bg-red-50/70 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <div>
                  <div className="font-extrabold text-xs text-red-700">108 Medical Ambulance</div>
                  <div className="text-[11px] text-red-600">Mumbai Central Dispatch</div>
                </div>
                <Phone className="w-4 h-4 text-red-700" />
              </a>

              <a
                href="tel:14567"
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <div>
                  <div className="font-extrabold text-xs text-apple-blue">14567 Elderline Helpline</div>
                  <div className="text-[11px] text-apple-blue/80">Govt of India Senior Care</div>
                </div>
                <Phone className="w-4 h-4 text-apple-blue" />
              </a>

              <a
                href="tel:100"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-apple-border transition-colors"
              >
                <div>
                  <div className="font-extrabold text-xs text-apple-text-primary">100 Police Assistance</div>
                  <div className="text-[11px] text-apple-text-muted">Bandra Police Station</div>
                </div>
                <Phone className="w-4 h-4 text-apple-text-secondary" />
              </a>
            </div>
          </div>

          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="mt-4 w-full py-2.5 bg-apple-canvas hover:bg-gray-200 rounded-xl text-xs font-bold text-apple-text-primary border border-apple-border transition-colors cursor-pointer"
          >
            View Full Protocol
          </button>
        </div>
      </section>

      {/* 3. Emergency Contacts Directory */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <h3 className="text-lg font-extrabold text-apple-text-primary mb-1">
          Authorized Emergency Contacts
        </h3>
        <p className="text-xs text-apple-text-muted mb-5">
          First responders called sequentially in the event of an SOS activation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-apple-canvas border border-apple-border flex items-start justify-between gap-3"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-apple-text-muted block">
                  {contact.role}
                </span>
                <h4 className="font-extrabold text-sm text-apple-text-primary mt-0.5">
                  {contact.name}
                </h4>
                <p className="text-xs text-apple-blue font-semibold mt-0.5">{contact.phone}</p>
                <p className="text-[11px] text-apple-text-muted mt-0.5">{contact.relation}</p>
              </div>

              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="w-9 h-9 rounded-xl bg-white hover:bg-apple-blue-light text-apple-blue flex items-center justify-center border border-apple-border shadow-xs transition-colors shrink-0"
                title={`Call ${contact.name}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SOS History Log */}
      <section className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm">
        <h3 className="text-lg font-extrabold text-apple-text-primary mb-1">Recent SOS History</h3>
        <p className="text-xs text-apple-text-muted mb-4">Verified incident logs from Sahaay emergency engine.</p>

        <div className="p-4 rounded-2xl bg-apple-canvas border border-apple-border/70 text-xs flex items-center justify-between text-apple-text-secondary">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold">No emergency events logged in the past 90 days.</span>
          </div>
          <span className="text-apple-text-muted">Last drill tested: 15 August 2026</span>
        </div>
      </section>

      {/* Emergency Support Modal */}
      <EmergencySupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onEmergencyCall={(target) => showToast(`Emergency line triggered: ${target}`)}
      />

      {/* Call Parent Modal */}
      <FamilyMessageModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        initialMode="call"
      />
    </div>
  );
};
