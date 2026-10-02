import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, CreditCard, Smartphone, Building, ArrowRight } from 'lucide-react';

interface PayForParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (billTitle: string, amount: string) => void;
}

export const PayForParentModal: React.FC<PayForParentModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentComplete('Electricity Bill', '1240');
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-modal-title"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-apple-sm flex items-center justify-center text-apple-blue">
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h2 id="pay-modal-title" className="text-xl font-bold text-apple-text-primary">
                Pay Bill for Parent
              </h2>
              <p className="text-xs text-apple-text-muted">
                Adani Electricity • Consumer #102938475
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-apple-text-muted transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-950">Payment Successful!</h3>
            <p className="text-sm text-emerald-800">
              ₹1,240 paid for Ashutosh's Electricity Bill. Receipt sent to your email & SMS notification sent to Ashutosh.
            </p>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Bill Summary Card */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-apple-border flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-apple-text-muted uppercase tracking-wider">
                  Amount Due
                </span>
                <div className="text-3xl font-extrabold text-apple-text-primary mt-0.5">
                  ₹1,240
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-1">
                  Due on 5 October (in 6 days)
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg">
                  Pending
                </span>
                <p className="text-xs text-apple-text-muted mt-2">Bandra West, Mumbai</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-apple-text-muted mb-2.5 block">
                Select Your Payment Method
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    selectedMethod === 'upi'
                      ? 'border-apple-blue bg-blue-50/70 text-apple-blue shadow-sm'
                      : 'border-apple-border bg-white hover:bg-gray-50 text-apple-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">UPI (Google Pay / PhonePe)</h4>
                      <p className="text-xs text-apple-text-muted">rahul.sharma@okhdfcbank</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Fastest</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    selectedMethod === 'card'
                      ? 'border-apple-blue bg-blue-50/70 text-apple-blue shadow-sm'
                      : 'border-apple-border bg-white hover:bg-gray-50 text-apple-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-apple-blue flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">HDFC Bank Debit Card</h4>
                      <p className="text-xs text-apple-text-muted">•••• 4092 (Expires 09/28)</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-apple-blue bg-blue-50/70 text-apple-blue shadow-sm'
                      : 'border-apple-border bg-white hover:bg-gray-50 text-apple-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Net Banking</h4>
                      <p className="text-xs text-apple-text-muted">HDFC, ICICI, SBI & all major banks</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Reassurance */}
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Receipt will be automatically saved in Ashutosh's account and family records.</span>
            </div>

            {/* Action */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-extrabold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isProcessing ? (
                <span>Processing Secure Payment...</span>
              ) : (
                <>
                  <span>Pay ₹1,240 for Ashutosh</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
