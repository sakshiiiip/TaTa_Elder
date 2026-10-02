import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Droplets,
  ShoppingCart,
  Pill,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useFamily, BillItem } from '../../context/FamilyContext';
import { PayForParentModal } from '../../components/PayForParentModal';

export const Payments: React.FC = () => {
  const { bills, payBill } = useFamily();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<BillItem | null>(null);

  const pendingBills = bills.filter(b => b.status === 'Pending');
  const paidBills = bills.filter(b => b.status === 'Paid');

  const filteredBills =
    filter === 'pending'
      ? pendingBills
      : filter === 'paid'
      ? paidBills
      : bills;

  const totalPendingAmount = pendingBills.reduce((acc, curr) => {
    const numeric = parseInt(curr.amount.replace(/,/g, ''), 10) || 0;
    return acc + numeric;
  }, 0);

  const getCategoryIcon = (category: BillItem['category']) => {
    switch (category) {
      case 'electricity':
        return Zap;
      case 'water':
        return Droplets;
      case 'groceries':
        return ShoppingCart;
      case 'medicine':
        return Pill;
      default:
        return CreditCard;
    }
  };

  const getCategoryColor = (category: BillItem['category']) => {
    switch (category) {
      case 'electricity':
        return 'bg-amber-100 text-amber-700';
      case 'water':
        return 'bg-blue-100 text-apple-blue';
      case 'groceries':
        return 'bg-emerald-100 text-emerald-700';
      case 'medicine':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header & Summary Cards */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              💳 Remote Bill Payments
            </span>
            <span className="text-xs text-apple-text-muted font-semibold">
              Parent UPI & Meter Linked
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
            Payments & Utility Bills
          </h1>
          <p className="text-sm text-apple-text-muted mt-1">
            Pay Ashutosh’s household electricity, water, medicine, and grocery bills directly without bothering him.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-apple-canvas rounded-2xl p-4 border border-apple-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <div className="text-[11px] font-bold text-apple-text-muted">Total Due</div>
              <div className="text-lg font-extrabold text-red-600">₹{totalPendingAmount.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="bg-apple-canvas rounded-2xl p-4 border border-apple-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-[11px] font-bold text-apple-text-muted">Paid This Month</div>
              <div className="text-lg font-extrabold text-emerald-700">₹3,020</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter Navigation */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-apple-blue text-white shadow-sm'
                : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
            }`}
          >
            All Bills ({bills.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
            }`}
          >
            Pending ({pendingBills.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'paid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-apple-text-secondary hover:text-apple-text-primary border border-apple-border'
            }`}
          >
            Paid ({paidBills.length})
          </button>
        </div>

        <span className="text-xs font-semibold text-apple-text-muted flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Bank-grade 256-bit encrypted UPI & BBPS payments
        </span>
      </div>

      {/* 3. Bills Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBills.map((bill) => {
          const Icon = getCategoryIcon(bill.category);
          const iconColor = getCategoryColor(bill.category);
          const isPending = bill.status === 'Pending';

          return (
            <div
              key={bill.id}
              className={`bg-white rounded-3xl p-6 border transition-all shadow-apple-sm flex flex-col justify-between ${
                isPending
                  ? 'border-red-200 hover:shadow-apple-md'
                  : 'border-apple-border hover:shadow-apple-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-apple-text-muted">
                        {bill.category}
                      </span>
                      <h3 className="font-extrabold text-lg text-apple-text-primary leading-tight">
                        {bill.title}
                      </h3>
                      <p className="text-xs text-apple-text-muted mt-0.5">{bill.provider}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${
                      isPending
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-apple-canvas border border-apple-border grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-apple-text-muted block">Amount Due</span>
                    <span className={`text-lg font-black ${isPending ? 'text-red-600' : 'text-apple-text-primary'}`}>
                      ₹{bill.amount}
                    </span>
                  </div>
                  <div>
                    <span className="text-apple-text-muted block">
                      {isPending ? 'Due Date' : 'Paid On'}
                    </span>
                    <span className="text-sm font-bold text-apple-text-primary">
                      {isPending ? bill.due : `${bill.paidOn || '16 Sep'} via ${bill.paymentMethod || 'UPI'}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-apple-border flex items-center justify-between">
                {isPending ? (
                  <button
                    onClick={() => setSelectedBillForPayment(bill)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-apple-blue hover:bg-apple-blue-dark text-white font-extrabold text-sm rounded-xl shadow-apple-sm transition-all cursor-pointer active:scale-98"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{bill.amount} for Parent</span>
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-apple-text-muted">
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Payment Confirmed
                    </span>
                    <button
                      onClick={() => alert(`Receipt downloaded for ${bill.title}`)}
                      className="font-bold text-apple-blue hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Pay For Parent Modal */}
      {selectedBillForPayment && (
        <PayForParentModal
          isOpen={Boolean(selectedBillForPayment)}
          onClose={() => setSelectedBillForPayment(null)}
          onPaymentComplete={() => {
            payBill(selectedBillForPayment.id);
            setSelectedBillForPayment(null);
          }}
        />
      )}
    </div>
  );
};
