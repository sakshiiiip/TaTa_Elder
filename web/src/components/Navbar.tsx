import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSahaay } from '../context/SahaayContext';
import { LANGUAGES, getStrings } from '../localization/strings';
import {
  User,
  Users,
  Bell,
  Mic,
  Home,
  Receipt,
  Settings,
  Stethoscope,
  CalendarCheck,
  Heart,
  MoreHorizontal,
  X,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenSos: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProfile,
  onOpenSos,
}) => {
  const navigate = useNavigate();
  const {
    userProfile,
    currentLanguage,
    setLanguage,
  } = useSahaay();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const strings = getStrings(currentLanguage);

  const displayName = (!userProfile.fullName || userProfile.fullName.includes('Ramesh'))
    ? 'Ashutosh Pandey'
    : userProfile.fullName;

  // Single-line nav item class with responsive font size and padding
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 lg:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
      isActive
        ? 'bg-apple-blue text-white shadow-sm'
        : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
    }`;

  return (
    <header className="parent-navbar sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-apple-border shadow-apple-sm transition-all h-[72px] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-1.5 sm:gap-2.5 lg:gap-4">
        
        {/* =========================================================================
            1. PROFILE SECTION
            - Compact, uncluttered layout
            - Never takes excessive horizontal width
            ========================================================================= */}
        <div className="profile-section flex items-center shrink-0">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 rounded-2xl hover:bg-apple-canvas transition-colors text-left group shrink-0 cursor-pointer"
            title={strings.editProfileBtn || "View & Edit Profile"}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-apple-blue-light flex items-center justify-center text-apple-blue shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block leading-tight min-w-0" style={{ whiteSpace: 'nowrap' }}>
              <div className="font-bold text-xs sm:text-sm text-apple-text-primary truncate max-w-[110px] xl:max-w-none">
                {displayName}
              </div>
              <div className="text-[10px] sm:text-[11px] text-apple-text-muted font-medium">
                {strings.mySahaay || 'My Sahaay'}
              </div>
            </div>
          </button>
        </div>

        {/* =========================================================================
            2. MAIN NAVIGATION
            - Home | Sahaay | Health | Daily Life | Payments | Family
            - Guaranteed ONE line (whitespace: nowrap)
            - Flexible space allocation with min-w-0 so it NEVER pushes SOS off-screen
            ========================================================================= */}
        <nav
          className="main-navigation hidden md:flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 border-l border-apple-border/70 pl-2 lg:pl-3 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth shrink min-w-0"
          style={{ whiteSpace: 'nowrap' }}
          aria-label="Parent Main Navigation"
        >
          {/* 1. Home */}
          <NavLink to="/parent/home" className={navItemClass} style={{ whiteSpace: 'nowrap' }}>
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">{strings.navHome}</span>
          </NavLink>

          {/* 2. Sahaay (Voice Assistant) */}
          <NavLink to="/parent/sahaay" className={navItemClass} style={{ whiteSpace: 'nowrap' }}>
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">{strings.navSahaay}</span>
          </NavLink>

          {/* 3. Health */}
          <NavLink to="/parent/health" className={navItemClass} style={{ whiteSpace: 'nowrap' }}>
            <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">{strings.navHealth}</span>
          </NavLink>

          {/* 4. Daily Life */}
          <NavLink to="/parent/daily-life" className={navItemClass} style={{ whiteSpace: 'nowrap' }}>
            <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap" style={{ whiteSpace: 'nowrap' }}>
              {strings.navDailyLife}
            </span>
          </NavLink>

          {/* 5. Payments */}
          <NavLink to="/parent/payments" className={navItemClass} style={{ whiteSpace: 'nowrap' }}>
            <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">{strings.navPayments}</span>
          </NavLink>

          {/* 6. Family */}
          <NavLink to="/parent/family" className={navItemClass} style={{ whiteSpace: 'nowrap' }}>
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="whitespace-nowrap">{strings.navFamily}</span>
          </NavLink>
        </nav>

        {/* =========================================================================
            3. SECONDARY ACTIONS
            - Normal desktop: English | 🔔 | ⚙ | Family Connect
            - Smaller desktop: 🔔 | ⚙ | Family (Language selector in More dropdown)
            ========================================================================= */}
        <div
          className="secondary-actions flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0"
          style={{ whiteSpace: 'nowrap' }}
        >
          {/* Language Selector: Shown on normal desktop (xl:), compact dropdown on smaller */}
          <div className="relative shrink-0 hidden xl:block">
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-apple-canvas hover:bg-gray-200 border border-apple-border text-apple-text-primary text-xs font-semibold rounded-xl px-2.5 py-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-apple-blue transition-all whitespace-nowrap"
              style={{ whiteSpace: 'nowrap' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications: 🔔 */}
          <NavLink
            to="/parent/notifications"
            className={({ isActive }) =>
              `w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors relative shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-apple-blue ring-2 ring-apple-blue/30'
                  : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
              }`
            }
            title={strings.navNotifications}
            aria-label="Notifications"
            style={{ whiteSpace: 'nowrap' }}
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-apple-blue" />
          </NavLink>

          {/* Settings: ⚙ */}
          <NavLink
            to="/parent/settings"
            className={({ isActive }) =>
              `w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-apple-blue ring-2 ring-apple-blue/30'
                  : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
              }`
            }
            title={strings.navSettings}
            aria-label="Settings"
            style={{ whiteSpace: 'nowrap' }}
          >
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
          </NavLink>

          {/* Family Portal Shortcut: "Family Connect" at xl:, "Family" at smaller desktop */}
          <button
            onClick={() => navigate('/family/overview')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-apple-blue font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Switch to Family Support Portal (Rahul)"
            style={{ whiteSpace: 'nowrap' }}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline whitespace-nowrap">Family Connect</span>
            <span className="xl:hidden whitespace-nowrap">Family</span>
          </button>

          {/* More menu on smaller desktop to switch language */}
          <div className="relative xl:hidden">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-apple-text-secondary hover:bg-apple-canvas transition-colors cursor-pointer"
              title="Change Language & Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-apple-lg border border-apple-border p-3 space-y-2 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-1.5 border-b border-apple-border text-[11px] font-bold text-apple-text-muted">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-apple-blue" />
                    <span>Language</span>
                  </span>
                  <button
                    onClick={() => setIsMoreMenuOpen(false)}
                    className="text-apple-text-muted hover:text-apple-text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        currentLanguage === lang
                          ? 'bg-blue-50 text-apple-blue font-bold'
                          : 'text-apple-text-secondary hover:bg-apple-canvas'
                      }`}
                    >
                      <span>{lang}</span>
                      {currentLanguage === lang && <span className="text-apple-blue font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            4. CRITICAL EMERGENCY SOS BUTTON
            - Highest priority
            - Strict flex-shrink: 0, whitespace: nowrap
            - Always remains visible at 100%, 90%, 80%, 75% zoom and all desktop widths
            ========================================================================= */}
        <NavLink
          to="/parent/emergency"
          className={({ isActive }) =>
            `sos-button flex items-center gap-1 sm:gap-1.5 bg-sos-red hover:bg-red-700 text-white font-black text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0 flex-shrink-0 cursor-pointer ${
              isActive ? 'ring-2 ring-red-300 ring-offset-1' : ''
            }`
          }
          style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          title="Emergency SOS Center"
          onClick={() => {
            if (onOpenSos) onOpenSos();
          }}
        >
          <span className="text-sm sm:text-base leading-none select-none" role="img" aria-label="alert">
            🚨
          </span>
          <span className="whitespace-nowrap font-black tracking-wide" style={{ whiteSpace: 'nowrap' }}>
            {strings.navSos || 'SOS'}
          </span>
        </NavLink>

      </div>
    </header>
  );
};
