import React, { useState } from 'react';
import { X, ShoppingCart, Wrench, CheckCircle2, Clock, Calendar, Check, ArrowRight } from 'lucide-react';

interface HandleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestType: 'groceries' | 'repair' | 'all';
  onRequestHandled: (type: 'groceries' | 'repair', note: string) => void;
}

export const HandleRequestModal: React.FC<HandleRequestModalProps> = ({
  isOpen,
  onClose,
  requestType,
  onRequestHandled,
}) => {
  const [activeTab, setActiveTab] = useState<'groceries' | 'repair'>(
    requestType === 'repair' ? 'repair' : 'groceries'
  );
  const [successNote, setSuccessNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = (type: 'groceries' | 'repair', note: string) => {
    setSuccessNote(note);
    setTimeout(() => {
      onRequestHandled(type, note);
      setSuccessNote(null);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="handle-request-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-apple-border flex items-center justify-between">
          <div>
            <h2 id="handle-request-modal-title" className="text-xl font-bold text-apple-text-primary">
              Handle Parent Request
            </h2>
            <p className="text-xs text-apple-text-muted">
              Remotely fulfill Ashutosh's daily requirements in Mumbai
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-apple-text-muted transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-apple-border bg-gray-50/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('groceries')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'groceries'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-text-secondary hover:bg-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Groceries Request
          </button>
          <button
            onClick={() => setActiveTab('repair')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'repair'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'text-apple-text-secondary hover:bg-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Home Repair Request
          </button>
        </div>

        {successNote ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950">Action Completed!</h3>
            <p className="text-sm text-emerald-800">{successNote}</p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {activeTab === 'groceries' ? (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase">Current Request</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold">
                      Family Help Needed
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-amber-950 mt-1">
                    "Milk, vegetables and medicines"
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Requested by Ashutosh Pandey at 8:50 AM today
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() =>
                      handleAction(
                        'groceries',
                        'Ordered via Blinkit Instant Delivery to Bandra home (Estimated arrival: 45 mins)'
                      )
                    }
                    className="w-full p-4 bg-white hover:bg-blue-50/70 border border-apple-border hover:border-apple-blue rounded-2xl flex items-center justify-between text-left transition-all group shadow-apple-sm"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-apple-text-primary">
                        1. Order Quick Delivery to Mumbai Address
                      </h5>
                      <p className="text-xs text-apple-text-muted mt-0.5">
                        Blinkit / BigBasket 45-min delivery to Flat 402, Bandra West
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-apple-blue group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        'groceries',
                        'Rahul marked as handled: Handover coordinated with local grocery vendor (Gupta Stores)'
                      )
                    }
                    className="w-full p-4 bg-white hover:bg-emerald-50/70 border border-apple-border hover:border-emerald-300 rounded-2xl flex items-center justify-between text-left transition-all group shadow-apple-sm"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-apple-text-primary">
                        2. Call Local Mumbai Vendor (Gupta General Stores)
                      </h5>
                      <p className="text-xs text-apple-text-muted mt-0.5">
                        Monthly khata account delivery + cash on Rahul's UPI
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 uppercase">Assigned Maintenance</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-200 text-blue-900 font-bold">
                      Assigned to Rahul
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-blue-950 mt-1">
                    "Kitchen tap leaking"
                  </h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Continuous drip noted in kitchen sink
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() =>
                      handleAction(
                        'repair',
                        'Booked Urban Company Plumber (Tomorrow, 10:30 AM). Ashutosh notified by SMS.'
                      )
                    }
                    className="w-full p-4 bg-white hover:bg-blue-50/70 border border-apple-border hover:border-apple-blue rounded-2xl flex items-center justify-between text-left transition-all group shadow-apple-sm"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-apple-text-primary">
                        1. Schedule Verified Urban Company Plumber
                      </h5>
                      <p className="text-xs text-apple-text-muted mt-0.5">
                        Prepaid service • Arriving Tomorrow, 10:30 AM
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-apple-blue group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        'repair',
                        'Marked as resolved: Rahul confirmed building handyman fixed the washer.'
                      )
                    }
                    className="w-full p-4 bg-white hover:bg-emerald-50/70 border border-apple-border hover:border-emerald-300 rounded-2xl flex items-center justify-between text-left transition-all group shadow-apple-sm"
                  >
                    <div>
                      <h5 className="font-bold text-sm text-apple-text-primary">
                        2. Mark as Fixed / Handled
                      </h5>
                      <p className="text-xs text-apple-text-muted mt-0.5">
                        Building maintenance already addressed the leak
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-emerald-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
