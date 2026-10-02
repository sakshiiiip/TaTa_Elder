import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Pill,
  Calendar,
  Receipt,
  Users,
  Clock,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'medicine' | 'family' | 'bill' | 'doctor';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const ParentNotifications: React.FC = () => {
  const { showFeedback, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      category: 'doctor',
      title: strings.doctorCardTitle,
      message: strings.doctorCardSub,
      time: '15 mins ago',
      read: false,
    },
    {
      id: 'notif-2',
      category: 'family',
      title: strings.familyNetworkActive,
      message: strings.familyNetworkActiveSub,
      time: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-3',
      category: 'medicine',
      title: strings.routineAfternoonMed,
      message: strings.allDosesOnTrack,
      time: '3 hours ago',
      read: true,
    },
    {
      id: 'notif-4',
      category: 'bill',
      title: strings.pendingBillCardTitle,
      message: strings.pendingBillCardSub,
      time: 'Yesterday',
      read: true,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showFeedback(strings.markAllReadBtn);
  };

  const handleClearAll = () => {
    setNotifications([]);
    showFeedback(strings.clearAllBtn);
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medicine':
        return <Pill className="w-5 h-5 text-purple-600" />;
      case 'doctor':
        return <Calendar className="w-5 h-5 text-doctor-blue" />;
      case 'bill':
        return <Receipt className="w-5 h-5 text-bills-green" />;
      case 'family':
        return <Users className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-apple-blue" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <span className="text-xs font-semibold text-apple-blue uppercase tracking-wider">
            {strings.recentUpdatesBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1">
            {strings.parentNotifTitle} ({unreadCount})
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.parentNotifSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAllAsRead}
                className="px-3.5 py-2 bg-white hover:bg-gray-100 border border-apple-border font-bold text-xs rounded-xl text-apple-text-primary transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{strings.markAllReadBtn}</span>
              </button>
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-apple-border hover:border-rose-200 font-bold text-xs rounded-xl text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{strings.clearAllBtn}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-apple-border space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-apple-blue flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-apple-text-primary">{strings.noNotificationsYet}</h3>
            <p className="text-xs sm:text-sm text-apple-text-muted">
              {strings.allCaughtUpBadge}
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleToggleRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                n.read
                  ? 'bg-white border-apple-border opacity-75'
                  : 'bg-blue-50/40 border-blue-200 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-apple-canvas border border-apple-border flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-apple-text-primary">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-apple-blue"></span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-apple-text-secondary mt-1">
                    {n.message}
                  </p>
                  <span className="text-[11px] text-apple-text-muted mt-2 block">
                    {n.time}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleRead(n.id);
                }}
                className="text-xs font-semibold text-apple-blue hover:underline shrink-0"
              >
                {n.read ? '•' : '✓'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentNotifications;
