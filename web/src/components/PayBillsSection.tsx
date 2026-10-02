import React from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { BillCategoryType } from '../types';

interface PayBillsSectionProps {
  onCategoryClick: (type: BillCategoryType) => void;
}

export const PayBillsSection: React.FC<PayBillsSectionProps> = ({ onCategoryClick }) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const isHindi = currentLanguage.includes('Hindi') || currentLanguage.includes('हिंदी');
  const isMarathi = currentLanguage.includes('Marathi') || currentLanguage.includes('मराठी');
  const isTamil = currentLanguage.includes('Tamil') || currentLanguage.includes('தமிழ்');
  const isTelugu = currentLanguage.includes('Telugu') || currentLanguage.includes('తెలుగు');
  const isBengali = currentLanguage.includes('Bengali') || currentLanguage.includes('বাংলা');

  const electricityLabel = isHindi ? 'बिजली बिल' : isMarathi ? 'वीज बिल' : isTamil ? 'மின் கட்டணம்' : isTelugu ? 'కరెంట్ బిల్లు' : isBengali ? 'বিদ্যুৎ বিল' : 'Electricity';
  const waterLabel = isHindi ? 'पानी का बिल' : isMarathi ? 'पाणी बिल' : isTamil ? 'குடிநீர் கட்டணம்' : isTelugu ? 'నీటి బిల్లు' : isBengali ? 'জলের বিল' : 'Water';
  const rechargeLabel = isHindi ? 'मोबाइल रिचार्ज' : isMarathi ? 'मोबाइल रिचार्ज' : isTamil ? 'மொபைல் ரீசார்ஜ்' : isTelugu ? 'మొబైల్ రీఛార్జ్' : isBengali ? 'মোবাইল রিচার্জ' : 'Recharge';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xl font-bold text-apple-text-primary">{strings.billsTitle}</h3>
        <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
          {strings.heroBadge3}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Electricity */}
        <button
          onClick={() => onCategoryClick('ELECTRICITY')}
          className="bg-white hover:bg-yellow-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center text-2xl mb-2.5 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <span className="font-bold text-sm sm:text-base text-apple-text-primary line-clamp-1">
            {electricityLabel}
          </span>
          <span className="text-xs font-semibold text-apple-blue mt-1">{strings.billsBtn}</span>
        </button>

        {/* Water */}
        <button
          onClick={() => onCategoryClick('WATER')}
          className="bg-white hover:bg-sky-50/50 rounded-2xl p-4 sm:p-5 border border-sky-200 shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#E1F5FE] flex items-center justify-center text-2xl mb-2.5 group-hover:scale-110 transition-transform">
            💧
          </div>
          <span className="font-bold text-sm sm:text-base text-apple-text-primary line-clamp-1">
            {waterLabel}
          </span>
          <span className="text-xs font-semibold text-apple-blue mt-1">{strings.billsBtn}</span>
        </button>

        {/* Mobile Recharge */}
        <button
          onClick={() => onCategoryClick('MOBILE')}
          className="bg-white hover:bg-purple-50/50 rounded-2xl p-4 sm:p-5 border border-purple-200 shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col items-center text-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-[#F3E5F5] flex items-center justify-center text-2xl mb-2.5 group-hover:scale-110 transition-transform">
            📱
          </div>
          <span className="font-bold text-sm sm:text-base text-apple-text-primary line-clamp-1">
            {rechargeLabel}
          </span>
          <span className="text-xs font-semibold text-apple-blue mt-1">{strings.billsBtn}</span>
        </button>
      </div>
    </div>
  );
};
