import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { ProfileModal } from '../components/ProfileModal';
import { EmergencySosModal } from '../components/EmergencySosModal';
import {
  Globe,
  Volume2,
  Eye,
  Check,
  Phone,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    userProfile,
    currentLanguage,
    setLanguage,
    settings,
    updateSettings,
    speakText,
    setSpeechRate,
  } = useSahaay();

  const strings = getStrings(currentLanguage);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  // Accessibility toggle mock states
  const [highContrast, setHighContrast] = useState(settings.highContrastText);
  const [screenReaderHint, setScreenReaderHint] = useState(settings.voiceFeedback);
  const [soundEffects, setSoundEffects] = useState(true);

  const languages = [
    { code: 'English (India)', name: 'English (India)', nativeName: 'English' },
    { code: 'Hindi (हिंदी)', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'Marathi (मराठी)', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'Tamil (தமிழ்)', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'Telugu (తెలుగు)', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'Bengali (বাংলা)', name: 'Bengali', nativeName: 'বাংলা' },
  ];

  const handleTestVoice = () => {
    speakText(
      `${strings.statusText} ${userProfile.fullName}.`,
      true
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16 animate-fade-in space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {strings.settingsTitle}
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {strings.settingsSubtitle}
        </p>
      </div>

      {/* User Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-apple-blue-light text-apple-blue flex items-center justify-center font-extrabold text-2xl">
            {userProfile.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{userProfile.fullName}</h2>
            <p className="text-sm text-gray-500 font-medium">
              Age {userProfile.age} • {userProfile.contactNumber}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{userProfile.address}</p>
          </div>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          {strings.updateContact}
        </button>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-apple-blue">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg">{strings.prefLanguageTitle}</h3>
              <p className="text-xs md:text-sm text-gray-500">
                {strings.settingsSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Language Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code || currentLanguage.startsWith(lang.name);
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-apple-blue bg-blue-50/70 text-apple-blue ring-2 ring-blue-100'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div>
                  <span className="block text-xs text-gray-500 font-medium">{lang.name}</span>
                  <span className="block text-base font-bold">{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-apple-blue" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice & Speech Controls */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base md:text-lg">{strings.voiceSpeedTitle}</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {strings.voiceSpeedDesc}
            </p>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">{strings.speakingRate}</span>
            <span className="text-sm font-extrabold text-apple-blue px-2.5 py-0.5 bg-blue-100 rounded-full">
              {settings.speechRate}x
            </span>
          </div>

          <input
            type="range"
            min="0.6"
            max="1.2"
            step="0.05"
            value={settings.speechRate}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSpeechRate(val);
              updateSettings({ speechRate: val });
            }}
            className="w-full accent-apple-blue h-2 bg-gray-200 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-semibold text-gray-400">
            <span>0.6x</span>
            <span>0.85x</span>
            <span>1.2x</span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleTestVoice}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-apple-blue border border-gray-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              {strings.testVoiceSpeed}
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility & Visual Comfort */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base md:text-lg">
              {strings.seniorAccessibility}
            </h3>
            <p className="text-xs md:text-sm text-gray-500">
              {strings.seniorAccessibilityDesc}
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {/* High Contrast */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{strings.highContrastMode}</p>
              <p className="text-xs text-gray-500">{strings.highContrastDesc}</p>
            </div>
            <button
              onClick={() => {
                const nextVal = !highContrast;
                setHighContrast(nextVal);
                updateSettings({ highContrastText: nextVal });
                document.documentElement.classList.toggle('high-contrast');
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                highContrast ? 'bg-apple-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Screen Reader Voice Guidance */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{strings.spokenGuidance}</p>
              <p className="text-xs text-gray-500">
                {strings.spokenGuidanceDesc}
              </p>
            </div>
            <button
              onClick={() => {
                const nextVal = !screenReaderHint;
                setScreenReaderHint(nextVal);
                updateSettings({ voiceFeedback: nextVal });
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                screenReaderHint ? 'bg-apple-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  screenReaderHint ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sounds */}
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{strings.confirmationChimes}</p>
              <p className="text-xs text-gray-500">{strings.confirmationChimesDesc}</p>
            </div>
            <button
              onClick={() => setSoundEffects(!soundEffects)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                soundEffects ? 'bg-apple-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundEffects ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contact & Safety */}
      <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-100 text-sos-red">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{strings.emergencyContactTitle}</h3>
            <p className="text-xs md:text-sm text-gray-600">
              {userProfile.emergencyContactName} ({userProfile.emergencyContactPhone})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="px-4 py-2 bg-sos-red text-white font-bold rounded-xl text-xs shadow-md hover:bg-red-700 transition-colors cursor-pointer"
          >
            {strings.testSos}
          </button>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-4 py-2 bg-white text-gray-800 font-bold border border-gray-200 rounded-xl text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {strings.updateContact}
          </button>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <EmergencySosModal isOpen={isSosModalOpen} onClose={() => setIsSosModalOpen(false)} />
    </div>
  );
};
