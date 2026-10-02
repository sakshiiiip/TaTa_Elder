import React, { useState } from 'react';
import {
  CalendarCheck,
  ShoppingCart,
  Wrench,
  Utensils,
  Sparkles,
  Pill,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useFamily } from '../../context/FamilyContext';
import { HandleRequestModal } from '../../components/HandleRequestModal';

export const DailyLife: React.FC = () => {
  const {
    dailyRequests,
    handleFulfillRequest,
    assignDailyRequest,
    showToast,
  } = useFamily();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<'groceries' | 'repair'>('groceries');
  const [activeReqId, setActiveReqId] = useState<string>('req-1');

  const categories = [
    { id: 'all', label: 'All Requests' },
    { id: 'groceries', label: 'Groceries' },
    { id: 'repair', label: 'Home Repair' },
    { id: 'cooking', label: 'Cooking & Meals' },
    { id: 'cleaning', label: 'House Cleaning' },
    { id: 'medicine', label: 'Medicine Refill' },
  ];

  const filteredRequests =
    activeCategory === 'all'
      ? dailyRequests
      : dailyRequests.filter(r => r.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'groceries':
        return ShoppingCart;
      case 'repair':
        return Wrench;
      case 'cooking':
        return Utensils;
      case 'cleaning':
        return Sparkles;
      case 'medicine':
        return Pill;
      default:
        return CalendarCheck;
    }
  };

  const handleOpenFulfillment = (reqId: string, category: string) => {
    setActiveReqId(reqId);
    setModalCategory(category === 'repair' ? 'repair' : 'groceries');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
              🛒 Daily Life & Chores
            </span>
            <span className="text-xs text-apple-text-muted font-semibold">
              Live parent requests from Mumbai home
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
            Daily Life Assistance
          </h1>
          <p className="text-sm text-apple-text-muted mt-1">
            Remotely resolve grocery shopping, meal subscriptions, handyman visits, and medicine refills.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveReqId('new');
            setModalCategory('groceries');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-sm rounded-2xl shadow-apple-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Daily Request</span>
        </button>
      </section>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-apple-blue text-white shadow-sm'
                : 'bg-white text-apple-text-secondary hover:text-apple-text-primary hover:bg-gray-100 border border-apple-border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Daily Requests List */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRequests.map((req) => {
          const Icon = getCategoryIcon(req.category);
          const isCompleted = req.statusType === 'completed';

          return (
            <div
              key={req.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-apple-sm flex flex-col justify-between ${
                isCompleted ? 'border-apple-border/60 opacity-80' : 'border-apple-border hover:shadow-apple-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-apple-text-muted">
                        {req.category}
                      </span>
                      <h3 className="font-extrabold text-base text-apple-text-primary leading-tight">
                        {req.title}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                      req.statusType === 'help_needed'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : req.statusType === 'assigned'
                        ? 'bg-blue-50 text-apple-blue border-blue-200'
                        : req.statusType === 'completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <p className="text-sm text-apple-text-secondary leading-relaxed mb-4">
                  {req.desc}
                </p>

                <div className="p-3 rounded-2xl bg-apple-canvas border border-apple-border text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-apple-text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{req.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-semibold text-apple-text-primary">
                    <Users className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Assigned: </span>
                    <select
                      value={req.assignedTo.includes('Rahul') ? 'Rahul' : req.assignedTo.includes('Priya') ? 'Priya' : 'Unassigned'}
                      onChange={(e) => assignDailyRequest(req.id, e.target.value)}
                      className="bg-transparent font-bold text-apple-blue outline-none cursor-pointer"
                    >
                      <option value="Rahul">Rahul (Pune)</option>
                      <option value="Priya">Priya (Bengaluru)</option>
                      <option value="Unassigned">Unassigned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-apple-border flex items-center justify-between gap-3">
                <button
                  onClick={() =>
                    handleFulfillRequest(
                      req.id,
                      isCompleted ? 'Pending family help' : 'Completed'
                    )
                  }
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    isCompleted
                      ? 'text-apple-text-muted hover:text-apple-text-primary bg-gray-100'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {isCompleted ? 'Mark as Pending' : '✓ Mark Completed'}
                </button>

                {req.category === 'groceries' && (
                  <button
                    onClick={() => handleOpenFulfillment(req.id, 'groceries')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Order 45m Delivery</span>
                  </button>
                )}

                {req.category === 'repair' && (
                  <button
                    onClick={() => handleOpenFulfillment(req.id, 'repair')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-apple-blue font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Book Plumber</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Handle Request Modal */}
      <HandleRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestType={modalCategory}
        onRequestHandled={(_type, note: string) => {
          handleFulfillRequest(activeReqId, note);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
