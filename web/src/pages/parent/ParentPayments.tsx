import React, { useState } from 'react';
import { useSahaay } from '../../context/SahaayContext';
import { getStrings } from '../../localization/strings';
import {
  Receipt,
  Zap,
  Droplet,
  Pill,
  CreditCard,
  CheckCircle2,
  Clock,
  Send,
  Check,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from 'lucide-react';

interface BillItem {
  id: string;
  category: 'electricity' | 'water' | 'medicine' | 'gas';
  provider: string;
  consumerNumber: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid';
  paidDate?: string;
  paidBy?: string;
}

export const ParentPayments: React.FC = () => {
  const { showFeedback, speakText, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [bills, setBills] = useState<BillItem[]>([
    {
      id: 'BILL-01',
      category: 'electricity',
      provider: 'MSEDCL Mumbai Electricity',
      consumerNumber: '028650019234',
      amount: 1450,
      dueDate: '2 Oct 2026',
      status: 'Pending',
    },
    {
      id: 'BILL-02',
      category: 'water',
      provider: 'MCGM Water Department',
      consumerNumber: 'W-991204',
      amount: 480,
      dueDate: '25 Sep 2026',
      status: 'Paid',
      paidDate: '24 Sep 2026',
      paidBy: 'Paid by Rahul (Son)',
    },
    {
      id: 'BILL-03',
      category: 'medicine',
      provider: 'Apollo Pharmacy Bandra',
      consumerNumber: 'RX-77402',
      amount: 650,
      dueDate: '20 Sep 2026',
      status: 'Paid',
      paidDate: '20 Sep 2026',
      paidBy: 'Direct UPI Payment',
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [payingBillId, setPayingBillId] = useState<string | null>(null);

  const pendingTotal = bills
    .filter((b) => b.status === 'Pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const paidTotal = bills
    .filter((b) => b.status === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayNow = (id: string, provider: string, amount: number) => {
    setPayingBillId(id);
    setTimeout(() => {
      setBills((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status: 'Paid',
                paidDate: 'Today',
                paidBy: 'Direct UPI Payment',
              }
            : b
        )
      );
      setPayingBillId(null);
      showFeedback(`${strings.paymentSuccessful}: ₹${amount} (${provider})`);
      speakText(`${strings.paymentSuccessful}: ₹${amount}`);
    }, 900);
  };

  const handleAskFamily = (provider: string, amount: number) => {
    showFeedback(`${strings.requestSentFeedback}: ${provider} (₹${amount})`);
    speakText(`${strings.requestSentFeedback}: ${provider}`);
  };

  const filteredBills = bills.filter((b) => {
    if (activeFilter === 'pending') return b.status === 'Pending';
    if (activeFilter === 'paid') return b.status === 'Paid';
    return true;
  });

  const getBillIcon = (category: string) => {
    switch (category) {
      case 'electricity':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'water':
        return <Droplet className="w-6 h-6 text-blue-500" />;
      case 'medicine':
        return <Pill className="w-6 h-6 text-purple-500" />;
      default:
        return <Receipt className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-apple-border">
        <div>
          <span className="text-xs font-semibold text-bills-green uppercase tracking-wider">
            {strings.paymentsHeaderBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-apple-text-primary tracking-tight mt-1">
            {strings.parentPaymentsTitle}
          </h1>
          <p className="text-sm sm:text-base text-apple-text-secondary mt-1">
            {strings.parentPaymentsSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-apple-blue font-bold text-xs border border-blue-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            {strings.paymentsSafeBadge}
          </span>
        </div>
      </div>

      {/* 1. FINANCIAL SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="bg-white p-5 rounded-3xl border border-apple-border shadow-apple-sm">
          <span className="text-xs font-bold text-apple-text-muted uppercase tracking-wider">
            {strings.totalPendingLabel}
          </span>
          <div className="text-3xl font-black text-amber-600 mt-2">
            ₹{pendingTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-apple-text-muted mt-1">
            {bills.filter((b) => b.status === 'Pending').length} {strings.filterPendingLabel}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-apple-border shadow-apple-sm">
          <span className="text-xs font-bold text-apple-text-muted uppercase tracking-wider">
            {strings.totalPaidMonthLabel}
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            ₹{paidTotal.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-apple-text-muted mt-1">
            {bills.filter((b) => b.status === 'Paid').length} {strings.filterPaidLabel}
          </p>
        </div>

        <div className="bg-blue-50/60 p-5 rounded-3xl border border-blue-200 shadow-apple-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-apple-blue font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>{strings.familyCareBadge}</span>
            </div>
            <p className="text-xs text-apple-text-secondary mt-1">
              {strings.familyNetworkActiveSub}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-apple-blue mt-2">
            {strings.familyNetworkActive}
          </span>
        </div>
      </div>

      {/* 2. BILLS LIST WITH ACTIONS */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-bills-green" />
            <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary">
              {strings.parentPaymentsTitle}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-apple-canvas p-1 rounded-2xl border border-apple-border">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-apple-text-primary shadow-xs'
                  : 'text-apple-text-muted hover:text-apple-text-primary'
              }`}
            >
              {strings.filterAllLabel}
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'pending'
                  ? 'bg-white text-apple-text-primary shadow-xs'
                  : 'text-apple-text-muted hover:text-apple-text-primary'
              }`}
            >
              {strings.filterPendingLabel}
            </button>
            <button
              onClick={() => setActiveFilter('paid')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFilter === 'paid'
                  ? 'bg-white text-apple-text-primary shadow-xs'
                  : 'text-apple-text-muted hover:text-apple-text-primary'
              }`}
            >
              {strings.filterPaidLabel}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                bill.status === 'Pending'
                  ? 'bg-amber-50/30 border-amber-200'
                  : 'bg-white border-apple-border'
              }`}
            >
              {/* Bill Details */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-apple-canvas border border-apple-border flex items-center justify-center shrink-0">
                  {getBillIcon(bill.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-apple-text-primary">
                      {bill.provider}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        bill.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {bill.status === 'Pending' ? strings.filterPendingLabel : strings.filterPaidLabel}
                    </span>
                  </div>

                  <p className="text-xs text-apple-text-muted mt-0.5">
                    ID: {bill.consumerNumber}
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-apple-text-secondary">
                      {strings.billDueOn}: <strong className="text-apple-text-primary">{bill.dueDate}</strong>
                    </span>
                    {bill.paidBy && (
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                        {bill.paidBy} ({bill.paidDate})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount & Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-apple-border/70">
                <div className="text-left md:text-right">
                  <span className="text-xs text-apple-text-muted block">{strings.totalPendingLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-apple-text-primary">
                    ₹{bill.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {bill.status === 'Pending' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAskFamily(bill.provider, bill.amount)}
                      className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-apple-blue font-bold text-xs rounded-xl border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      title={strings.askFamilyPayBtn}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{strings.askFamilyPayBtn}</span>
                    </button>
                    <button
                      onClick={() => handlePayNow(bill.id, bill.provider, bill.amount)}
                      disabled={payingBillId === bill.id}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{payingBillId === bill.id ? '...' : strings.payNowBtn}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{strings.filterPaidLabel}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentPayments;
