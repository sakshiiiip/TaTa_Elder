import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings, LANGUAGES } from '../../localization/strings';
import { ProfileModal } from '../../components/ProfileModal';
import {
  User,
  Globe,
  Volume2,
  Bell,
  Lock,
  LogOut,
  Shield,
  Eye,
  Check,
  Moon,
} from 'lucide-react';

export const ParentSettings: React.FC = () => {
  const navigate = useNavigate();
  const {
    userProfile,
    currentLanguage,
    setLanguage,
    settings,
    updateSettings,
    speakText,
    setSpeechRate,
    showFeedback,
  } = useSahaay();

  const strings = getStrings(currentLanguage);

  const displayName = (!userProfile.fullName || userProfile.fullName.includes('Ramesh')) ? 'Ashutosh Pandey' : userProfile.fullName;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [familySyncEnabled, setFamilySyncEnabled] = useState(true);

  const handleSpeedChange = (speed: 'slow' | 'normal' | 'fast', rate: number) => {
    setSelectedSpeed(speed);
    setSpeechRate(rate);
    const label = speed === 'slow' ? strings.speedSlowLabel : speed === 'fast' ? strings.speedFastLabel : strings.speedNormalLabel;
    showFeedback(`${strings.voiceSpeedHeader}: ${label}`);
    speakText(`${strings.voiceSpeedHeader}: ${label}`);
  };

  const handleLogout = () => {
    showFeedback(strings.logoutBtn);
    navigate('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
            {strings.preferencesBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1">
            {strings.parentSettingsTitle}
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.parentSettingsSub}
          </p>
        </div>
      </div>

      {/* 1. PROFILE CARD */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-apple-blue-light text-apple-blue flex items-center justify-center font-black text-2xl shadow-sm">
            {displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-apple-text-primary">{displayName}</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-apple-blue border border-blue-200">
                {strings.ageLabel} {userProfile.age}
              </span>
            </div>
            <p className="text-xs text-apple-text-muted mt-0.5">
              {strings.contactLabel}: {userProfile.contactNumber} • {strings.emergencyContactLabel}: {userProfile.emergencyContactName} ({userProfile.emergencyContactPhone})
            </p>
            <p className="text-xs text-apple-text-secondary mt-1">
              {userProfile.address}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="px-5 py-2.5 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-sm rounded-xl transition-all border border-apple-border shrink-0 cursor-pointer"
        >
          {strings.editProfileBtn}
        </button>
      </div>

      {/* 2. LANGUAGE SETTINGS (ALL 6 LANGUAGES) */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-apple-border">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-apple-blue flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-apple-text-primary">{strings.appLanguageTitle}</h3>
            <p className="text-xs text-apple-text-muted">{strings.heroVoiceTitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  showFeedback(`${strings.appLanguageTitle}: ${lang}`);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 border-apple-blue text-apple-blue shadow-xs font-bold ring-2 ring-apple-blue/20'
                    : 'bg-apple-canvas border-apple-border text-apple-text-primary hover:bg-gray-100'
                }`}
              >
                <div className="font-bold text-sm">{lang}</div>
                <div className="text-[11px] text-apple-text-muted mt-0.5">
                  {isSelected ? `✓ ${strings.stepCompleted}` : strings.tapToSpeak}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. VOICE SPEED & ASSISTANT SETTINGS */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-apple-border">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-apple-text-primary">{strings.voiceSpeedHeader}</h3>
            <p className="text-xs text-apple-text-muted">{strings.voiceSpeedSub}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'slow', label: strings.speedSlowLabel, rate: 0.8 },
            { id: 'normal', label: strings.speedNormalLabel, rate: 1.0 },
            { id: 'fast', label: strings.speedFastLabel, rate: 1.2 },
          ].map((sp) => (
            <button
              key={sp.id}
              onClick={() => handleSpeedChange(sp.id as any, sp.rate)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                selectedSpeed === sp.id
                  ? 'bg-purple-50 border-purple-500 text-purple-800 font-bold shadow-xs'
                  : 'bg-apple-canvas border-apple-border text-apple-text-primary hover:bg-gray-100'
              }`}
            >
              <span className="text-sm font-semibold">{sp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. PRIVACY & NOTIFICATION TOGGLES */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-apple-border">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-apple-text-primary">{strings.seniorOptionsTitle}</h3>
            <p className="text-xs text-apple-text-muted">{strings.seniorAccessibilityDesc}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-apple-canvas border border-apple-border">
            <div>
              <span className="text-sm font-bold text-apple-text-primary block">
                {strings.familyMedicineAlertsLabel}
              </span>
              <span className="text-xs text-apple-text-muted">
                {strings.confirmationChimesDesc}
              </span>
            </div>
            <button
              onClick={() => {
                setNotificationsEnabled(!notificationsEnabled);
                showFeedback(!notificationsEnabled ? 'Enabled' : 'Disabled');
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                notificationsEnabled ? 'bg-apple-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-apple-canvas border border-apple-border">
            <div>
              <span className="text-sm font-bold text-apple-text-primary block">
                {strings.familySyncLabel}
              </span>
              <span className="text-xs text-apple-text-muted">
                {strings.familyNetworkActiveSub}
              </span>
            </div>
            <button
              onClick={() => {
                setFamilySyncEnabled(!familySyncEnabled);
                showFeedback(!familySyncEnabled ? 'Enabled' : 'Disabled');
              }}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                familySyncEnabled ? 'bg-apple-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  familySyncEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 5. LOGOUT */}
      <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex items-center justify-between">
        <div>
          <h4 className="font-bold text-base text-apple-text-primary">{strings.logoutBtn}</h4>
          <p className="text-xs text-apple-text-muted">
            {strings.appSubtitle}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm rounded-xl border border-rose-200 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{strings.logoutBtn}</span>
        </button>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default ParentSettings;
