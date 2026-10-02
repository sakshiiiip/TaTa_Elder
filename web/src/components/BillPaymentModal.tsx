import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { BillCategoryType, BillPayment, BILL_TYPES } from '../types';
import { X, CheckCircle, Shield, ArrowRight, Loader2 } from 'lucide-react';

interface BillPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BillCategoryType;
  initialIdentifier?: string;
  initialProvider?: string;
  initialAmount?: string;
}

export const BillPaymentModal: React.FC<BillPaymentModalProps> = ({
  isOpen,
  onClose,
  category,
  initialIdentifier,
  initialProvider,
  initialAmount,
}) => {
  const info = BILL_TYPES[category] || BILL_TYPES.ELECTRICITY;
  const { recordBillPayment, showFeedback } = useSahaay();

  const [identifier, setIdentifier] = useState<string>(
    initialIdentifier || info.sampleIdentifier
  );
  const [provider, setProvider] = useState<string>(
    initialProvider || info.defaultProvider
  );
  const [amount, setAmount] = useState<string>(
    initialAmount || info.defaultAmount
  );

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<BillPayment | null>(null);

  if (!isOpen) return null;

  const quickAmounts = ['299', '499', '1000', '1450', '2000'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const payment: BillPayment = {
        id: `BP-${Math.floor(10000 + Math.random() * 90000)}`,
        type: category,
        identifier: identifier.trim(),
        provider: provider.trim(),
        amount: amount.trim(),
        status: 'Paid Successfully',
        timestamp: formattedDate,
      };

      recordBillPayment(payment);
      setIsProcessing(false);
      setReceipt(payment);
      showFeedback(`₹${amount} paid successfully for ${info.title}!`);
    }, 1200);
  };

  const handleFinish = () => {
    setReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F5F7] w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{info.iconEmoji}</span>
            <div>
              <h2 className="text-xl font-bold text-apple-text-primary">{info.title}</h2>
              <p className="text-xs text-apple-text-muted">Instant & Secure Settlement</p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="w-9 h-9 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {receipt ? (
            /* Success Receipt View */
            <div className="bg-white rounded-3xl p-6 border border-green-300 shadow-apple-md text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-green-700">Payment Successful!</h3>
                <p className="text-sm text-apple-text-secondary mt-1">
                  ₹{receipt.amount} paid towards {info.title}
                </p>
              </div>

              <div className="bg-apple-canvas rounded-2xl p-4 text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Transaction ID:</span>
                  <span className="font-mono font-bold text-apple-text-primary">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Provider:</span>
                  <span className="font-semibold text-apple-text-primary">{receipt.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Reference / ID:</span>
                  <span className="font-semibold text-apple-text-primary">{receipt.identifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Time:</span>
                  <span className="font-semibold text-apple-text-primary">{receipt.timestamp}</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* Payment Input Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account ID / Identifier */}
              <div className="bg-white rounded-2xl p-4 border border-apple-border space-y-1.5">
                <label className="block text-xs font-bold text-apple-text-primary uppercase tracking-wider">
                  {info.fieldLabel}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={`Enter ${info.fieldLabel}`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-apple-text-primary text-sm font-semibold"
                  required
                />
              </div>

              {/* Service Provider */}
              <div className="bg-white rounded-2xl p-4 border border-apple-border space-y-1.5">
                <label className="block text-xs font-bold text-apple-text-primary uppercase tracking-wider">
                  Service Provider / Operator
                </label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Adani Electricity, Tata Power, Jio"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-apple-text-primary text-sm font-semibold"
                  required
                />
              </div>

              {/* Amount & Quick Chips */}
              <div className="bg-white rounded-2xl p-4 border border-apple-border space-y-2">
                <label className="block text-xs font-bold text-apple-text-primary uppercase tracking-wider">
                  Amount to Pay (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold text-apple-text-muted">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-apple-text-primary text-lg font-bold"
                    required
                  />
                </div>

                {/* Quick amount chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        amount === amt
                          ? 'bg-apple-blue text-white'
                          : 'bg-apple-canvas text-apple-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing || !identifier || !amount}
                className="w-full py-4 bg-apple-blue hover:bg-apple-blue-dark disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-apple-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{amount || 0} Securely</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
