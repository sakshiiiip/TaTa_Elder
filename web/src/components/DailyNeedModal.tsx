import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { X, ShoppingBag, Utensils, Wrench, Sparkles, Pill, CheckCircle2, Clock, Plus, ChevronRight } from 'lucide-react';
import { FamilyDataBridge } from '../services/familyDataBridge';

interface DailyNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
}

interface ServiceRequest {
  id: string;
  category: string;
  title: string;
  provider: string;
  timeSlot: string;
  status: 'Waiting for confirmation' | 'Confirmed' | 'In Progress' | 'Completed';
  statusColor: string;
}

export const DailyNeedModal: React.FC<DailyNeedModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
}) => {
  const { showFeedback, speakText } = useSahaay();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'repair');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'REQ-101',
      category: 'repair',
      title: 'Ceiling Fan Repair',
      provider: 'Verified Urban Company Electrician (Sunil)',
      timeSlot: 'Tomorrow, 11:00 AM',
      status: 'Waiting for confirmation',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'REQ-102',
      category: 'groceries',
      title: 'Fresh Vegetables & Milk (Cow Milk, Tomatoes, Wheat)',
      provider: 'Blinkit Senior Assist Partner',
      timeSlot: 'Delivered Today, 10:15 AM',
      status: 'Completed',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  ]);

  if (!isOpen) return null;

  const categories = [
    { id: 'groceries', label: 'Groceries', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'cooking', label: 'Cooking / Food', icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'repair', label: 'Home Repair', icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'cleaning', label: 'House Cleaning', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'medicine', label: 'Medicine Refill', icon: Pill, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleCreateRequest = (catId: string, title: string) => {
    const newReq: ServiceRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      category: catId,
      title,
      provider: 'Elder Care Assistance Partner',
      timeSlot: 'Scheduled for Tomorrow, 10:30 AM',
      status: 'Waiting for confirmation',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
    };
    setRequests([newReq, ...requests]);

    // Sync to Family Connect bridge
    if (catId === 'repair' || catId === 'cleaning') {
      const categoryType = catId === 'cleaning' ? 'Cleaning' : 'Plumbing';
      FamilyDataBridge.addMaintenanceRequest({
        title,
        category: categoryType,
        details: 'Requested directly by parent through My Sahaay Daily Needs',
        requestedBy: 'Ashutosh Pandey',
      });
    }

    setSuccessToast(`Requested: ${title}. Sahaay will arrange a verified partner.`);
    speakText(`Your request for ${title} has been placed. We will notify you once confirmed.`, true);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-need-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 via-white to-gray-50 border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-apple-sm flex items-center justify-center text-apple-blue">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 id="daily-need-modal-title" className="text-xl sm:text-2xl font-bold text-apple-text-primary">
                Daily Needs & Assistance
              </h2>
              <p className="text-xs sm:text-sm text-apple-text-muted">
                Simple everyday assistance at your doorstep
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-apple-text-muted transition-colors shadow-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback alert */}
        {successToast && (
          <div className="mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-900 text-sm font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Category Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-apple-text-muted mb-3">
              Select What You Need
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      isSelected
                        ? 'border-apple-blue bg-blue-50/80 text-apple-blue shadow-sm'
                        : 'border-apple-border bg-white hover:bg-gray-50 text-apple-text-primary'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Presets based on Active Category */}
          <div className="bg-gray-50/70 border border-apple-border rounded-2xl p-4 sm:p-5">
            <h4 className="text-sm font-bold text-apple-text-primary mb-3">
              One-Tap Quick Requests
            </h4>

            {activeCategory === 'repair' && (
              <div className="space-y-2">
                <button
                  onClick={() => handleCreateRequest('repair', 'Ceiling Fan / Switch Repair')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🔧 Ceiling Fan / Electrical Switch Repair</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('repair', 'Plumbing / Tap Leak Repair')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🚰 Bathroom Tap / Water Leak Repair</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('repair', 'AC Filter Cleaning & Servicing')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>❄️ AC Servicing & Filter Check</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
              </div>
            )}

            {activeCategory === 'groceries' && (
              <div className="space-y-2">
                <button
                  onClick={() => handleCreateRequest('groceries', 'Weekly Vegetable & Fruit Basket')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🥦 Weekly Fresh Vegetables & Fruit Basket</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('groceries', 'Dairy Essentials (Milk, Curd, Ghee)')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🥛 Daily Milk & Fresh Curd Refill</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('groceries', 'Atta, Rice & Cooking Oil Pack')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🌾 Wheat Flour (Atta) & Basmati Rice</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
              </div>
            )}

            {activeCategory === 'cooking' && (
              <div className="space-y-2">
                <button
                  onClick={() => handleCreateRequest('cooking', 'Home-cooked Satvik Lunch Tiffin')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🍲 Healthy Satvik Lunch Tiffin (Low Salt)</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('cooking', 'Evening Khichdi & Light Dinner')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🥣 Light Moong Dal Khichdi for Dinner</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
              </div>
            )}

            {activeCategory === 'cleaning' && (
              <div className="space-y-2">
                <button
                  onClick={() => handleCreateRequest('cleaning', 'Deep House Dusting & Floor Mopping')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🧹 Deep Living Room & Bedroom Cleaning</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('cleaning', 'Bathroom & Kitchen Disinfection')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🧼 Bathroom Anti-Skid Cleaning</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
              </div>
            )}

            {activeCategory === 'medicine' && (
              <div className="space-y-2">
                <button
                  onClick={() => handleCreateRequest('medicine', 'Blood Pressure & Diabetes 30-Day Refill')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>💊 30-Day Blood Pressure & Vitamin Refill</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
                <button
                  onClick={() => handleCreateRequest('medicine', 'Pain Relief Gel & Crepe Bandage')}
                  className="w-full p-3 bg-white hover:bg-blue-50/60 border border-apple-border rounded-xl text-left font-semibold text-sm text-apple-text-primary flex items-center justify-between transition-colors shadow-sm"
                >
                  <span>🩹 Knee Joint Pain Balm & First Aid Pack</span>
                  <ChevronRight className="w-4 h-4 text-apple-text-muted" />
                </button>
              </div>
            )}
          </div>

          {/* Active / Recent Requests */}
          <div>
            <h4 className="text-sm font-bold text-apple-text-primary mb-3">
              Recent Everyday Requests
            </h4>
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-white rounded-2xl border border-apple-border shadow-apple-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm sm:text-base text-apple-text-primary">
                        {req.title}
                      </h5>
                    </div>
                    <p className="text-xs text-apple-text-muted mt-0.5">
                      {req.provider}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-apple-text-secondary mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{req.timeSlot}</span>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${req.statusColor}`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-apple-border flex items-center justify-between text-xs text-apple-text-muted">
          <span>All assistance provided by verified elder-care staff</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-apple-blue text-white font-bold hover:bg-apple-blue-dark transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
