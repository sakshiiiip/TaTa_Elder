import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Snowflake,
  Paintbrush,
  HelpCircle,
  Plus,
  Phone,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
  X,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  FamilyDataBridge,
  MaintenanceRequest,
} from '../../services/familyDataBridge';

const CATEGORIES = [
  { id: 'All', label: 'All', icon: Wrench },
  { id: 'Plumbing', label: 'Plumbing', icon: Wrench, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Electrical', label: 'Electrical', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Carpentry', label: 'Carpentry', icon: Hammer, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'Cleaning', label: 'Cleaning', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Appliance Repair', label: 'Appliance Repair', icon: Snowflake, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { id: 'Painting', label: 'Painting', icon: Paintbrush, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Other', label: 'Other', icon: HelpCircle, color: 'text-gray-600 bg-gray-50 border-gray-200' },
];

export const HomeMaintenance: React.FC = () => {
  const currentParent = { name: 'Ashutosh Pandey', age: 74, location: 'Bandra West, Mumbai' };
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isHandleModalOpen, setIsHandleModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [selectedHandler, setSelectedHandler] = useState<'Rahul Sharma' | 'Priya Sharma' | 'Local Service Provider'>('Rahul Sharma');
  const [localProviderName, setLocalProviderName] = useState('Urban Company Verified Partner');

  // New Request modal
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MaintenanceRequest['category']>('Plumbing');
  const [newDetails, setNewDetails] = useState('');

  // Call parent modal
  const [isCallingParent, setIsCallingParent] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const list = FamilyDataBridge.getMaintenanceRequests();
    setRequests(list);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAssign = (req: MaintenanceRequest) => {
    setSelectedRequest(req);
    setSelectedHandler(req.handlerType || 'Rahul Sharma');
    setIsHandleModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedRequest) return;
    const assignedName = selectedHandler === 'Local Service Provider' ? localProviderName : selectedHandler;
    const updated = FamilyDataBridge.assignMaintenanceRequest(
      selectedRequest.id,
      selectedHandler,
      assignedName
    );
    setRequests(updated);
    setIsHandleModalOpen(false);
    showToast(`${assignedName} is handling "${selectedRequest.title}".`);
  };

  const handleStatusChange = (id: string, status: MaintenanceRequest['status']) => {
    const updated = FamilyDataBridge.updateMaintenanceStatus(id, status);
    setRequests(updated);
    showToast(`Request status updated to ${status}.`);
  };

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    FamilyDataBridge.addMaintenanceRequest({
      title: newTitle,
      category: newCategory,
      details: newDetails || `Assistance needed for ${newTitle}`,
      requestedBy: currentParent.name,
    });

    loadRequests();
    setIsNewRequestModalOpen(false);
    setNewTitle('');
    setNewDetails('');
    showToast(`Service request "${newTitle}" created successfully.`);
  };

  const filteredRequests = requests.filter(
    (r) => selectedCategory === 'All' || r.category === selectedCategory
  );

  const activeRequests = filteredRequests.filter((r) => r.status !== 'Completed');
  const completedRequests = filteredRequests.filter((r) => r.status === 'Completed');

  const getCategoryMeta = (cat: string) => {
    const found = CATEGORIES.find((c) => c.id === cat);
    return found || CATEGORIES[1];
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-apple-text-primary text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-apple-lg flex items-center gap-2.5 animate-slide-up border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-apple-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Wrench className="w-3.5 h-3.5" />
              <span>Remote Household Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Home Maintenance
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Manage household repair, safety, and maintenance requests for{' '}
              <strong className="text-white font-bold">{currentParent.name}</strong>.
              When your parent requests help through Sahaay, requests sync here instantly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsNewRequestModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-apple-blue font-bold text-sm shadow-apple-sm hover:bg-blue-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Request Service</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-apple-text-muted px-1">
          Filter by Category
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-apple-blue text-white border-apple-blue shadow-apple-sm'
                    : 'bg-white text-apple-text-secondary border-apple-border hover:border-apple-blue/40 hover:bg-blue-50/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: ACTIVE REQUESTS
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-apple-blue">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
                Active Requests
              </h2>
              <p className="text-xs text-apple-text-muted">
                {activeRequests.length} pending household maintenance item{activeRequests.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {activeRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-apple-border text-center shadow-apple-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-apple-text-primary text-base">
              No Active Maintenance Requests
            </h3>
            <p className="text-sm text-apple-text-muted mt-1 max-w-md mx-auto">
              Everything in {currentParent.name}&apos;s residence is running smoothly. New requests
              submitted by {currentParent.name} will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {activeRequests.map((req) => {
              const meta = getCategoryMeta(req.category);
              const CatIcon = meta.icon;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category + Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border bg-gray-50 border-apple-border text-apple-text-secondary">
                        <CatIcon className="w-3.5 h-3.5 text-apple-blue" />
                        <span>{req.category}</span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          req.status === 'Requested'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : req.status === 'Assigned'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-purple-50 text-purple-800 border-purple-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-apple-text-primary leading-snug">
                        {req.title}
                      </h3>
                      {req.details && (
                        <p className="text-xs sm:text-sm text-apple-text-muted mt-1 leading-relaxed">
                          {req.details}
                        </p>
                      )}
                    </div>

                    {/* Meta info: Requested by + Date */}
                    <div className="bg-apple-canvas/70 rounded-2xl p-3 text-xs space-y-1.5 border border-apple-border/60">
                      <div className="flex items-center justify-between text-apple-text-secondary">
                        <span className="text-apple-text-muted">Requested by:</span>
                        <span className="font-semibold text-apple-text-primary">{req.requestedBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-apple-text-secondary">
                        <span className="text-apple-text-muted">Date:</span>
                        <span className="font-semibold text-apple-text-primary">{req.date}</span>
                      </div>
                      {req.assignedTo && (
                        <div className="flex items-center justify-between text-apple-blue pt-1 border-t border-apple-border/40 font-semibold">
                          <span className="inline-flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5" />
                            Assigned to:
                          </span>
                          <span className="font-bold">{req.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    {/* Assigned Banner Message */}
                    {req.status === 'Assigned' && req.assignedTo && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl p-2.5 text-xs font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-apple-blue shrink-0" />
                        <span>
                          <strong>{req.assignedTo}</strong> is handling this request.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-2 border-t border-apple-border/60 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenAssign(req)}
                        className="w-full py-2.5 px-3 rounded-xl bg-apple-blue text-white text-xs font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Handle Request</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setSelectedHandler('Local Service Provider');
                          setIsHandleModalOpen(true);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-apple-canvas hover:bg-blue-50 text-apple-text-primary hover:text-apple-blue text-xs font-bold transition-colors border border-apple-border flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5 text-apple-blue" />
                        <span>Arrange Service</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setIsCallingParent(true)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-apple-text-muted hover:text-apple-blue transition-colors px-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Parent</span>
                      </button>

                      {/* Status Advancement Button */}
                      {req.status !== 'In Progress' ? (
                        <button
                          onClick={() => handleStatusChange(req.id, 'In Progress')}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Mark In Progress</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(req.id, 'Completed')}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors inline-flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: COMPLETED REQUESTS
          ========================================================================= */}
      <div className="space-y-4 pt-4 border-t border-apple-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
              Completed Requests
            </h2>
            <p className="text-xs text-apple-text-muted">
              Resolved household repairs and maintenance history
            </p>
          </div>
        </div>

        {completedRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-apple-border text-center text-apple-text-muted text-sm shadow-apple-sm">
            No completed requests in this category yet.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-apple-border shadow-apple-sm divide-y divide-apple-border overflow-hidden">
            {completedRequests.map((item) => {
              const meta = getCategoryMeta(item.category);
              const CatIcon = meta.icon;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-apple-canvas/50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-apple-text-primary">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-apple-text-muted mt-0.5">
                        {item.details || 'Completed according to schedule'} • Resolved on{' '}
                        <strong className="text-apple-text-secondary">{item.completedDate || item.date}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="text-xs font-semibold text-apple-text-muted block">
                      Handled by:
                    </span>
                    <span className="text-xs font-bold text-apple-text-primary">
                      {item.assignedTo || 'Family Member'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: HANDLE REQUEST (Who will handle this?)
          ========================================================================= */}
      {isHandleModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden p-6 space-y-5 animate-slide-up"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-apple-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-apple-blue font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-apple-text-primary">
                    Handle Request
                  </h3>
                  <p className="text-xs text-apple-text-muted">
                    Assign a family member or provider
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHandleModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-muted hover:text-apple-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Request Details Preview */}
            <div className="bg-apple-canvas p-3.5 rounded-2xl border border-apple-border text-xs space-y-1">
              <span className="font-bold text-apple-text-primary block text-sm">
                {selectedRequest.title}
              </span>
              <p className="text-apple-text-muted">
                Category: {selectedRequest.category} • Requested by {selectedRequest.requestedBy}
              </p>
            </div>

            {/* Radio Options: Who will handle this? */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-apple-text-muted">
                Who will handle this?
              </label>

              <div className="space-y-2">
                {/* Option 1: Rahul Sharma */}
                <label
                  onClick={() => setSelectedHandler('Rahul Sharma')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedHandler === 'Rahul Sharma'
                      ? 'border-apple-blue bg-blue-50/60 ring-2 ring-apple-blue/20'
                      : 'border-apple-border hover:bg-apple-canvas'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-apple-blue font-extrabold flex items-center justify-center text-sm">
                      R
                    </div>
                    <div>
                      <div className="font-bold text-sm text-apple-text-primary">
                        Rahul Sharma
                      </div>
                      <div className="text-xs text-apple-text-muted">
                        Son • Family Member
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="handler"
                    checked={selectedHandler === 'Rahul Sharma'}
                    onChange={() => setSelectedHandler('Rahul Sharma')}
                    className="w-4 h-4 text-apple-blue accent-apple-blue"
                  />
                </label>

                {/* Option 2: Priya Sharma */}
                <label
                  onClick={() => setSelectedHandler('Priya Sharma')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedHandler === 'Priya Sharma'
                      ? 'border-apple-blue bg-blue-50/60 ring-2 ring-apple-blue/20'
                      : 'border-apple-border hover:bg-apple-canvas'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
                      P
                    </div>
                    <div>
                      <div className="font-bold text-sm text-apple-text-primary">
                        Priya Sharma
                      </div>
                      <div className="text-xs text-apple-text-muted">
                        Daughter • Family Member
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="handler"
                    checked={selectedHandler === 'Priya Sharma'}
                    onChange={() => setSelectedHandler('Priya Sharma')}
                    className="w-4 h-4 text-apple-blue accent-apple-blue"
                  />
                </label>

                {/* Option 3: Local Service Provider */}
                <label
                  onClick={() => setSelectedHandler('Local Service Provider')}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedHandler === 'Local Service Provider'
                      ? 'border-apple-blue bg-blue-50/60 ring-2 ring-apple-blue/20'
                      : 'border-apple-border hover:bg-apple-canvas'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-apple-text-primary">
                        Local Service Provider
                      </div>
                      <div className="text-xs text-apple-text-muted">
                        Verified technician or service agency
                      </div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="handler"
                    checked={selectedHandler === 'Local Service Provider'}
                    onChange={() => setSelectedHandler('Local Service Provider')}
                    className="w-4 h-4 text-apple-blue accent-apple-blue"
                  />
                </label>
              </div>

              {selectedHandler === 'Local Service Provider' && (
                <div className="pt-2 animate-fadeIn">
                  <label className="block text-xs font-semibold text-apple-text-secondary mb-1">
                    Provider Name / Service Details:
                  </label>
                  <input
                    type="text"
                    value={localProviderName}
                    onChange={(e) => setLocalProviderName(e.target.value)}
                    placeholder="e.g. Urban Company Electrician / Sunil Verma"
                    className="w-full text-xs p-3 rounded-xl border border-apple-border focus:ring-2 focus:ring-apple-blue/30 focus:border-apple-blue outline-none"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsHandleModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-apple-canvas hover:bg-gray-200 text-apple-text-secondary text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                className="flex-1 py-3 rounded-xl bg-apple-blue hover:bg-blue-600 text-white text-xs font-bold shadow-apple-sm transition-all cursor-pointer"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REQUEST SERVICE (+ New Request)
          ========================================================================= */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCreateNewRequest}
            className="bg-white w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden p-6 space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-3 border-b border-apple-border">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-apple-blue">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-apple-text-primary">
                    Request Household Service
                  </h3>
                  <p className="text-xs text-apple-text-muted">
                    Raise a maintenance ticket for {currentParent.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-apple-text-secondary mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-apple-border bg-white outline-none focus:ring-2 focus:ring-apple-blue/30"
                >
                  <option value="Plumbing">🔧 Plumbing</option>
                  <option value="Electrical">⚡ Electrical</option>
                  <option value="Carpentry">🪚 Carpentry</option>
                  <option value="Cleaning">🧹 Cleaning</option>
                  <option value="Appliance Repair">❄️ Appliance Repair</option>
                  <option value="Painting">🎨 Painting</option>
                  <option value="Other">🔧 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-secondary mb-1">
                  What needs repair or help?
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Geyser not heating properly in master bathroom"
                  className="w-full text-xs p-3 rounded-xl border border-apple-border outline-none focus:ring-2 focus:ring-apple-blue/30"
                >
                </input>
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-secondary mb-1">
                  Additional Details / Notes
                </label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Any specific symptoms or best time for the technician to visit..."
                  className="w-full text-xs p-3 rounded-xl border border-apple-border outline-none focus:ring-2 focus:ring-apple-blue/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNewRequestModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-apple-canvas hover:bg-gray-200 text-apple-text-secondary text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-apple-blue hover:bg-blue-600 text-white text-xs font-bold shadow-apple-sm transition-all cursor-pointer"
              >
                Create Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          MODAL: CALL PARENT SIMULATION
          ========================================================================= */}
      {isCallingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-apple-lg border border-apple-border text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-apple-text-primary">
                Calling {currentParent.name}
              </h3>
              <p className="text-xs text-apple-text-muted mt-1">
                +91 98200 12345 • Primary Mobile
              </p>
            </div>
            <div className="bg-apple-canvas p-3 rounded-2xl text-xs text-apple-text-secondary">
              Direct dial connected via Sahaay Senior Priority Channel.
            </div>
            <button
              onClick={() => setIsCallingParent(false)}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
