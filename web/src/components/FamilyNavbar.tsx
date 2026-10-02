import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  CalendarCheck,
  CreditCard,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  UserCheck,
  MoreHorizontal,
  X,
  AlertTriangle,
  Calendar,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import { useFamily } from '../context/FamilyContext';

export const FamilyNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { unreadNotificationCount } = useFamily();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // 8 Primary Navigation Items in main navbar:
  // Overview | Parent Health | Daily Life | Appointments | Home Maintenance | Payments | Family | Weekly Summary
  const mainNavItems = [
    { to: '/family/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/family/health', label: 'Parent Health', icon: Stethoscope },
    { to: '/family/daily-life', label: 'Daily Life', icon: CalendarCheck },
    { to: '/family/appointments', label: 'Appointments', icon: Calendar },
    { to: '/family/home-maintenance', label: 'Home Maintenance', icon: Wrench },
    { to: '/family/payments', label: 'Payments', icon: CreditCard },
    { to: '/family/family', label: 'Family', icon: Users },
    { to: '/family/weekly-summary', label: 'Weekly Summary', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-apple-border shadow-apple-sm transition-all h-[74px] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 flex items-center justify-between gap-2 lg:gap-4">
        
        {/* =========================================================================
            LEFT: COMPACT FAMILY MEMBER PROFILE
            [R] Rahul Sharma | Son • Pune | Sahaay Family
            ========================================================================= */}
        <Link
          to="/family/overview"
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-apple-blue font-extrabold text-base shadow-sm shrink-0">
            R
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-extrabold text-sm text-apple-text-primary truncate">
                Rahul Sharma
              </span>
              <span className="text-[11px] font-semibold text-apple-text-muted">
                • Son
              </span>
            </div>
            <div className="text-[11px] font-semibold text-apple-blue leading-tight mt-0.5">
              Sahaay Family <span className="text-apple-border">•</span> Remote Support
            </div>
          </div>
        </Link>

        {/* =========================================================================
            CENTER NAVIGATION:
            Overview | Parent Health | Daily Life | Appointments | Home Maintenance |
            Payments | Family | Weekly Summary
            (Horizontal scrollable container, strict single line, whitespace-nowrap)
            ========================================================================= */}
        <nav
          className="hidden md:flex items-center gap-1 border-l border-apple-border pl-2.5 lg:pl-3.5 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth py-1"
          aria-label="Main Family Navigation"
        >
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-apple-blue text-white shadow-sm'
                      : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* SPACER */}
        <div className="flex-1 min-w-[2px]" />

        {/* =========================================================================
            RIGHT SIDE:
            Messages | Notifications | Settings | Emergency: OK | My Sahaay | Logout
            ========================================================================= */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* 1. Messages Icon Button */}
          <NavLink
            to="/family/messages"
            className={({ isActive }) =>
              `w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors relative cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-apple-blue ring-2 ring-apple-blue/30'
                  : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
              }`
            }
            title="Conversations & Messages"
            aria-label="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-apple-blue" />
          </NavLink>

          {/* 2. Notifications Icon Button */}
          <NavLink
            to="/family/notifications"
            className={({ isActive }) =>
              `w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors relative cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-apple-blue ring-2 ring-apple-blue/30'
                  : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
              }`
            }
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-apple-blue" />
            )}
          </NavLink>

          {/* 3. Settings Icon Button */}
          <NavLink
            to="/family/settings"
            className={({ isActive }) =>
              `w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-apple-blue ring-2 ring-apple-blue/30'
                  : 'text-apple-text-secondary hover:text-apple-text-primary hover:bg-apple-canvas'
              }`
            }
            title="Settings & Preferences"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>

          {/* 4. Emergency: OK Status Pill */}
          <NavLink
            to="/family/emergency"
            className={({ isActive }) =>
              `flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border font-extrabold text-xs px-2.5 py-1.5 rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100'
                  : 'border-emerald-300'
              }`
            }
            title="Dedicated Emergency Center"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="hidden xl:inline">Emergency:</span>
            <span>OK</span>
          </NavLink>

          {/* 5. Compact "My Sahaay" Button */}
          <button
            onClick={() => navigate('/parent')}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-blue-50 hover:text-apple-blue text-apple-text-primary text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-apple-border transition-all whitespace-nowrap cursor-pointer shrink-0"
            title="Switch to My Sahaay (Parent View)"
          >
            <UserCheck className="w-3.5 h-3.5 text-apple-blue shrink-0" />
            <span className="hidden sm:inline">My Sahaay</span>
          </button>

          {/* 6. Logout Icon at Far Right */}
          <button
            onClick={() => navigate('/login')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-apple-text-muted hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            title="Log out of Sahaay Family Portal"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile More Toggle for small screens (<md) */}
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center text-apple-text-secondary hover:bg-apple-canvas"
            title="More Navigation"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer for small screens */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed top-[74px] left-0 right-0 bg-white border-b border-apple-border shadow-apple-lg p-3 space-y-1.5 z-40 animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-apple-border text-xs font-bold text-apple-text-muted px-2">
            <span>Family Navigation</span>
            <button
              onClick={() => setIsMoreMenuOpen(false)}
              className="text-apple-text-muted hover:text-apple-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMoreMenuOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-apple-blue text-white shadow-sm'
                      : 'text-apple-text-secondary hover:bg-apple-canvas'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
