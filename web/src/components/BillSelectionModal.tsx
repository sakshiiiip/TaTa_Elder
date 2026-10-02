import React from 'react';
import { BillCategoryType } from '../types';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { X, ChevronRight, ShieldCheck } from 'lucide-react';

interface BillSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: BillCategoryType) => void;
}

export const BillSelectionModal: React.FC<BillSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const { currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  if (!isOpen) return null;

  const isHindi = currentLanguage.includes('Hindi') || currentLanguage.includes('हिंदी');
  const isMarathi = currentLanguage.includes('Marathi') || currentLanguage.includes('मराठी');
  const isTamil = currentLanguage.includes('Tamil') || currentLanguage.includes('தமிழ்');
  const isTelugu = currentLanguage.includes('Telugu') || currentLanguage.includes('తెలుగు');
  const isBengali = currentLanguage.includes('Bengali') || currentLanguage.includes('বাংলা');

  const options: {
    type: BillCategoryType;
    emoji: string;
    label: string;
    hint: string;
    bg: string;
    border: string;
  }[] = [
    {
      type: 'ELECTRICITY',
      emoji: '⚡',
      label: isHindi ? 'बिजली का बिल' : isMarathi ? 'वीज बिल' : isTamil ? 'மின் கட்டணம்' : isTelugu ? 'కరెంట్ బిల్లు' : isBengali ? 'বিদ্যুৎ বিল' : 'Electricity Bill',
      hint: isHindi ? 'उपभोक्ता आईडी' : 'Consumer ID',
      bg: 'bg-[#FFF8E1]',
      border: 'border-amber-300',
    },
    {
      type: 'WATER',
      emoji: '💧',
      label: isHindi ? 'पानी का बिल' : isMarathi ? 'पाणी बिल' : isTamil ? 'குடிநீர் கட்டணம்' : isTelugu ? 'నీటి బిల్లు' : isBengali ? 'জলের বিল' : 'Water Bill',
      hint: isHindi ? 'मीटर नंबर' : 'Meter ID',
      bg: 'bg-[#E1F5FE]',
      border: 'border-sky-300',
    },
    {
      type: 'MOBILE',
      emoji: '📱',
      label: isHindi ? 'मोबाइल रिचार्ज' : isMarathi ? 'मोबाइल रिचार्ज' : isTamil ? 'மொபைல் ரீசார்ஜ்' : isTelugu ? 'మొబైల్ రీఛార్జ్' : isBengali ? 'মোবাইল রিচার্জ' : 'Mobile Recharge',
      hint: isHindi ? 'मोबाइल नंबर' : 'Mobile Number',
      bg: 'bg-[#F3E5F5]',
      border: 'border-purple-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F5F7] w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
              💳
            </div>
            <div>
              <h2 className="text-xl font-bold text-apple-text-primary">{strings.billsTitle}</h2>
              <p className="text-xs text-apple-text-muted">{strings.billsSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                onSelectCategory(opt.type);
                onClose();
              }}
              className={`w-full bg-white hover:bg-gray-50/80 p-4 rounded-2xl border ${opt.border} shadow-apple-sm flex items-center justify-between transition-all hover:scale-101 cursor-pointer text-left group`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${opt.bg} flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform`}
                >
                  {opt.emoji}
                </div>
                <div>
                  <h4 className="font-bold text-base text-apple-text-primary">{opt.label}</h4>
                  <p className="text-xs text-apple-text-muted">{opt.hint}</p>
                </div>
              </div>

              <div className="w-9 h-9 rounded-full bg-apple-canvas flex items-center justify-center text-apple-blue group-hover:bg-apple-blue group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          ))}

          {/* Encryption Guarantee Notice */}
          <div className="mt-4 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-center gap-2 text-xs text-blue-900 font-medium text-center">
            <ShieldCheck className="w-4 h-4 text-apple-blue shrink-0" />
            <span>{strings.verifiedDesc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
