import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarCheck,
  CreditCard,
  Pill,
  ShieldCheck,
  Check,
  Trash2,
} from 'lucide-react';
import { useFamily, FamilyNotificationItem } from '../../context/FamilyContext';

export const Notifications: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useFamily();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'checkin' | 'medicine' | 'payment'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'checkin') return n.type === 'checkin';
    if (activeFilter === 'medicine') return n.type === 'medicine';
    if (activeFilter === 'payment') return n.type === 'payment';
    return true;
  });

  const getNotificationIcon = (type: FamilyNotificationItem['type']) => {
    switch (type) {
      case 'checkin':
        return CheckCircle2;
      case 'medicine':
        return Pill;
      case 'payment':
        return CreditCard;
      case 'request':
        return CalendarCheck;
      case 'emergency':
        return ShieldCheck;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: FamilyNotificationItem['type']) => {
    switch (type) {
      case 'checkin':
        return 'bg-emerald-100 text-emerald-700';
      case 'medicine':
        return 'bg-blue-100 text-apple-blue';
      case 'payment':
        return 'bg-amber-100 text-amber-700';
      case 'request':
        return 'bg-purple-100 text-purple-700';
      case 'emergency':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-apple-blue text-xs font-bold rounded-full">
              🔔 Remote Alert Center
            </span>
            {unreadNotificationCount > 0 && (
              <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-200">
                {unreadNotificationCount} New
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
            Notifications & Care Alerts
          </h1>
          <p className="text-sm text-apple-text-muted mt-1">
            Real-time activity feed of check-ins, medication logs, bills, and safety updates.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-xs rounded-xl border border-apple-border transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark all as read</span>
          </button>
        )}
      </section>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-apple-blue text-white shadow-sm'
              : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'unread'
              ? 'bg-apple-blue text-white shadow-sm'
              : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
          }`}
        >
          Unread ({unreadNotificationCount})
        </button>
        <button
          onClick={() => setActiveFilter('checkin')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'checkin'
              ? 'bg-apple-blue text-white shadow-sm'
              : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
          }`}
        >
          Smart Check-ins
        </button>
        <button
          onClick={() => setActiveFilter('medicine')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'medicine'
              ? 'bg-apple-blue text-white shadow-sm'
              : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
          }`}
        >
          Medicines
        </button>
        <button
          onClick={() => setActiveFilter('payment')}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeFilter === 'payment'
              ? 'bg-apple-blue text-white shadow-sm'
              : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
          }`}
        >
          Payments
        </button>
      </div>

      {/* 3. Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-apple-border text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-extrabold text-base text-apple-text-primary">All caught up!</h3>
            <p className="text-xs text-apple-text-muted mt-1">No notifications matching this category.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            const iconColor = getNotificationColor(notif.type);

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-white border-apple-border/70 shadow-xs'
                    : 'bg-blue-50/40 border-blue-200/80 shadow-apple-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-apple-text-primary">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-apple-blue" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-apple-text-secondary mt-1 leading-relaxed">
                      {notif.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-apple-text-muted font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationAsRead(notif.id);
                    }}
                    className="text-xs font-bold text-apple-blue hover:underline whitespace-nowrap shrink-0"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
