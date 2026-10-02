import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Clock,
  Shield,
  Lock,
  LogOut,
  Smartphone,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useFamily();

  // Settings states
  const [notifyCheckin, setNotifyCheckin] = useState(true);
  const [notifyMedicineDelay, setNotifyMedicineDelay] = useState(true);
  const [notifyBills, setNotifyBills] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [morningWindow, setMorningWindow] = useState('8:00 AM - 10:00 AM');
  const [eveningWindow, setEveningWindow] = useState('6:00 PM - 8:00 PM');
  const [allowSiblingEdit, setAllowSiblingEdit] = useState(true);

  const handleSave = () => {
    showToast('Family preferences saved successfully');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-gray-100 text-apple-text-secondary text-xs font-bold rounded-full border border-apple-border">
              ⚙ Portal Preferences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
            Family Account & Alert Settings
          </h1>
          <p className="text-sm text-apple-text-muted mt-1">
            Configure how and when you receive caregiver alerts for Ashutosh.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-xs sm:text-sm rounded-2xl shadow-apple-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          Save Changes
        </button>
      </section>

      {/* 2. Family Member Profile */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <h2 className="text-lg font-extrabold text-apple-text-primary mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-apple-blue" />
          <span>Active Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-apple-text-muted block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Rahul Sharma"
              className="w-full p-3 rounded-xl bg-apple-canvas border border-apple-border font-bold text-apple-text-primary outline-none"
            />
          </div>
          <div>
            <label className="text-apple-text-muted block font-semibold mb-1">Relationship to Parent</label>
            <input
              type="text"
              defaultValue="Son"
              disabled
              className="w-full p-3 rounded-xl bg-gray-100 border border-apple-border font-bold text-apple-text-muted cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-apple-text-muted block font-semibold mb-1">Email Address</label>
            <input
              type="email"
              defaultValue="rahul.sharma@example.com"
              className="w-full p-3 rounded-xl bg-apple-canvas border border-apple-border font-bold text-apple-text-primary outline-none"
            />
          </div>
          <div>
            <label className="text-apple-text-muted block font-semibold mb-1">Current City / Location</label>
            <input
              type="text"
              defaultValue="Pune, Maharashtra"
              className="w-full p-3 rounded-xl bg-apple-canvas border border-apple-border font-bold text-apple-text-primary outline-none"
            />
          </div>
        </div>
      </section>

      {/* 3. Notification & Alert Channels */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm space-y-4">
        <h2 className="text-lg font-extrabold text-apple-text-primary mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-apple-blue" />
          <span>Notification Preferences</span>
        </h2>
        <p className="text-xs text-apple-text-muted -mt-2 mb-4">
          Non-alarmist reminders designed to keep you informed without causing unnecessary panic.
        </p>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-apple-canvas border border-apple-border cursor-pointer">
            <div>
              <span className="font-bold text-sm text-apple-text-primary block">
                Morning Smart Check-in Confirmation
              </span>
              <span className="text-xs text-apple-text-muted">
                Receive push notification when Ashutosh completes his daily morning check-in.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyCheckin}
              onChange={() => setNotifyCheckin(!notifyCheckin)}
              className="w-5 h-5 accent-apple-blue rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-apple-canvas border border-apple-border cursor-pointer">
            <div>
              <span className="font-bold text-sm text-apple-text-primary block">
                Medication Overdue Alerts
              </span>
              <span className="text-xs text-apple-text-muted">
                Notify if scheduled blood pressure or maintenance medicine is delayed by 60 mins.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyMedicineDelay}
              onChange={() => setNotifyMedicineDelay(!notifyMedicineDelay)}
              className="w-5 h-5 accent-apple-blue rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-apple-canvas border border-apple-border cursor-pointer">
            <div>
              <span className="font-bold text-sm text-apple-text-primary block">
                Utility Bill Due Reminders
              </span>
              <span className="text-xs text-apple-text-muted">
                Remind 5 days before electricity, water, or medicine refill bills are due.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notifyBills}
              onChange={() => setNotifyBills(!notifyBills)}
              className="w-5 h-5 accent-apple-blue rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-apple-canvas border border-apple-border cursor-pointer">
            <div>
              <span className="font-bold text-sm text-apple-text-primary block">
                WhatsApp Urgent Summary
              </span>
              <span className="text-xs text-apple-text-muted">
                Send daily care digest to your registered WhatsApp number (+91 98765 43210).
              </span>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={() => setWhatsappAlerts(!whatsappAlerts)}
              className="w-5 h-5 accent-apple-blue rounded"
            />
          </label>
        </div>
      </section>

      {/* 4. Smart Check-in Windows */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <h2 className="text-lg font-extrabold text-apple-text-primary mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-apple-blue" />
          <span>Smart Check-In Windows</span>
        </h2>
        <p className="text-xs text-apple-text-muted mb-4">
          Expected time slots for Ashutosh's regular daily voice check-ins on his tablet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-apple-text-muted block font-semibold mb-1">Morning Window</label>
            <select
              value={morningWindow}
              onChange={(e) => setMorningWindow(e.target.value)}
              className="w-full p-3 rounded-xl bg-apple-canvas border border-apple-border font-bold text-apple-text-primary outline-none"
            >
              <option value="7:30 AM - 9:30 AM">7:30 AM - 9:30 AM</option>
              <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM (Current)</option>
              <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
            </select>
          </div>
          <div>
            <label className="text-apple-text-muted block font-semibold mb-1">Evening Window</label>
            <select
              value={eveningWindow}
              onChange={(e) => setEveningWindow(e.target.value)}
              className="w-full p-3 rounded-xl bg-apple-canvas border border-apple-border font-bold text-apple-text-primary outline-none"
            >
              <option value="5:30 PM - 7:30 PM">5:30 PM - 7:30 PM</option>
              <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM (Current)</option>
              <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM</option>
            </select>
          </div>
        </div>
      </section>

      {/* 5. Privacy & Sibling Sharing */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm space-y-4">
        <h2 className="text-lg font-extrabold text-apple-text-primary mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>Privacy & Cooperative Ethics</span>
        </h2>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
          <p className="font-extrabold text-sm mb-1">Non-Surveillance Guarantee</p>
          Sahaay is designed to maintain your parent's autonomy and dignity. We do not use live video surveillance or invasive location polling. Check-ins are purely voice-driven and voluntary.
        </div>

        <label className="flex items-center justify-between p-4 rounded-2xl bg-apple-canvas border border-apple-border cursor-pointer">
          <div>
            <span className="font-bold text-sm text-apple-text-primary block">
              Co-Caregiver Sync with Priya
            </span>
            <span className="text-xs text-apple-text-muted">
              Allow sister Priya to view and reassign tasks, update doctor visits, and view bill receipts.
            </span>
          </div>
          <input
            type="checkbox"
            checked={allowSiblingEdit}
            onChange={() => setAllowSiblingEdit(!allowSiblingEdit)}
            className="w-5 h-5 accent-apple-blue rounded"
          />
        </label>
      </section>

      {/* 6. Danger Zone: Logout */}
      <section className="bg-white rounded-3xl p-6 border border-red-200 shadow-apple-sm flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-red-600">End Session</h3>
          <p className="text-xs text-apple-text-muted mt-0.5">
            Log out of the Sahaay Family Portal on this device.
          </p>
        </div>

        <button
          onClick={() => {
            showToast('Logged out of Sahaay');
            navigate('/login');
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </section>
    </div>
  );
};
