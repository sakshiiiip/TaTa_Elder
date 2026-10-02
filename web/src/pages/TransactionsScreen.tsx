import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { BillPaymentModal } from '../components/BillPaymentModal';
import { DoctorAppointmentModal } from '../components/DoctorAppointmentModal';
import { BillCategoryType, TransactionRecord } from '../types';
import {
  CreditCard,
  Calendar,
  Zap,
  Droplet,
  Smartphone,
  Search,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';

export const TransactionsScreen: React.FC = () => {
  const { transactions, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [activeFilter, setActiveFilter] = useState<'all' | 'bills' | 'doctor'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Re-pay / detail modals
  const [selectedCategory, setSelectedCategory] = useState<BillCategoryType>('ELECTRICITY');
  const [isBillPaymentModalOpen, setIsBillPaymentModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // Compute spend metrics
  const totalSpent = transactions.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
  const totalBills = transactions.filter((t) => t.category !== 'DOCTOR').length;
  const totalDoctor = transactions.filter((t) => t.category === 'DOCTOR').length;

  const filteredTransactions = transactions.filter((t) => {
    const isDoctor = t.category === 'DOCTOR';
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'bills' && !isDoctor) ||
      (activeFilter === 'doctor' && isDoctor);

    const matchesSearch =
      t.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleAction = (item: TransactionRecord) => {
    if (item.category === 'DOCTOR') {
      setIsDoctorModalOpen(true);
    } else {
      setSelectedCategory((item.billType || item.category) as BillCategoryType);
      setIsBillPaymentModalOpen(true);
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'ELECTRICITY') return <Zap className="w-5 h-5 text-amber-500" />;
    if (category === 'WATER') return <Droplet className="w-5 h-5 text-blue-500" />;
    if (category === 'MOBILE') return <Smartphone className="w-5 h-5 text-green-500" />;
    return <Calendar className="w-5 h-5 text-apple-blue" />;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16 animate-fade-in space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {strings.navTransactions}
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {strings.noTransactionsDesc}
        </p>
      </div>

      {/* Spend Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{strings.totalUtilitiesPaid}</span>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{strings.utilityReceipts}</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{totalBills}</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>{strings.doctorConsultations}</span>
            <Calendar className="w-4 h-4 text-apple-blue" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{totalDoctor}</p>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: strings.allHistory },
            { id: 'bills', label: strings.utilityBills },
            { id: 'doctor', label: strings.doctorVisits },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-apple-blue text-white shadow-md'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={strings.searchReceipts}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-2xl border border-gray-200 focus:outline-none focus:border-apple-blue text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">{strings.noTransactionsFound}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {strings.noTransactionsDesc}
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex-shrink-0">
                  {getCategoryIcon(tx.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{tx.provider}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        tx.status.toLowerCase() === 'successful'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {tx.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    ID / Ref: {tx.identifier} {tx.doctorSpecialty ? `• ${tx.doctorSpecialty}` : ''}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-gray-400 mt-2">
                    <span>Date: {tx.timestamp}</span>
                    <span>•</span>
                    <span>Ref: {tx.id}</span>
                  </div>
                </div>
              </div>

              {/* Amount & Quick Re-Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <p className="text-xl md:text-2xl font-black text-gray-900">
                  ₹{Number(tx.amount).toLocaleString('en-IN')}
                </p>

                <button
                  onClick={() => handleAction(tx)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-apple-blue hover:text-primary-dark cursor-pointer"
                >
                  <span>{tx.category === 'DOCTOR' ? strings.viewDetails : strings.payAgain}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Payment Modal */}
      <BillPaymentModal
        isOpen={isBillPaymentModalOpen}
        onClose={() => setIsBillPaymentModalOpen(false)}
        category={selectedCategory}
      />

      {/* Doctor Appointment Modal */}
      <DoctorAppointmentModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />
    </div>
  );
};
