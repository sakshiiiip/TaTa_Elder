import React, { useState } from 'react';
import { X, AlertTriangle, Phone, ShieldAlert, MapPin, Building, CheckCircle2 } from 'lucide-react';

interface EmergencySupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmergencyCall: (target: string) => void;
}

export const EmergencySupportModal: React.FC<EmergencySupportModalProps> = ({
  isOpen,
  onClose,
  onEmergencyCall,
}) => {
  const [alertDispatched, setAlertDispatched] = useState(false);

  if (!isOpen) return null;

  const contacts = [
    {
      title: '108 Medical Ambulance (Mumbai)',
      subtitle: 'Government emergency response unit (Bandra station)',
      number: '108',
      type: 'medical',
    },
    {
      title: 'National Senior Helpline (Elderline)',
      subtitle: 'Ministry of Social Justice 24x7 senior support',
      number: '14567',
      type: 'elderline',
    },
    {
      title: 'Building Security & Guard',
      subtitle: 'Shanti Sadan Apartments, Bandra West',
      number: '+91 98200 11223',
      type: 'society',
    },
    {
      title: 'Mumbai Police Control Room',
      subtitle: 'Bandra Police Station',
      number: '100',
      type: 'police',
    },
  ];

  const handleDispatchEscalation = () => {
    setAlertDispatched(true);
    setTimeout(() => {
      setAlertDispatched(false);
      onEmergencyCall('Local Mumbai Support & Building Security');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-support-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sos-red text-white flex items-center justify-center shadow-md">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 id="emergency-support-title" className="text-xl font-extrabold text-rose-950">
                Emergency Support Escalation
              </h2>
              <p className="text-xs text-rose-700">
                Remote Mumbai Crisis Assistance for Ashutosh Pandey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-apple-text-muted transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {alertDispatched ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950">Dispatched Local Alert</h3>
            <p className="text-sm text-emerald-800">
              Building security and local medical support notified with address: Flat 402, Bandra West, Mumbai.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Parent Location Banner */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-apple-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-apple-text-secondary">
                <MapPin className="w-4 h-4 text-sos-red shrink-0" />
                <span>Flat 402, Shanti Sadan, Bandra West, Mumbai, MH</span>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">GPS Active</span>
            </div>

            {/* Quick Emergency Contacts */}
            <div className="space-y-2">
              {contacts.map((contact, idx) => (
                <button
                  key={idx}
                  onClick={() => onEmergencyCall(contact.title)}
                  className="w-full p-3.5 bg-white hover:bg-rose-50/70 border border-apple-border hover:border-rose-300 rounded-2xl flex items-center justify-between text-left transition-all group shadow-apple-sm"
                >
                  <div>
                    <h4 className="font-bold text-sm text-apple-text-primary group-hover:text-rose-700">
                      {contact.title}
                    </h4>
                    <p className="text-xs text-apple-text-muted">{contact.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-sm">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contact.number}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Remote Dispatch Button */}
            <div className="pt-2">
              <button
                onClick={handleDispatchEscalation}
                className="w-full py-3.5 bg-sos-red hover:bg-red-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5" />
                Dispatch Immediate In-Person Check
              </button>
              <p className="text-[11px] text-center text-apple-text-muted mt-2">
                Sends high-priority call to building security and alerts sister Priya in Bengaluru.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
