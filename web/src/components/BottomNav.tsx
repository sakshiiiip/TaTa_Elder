import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { Home, Mic, Receipt, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const items = [
    { title: strings.navHome, icon: Home, to: '/parent/home' },
    { title: strings.navVoice, icon: Mic, to: '/parent/sahaay' },
    { title: strings.navTransactions, icon: Receipt, to: '/parent/payments' },
    { title: strings.navSettings, icon: Settings, to: '/parent/settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-apple-border shadow-apple-lg px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-apple-blue font-bold scale-105'
                    : 'text-apple-text-muted font-medium hover:text-apple-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition-colors ${
                      isActive ? 'bg-apple-blue-light' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="text-[11px] mt-0.5 whitespace-nowrap">{item.title}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
