import React, { useEffect, useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { Phone, AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, speakText, stopSpeaking, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);
  const [countdown, setCountdown] = useState<number>(3);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !isTriggered) {
      setCountdown(3);
      speakText(`${strings.sosTitle}. ${strings.callingIn} 3.`, true);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTriggered(true);
            speakText(`${strings.callingNow}: ${userProfile.emergencyContactName}.`, true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancel = () => {
    stopSpeaking();
    setIsTriggered(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-sos-red overflow-hidden p-6 md:p-8 text-center animate-scale-up">
        {/* Pulsing Alert Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <AlertTriangle className="w-12 h-12 text-sos-red relative z-10" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          {strings.sosTitle}
        </h2>
        <p className="text-base text-gray-600 mb-6">
          {strings.sosSubtitle}
        </p>

        {!isTriggered ? (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-sos-red block mb-1">
              {strings.callingIn}
            </span>
            <span className="text-6xl font-extrabold text-sos-red tabular-nums">
              {countdown}
            </span>
            <p className="text-sm font-medium text-red-700 mt-2">
              {userProfile.emergencyContactName} ({userProfile.emergencyContactPhone})
            </p>
          </div>
        ) : (
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200 mb-6">
            <div className="flex items-center justify-center gap-2 text-green-700 font-bold text-lg mb-2">
              <Phone className="w-5 h-5 animate-bounce" />
              {strings.callingNow}
            </div>
            <p className="text-xl font-bold text-gray-900">{userProfile.emergencyContactName}</p>
            <p className="text-sm font-semibold text-gray-600">{userProfile.emergencyContactPhone}</p>
            
            <a
              href={`tel:${userProfile.emergencyContactPhone}`}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-sos-red hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              {strings.sosBtn}
            </a>
          </div>
        )}

        {/* National Elder Helpline */}
        <div className="flex items-center justify-between p-3.5 bg-gray-100 rounded-xl mb-6 text-left">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">{strings.nationalElderHelpline}</p>
              <p className="text-base font-bold text-gray-900">14567</p>
            </div>
          </div>
          <a
            href="tel:14567"
            className="px-3.5 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            14567
          </a>
        </div>

        {/* Action Controls */}
        <button
          onClick={handleCancel}
          className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 text-base transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
          {strings.cancelAlert}
        </button>
      </div>
    </div>
  );
};
