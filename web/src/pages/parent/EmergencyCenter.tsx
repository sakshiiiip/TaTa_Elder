import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import {
  AlertTriangle,
  Phone,
  ShieldAlert,
  Users,
  Heart,
  MapPin,
  CheckCircle2,
  Clock,
  Volume2,
  XCircle,
} from 'lucide-react';

export const EmergencyCenter: React.FC = () => {
  const { userProfile, showFeedback, speakText, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [sosActive, setSosActive] = useState(false);

  const handleTriggerSOS = () => {
    setSosActive(true);
    showFeedback(`${strings.emergencyPageDispatched}: Calling 108 & Alerting Family!`);
    speakText(`${strings.emergencyPageDispatched}. ${strings.emergencyPageDispatchedSub}`, true);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
    showFeedback(strings.cancelAlert);
    speakText(strings.cancelAlert, true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* 1. LARGE EMERGENCY SOS HERO */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-apple-lg text-center space-y-6 ${
          sosActive
            ? 'bg-red-600 text-white border-red-700 animate-pulse'
            : 'bg-white border-red-300'
        }`}
      >
        <div className="flex flex-col items-center">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg transition-transform ${
              sosActive
                ? 'bg-white text-red-600 scale-110'
                : 'bg-red-500 text-white hover:scale-105'
            }`}
          >
            <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
          </div>

          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight mt-4 ${
              sosActive ? 'text-white' : 'text-red-700'
            }`}
          >
            {sosActive ? strings.emergencyPageDispatched : strings.emergencyPageQuestion}
          </h1>
          <p
            className={`text-sm sm:text-base max-w-lg mt-1 font-medium ${
              sosActive ? 'text-red-100' : 'text-apple-text-secondary'
            }`}
          >
            {sosActive
              ? strings.emergencyPageDispatchedSub
              : strings.emergencyPageSub}
          </p>
        </div>

        {/* SOS Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          {!sosActive ? (
            <button
              onClick={handleTriggerSOS}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-6 h-6" />
              <span>{strings.triggerSosBtnLabel}</span>
            </button>
          ) : (
            <button
              onClick={handleCancelSOS}
              className="w-full py-3.5 px-6 bg-white hover:bg-gray-100 text-red-700 font-black text-base rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <XCircle className="w-5 h-5 text-red-600" />
              <span>{strings.cancelSosBtnLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DIRECT EMERGENCY DIAL HOTLINES */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-4">
        <h2 className="font-bold text-lg text-apple-text-primary flex items-center gap-2">
          <Phone className="w-5 h-5 text-apple-blue" />
          <span>{strings.emergencyLinesTitle}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => {
              showFeedback('Calling 108 Ambulance...');
              speakText('Calling 108 Ambulance');
            }}
            className="p-4 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-left transition-all group cursor-pointer"
          >
            <div className="text-2xl font-black text-red-700">108</div>
            <div className="font-bold text-sm text-red-900 mt-0.5">{strings.medicalAmbulance108}</div>
            <div className="text-xs text-red-600/90 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> 108
            </div>
          </button>

          <button
            onClick={() => {
              showFeedback('Calling 112 National Emergency...');
              speakText('Calling 112');
            }}
            className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition-all group cursor-pointer"
          >
            <div className="text-2xl font-black text-apple-blue">112</div>
            <div className="font-bold text-sm text-blue-900 mt-0.5">{strings.nationalEmergency112}</div>
            <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> 112
            </div>
          </button>

          <button
            onClick={() => {
              showFeedback('Calling 14567 Elder Helpline...');
              speakText('Calling 14567 Elderline');
            }}
            className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition-all group cursor-pointer"
          >
            <div className="text-2xl font-black text-emerald-700">14567</div>
            <div className="font-bold text-sm text-emerald-900 mt-0.5">{strings.elderHelpline14567}</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> 14567
            </div>
          </button>
        </div>
      </div>

      {/* 3. EMERGENCY FAMILY CONTACTS */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-4">
        <h2 className="font-bold text-lg text-apple-text-primary flex items-center gap-2">
          <Users className="w-5 h-5 text-rose-500" />
          <span>{strings.familyCareBadge}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-apple-border bg-apple-canvas/40 flex items-center justify-between">
            <div>
              <div className="font-bold text-base text-apple-text-primary">Rahul Sharma ({strings.sonRelationLabel})</div>
              <div className="text-xs text-apple-text-muted">{strings.emergencyContactTitle} • Pune</div>
              <div className="text-xs font-semibold text-apple-text-secondary mt-1">+91 98201 23456</div>
            </div>
            <button
              onClick={() => {
                showFeedback('Calling Rahul Sharma (+91 98201 23456)...');
                speakText('Calling Rahul Sharma');
              }}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Call Rahul"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-apple-border bg-apple-canvas/40 flex items-center justify-between">
            <div>
              <div className="font-bold text-base text-apple-text-primary">Priya Sharma ({strings.daughterRelationLabel})</div>
              <div className="text-xs text-apple-text-muted">{strings.emergencyContactTitle} • Bengaluru</div>
              <div className="text-xs font-semibold text-apple-text-secondary mt-1">+91 98450 78901</div>
            </div>
            <button
              onClick={() => {
                showFeedback('Calling Priya Sharma (+91 98450 78901)...');
                speakText('Calling Priya Sharma');
              }}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              title="Call Priya"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. EMERGENCY MEDICAL PASSPORT */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-3">
        <h2 className="font-bold text-lg text-apple-text-primary flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <span>{strings.emergencyMedicalSummary}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-apple-canvas border border-apple-border">
            <span className="text-apple-text-muted block">{strings.bloodGroupLabel.split(':')[0]}</span>
            <span className="text-base font-bold text-apple-text-primary mt-0.5 block">O Positive (O+)</span>
          </div>
          <div className="p-3 rounded-xl bg-apple-canvas border border-apple-border">
            <span className="text-apple-text-muted block">{strings.allergiesLabel.split(':')[0]}</span>
            <span className="text-base font-bold text-apple-text-primary mt-0.5 block">Penicillin (Severe)</span>
          </div>
          <div className="p-3 rounded-xl bg-apple-canvas border border-apple-border">
            <span className="text-apple-text-muted block">Doctor</span>
            <span className="text-base font-bold text-apple-text-primary mt-0.5 block">Dr. Sharma (Cardio)</span>
          </div>
          <div className="p-3 rounded-xl bg-apple-canvas border border-apple-border">
            <span className="text-apple-text-muted block">Hospital</span>
            <span className="text-base font-bold text-apple-text-primary mt-0.5 block">Apollo Hospital Bandra</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCenter;
