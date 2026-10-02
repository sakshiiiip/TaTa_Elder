import React from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { Stethoscope, Receipt, FileText, AlertTriangle } from 'lucide-react';

interface QuickActionsSectionProps {
  onDoctorClick: () => void;
  onBillsClick: () => void;
  onFormsClick: () => void;
  onSosClick: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onDoctorClick,
  onBillsClick,
  onFormsClick,
  onSosClick,
}) => {
  const { currentLanguage, showFeedback } = useSahaay();
  const strings = getStrings(currentLanguage);

  const actions = [
    {
      id: 'doctor',
      title: strings.doctorTitle,
      subtitle: strings.doctorSubtitle,
      btn: strings.doctorBtn,
      icon: Stethoscope,
      iconColor: 'text-doctor-blue',
      iconBg: 'bg-doctor-bg',
      onClick: onDoctorClick,
    },
    {
      id: 'bills',
      title: strings.billsTitle,
      subtitle: strings.billsSubtitle,
      btn: strings.billsBtn,
      icon: Receipt,
      iconColor: 'text-bills-green',
      iconBg: 'bg-bills-bg',
      onClick: onBillsClick,
    },
    {
      id: 'forms',
      title: strings.formsTitle,
      subtitle: strings.formsSubtitle,
      btn: strings.formsBtn,
      icon: FileText,
      iconColor: 'text-forms-orange',
      iconBg: 'bg-forms-bg',
      onClick: onFormsClick,
    },
    {
      id: 'sos',
      title: strings.sosTitle,
      subtitle: strings.sosSubtitle,
      btn: strings.sosBtn,
      icon: AlertTriangle,
      iconColor: 'text-sos-red',
      iconBg: 'bg-sos-bg',
      onClick: onSosClick,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xl font-bold text-apple-text-primary">{strings.exploreTasks}</h3>
        <button
          onClick={() => showFeedback('Viewing all elderly support services')}
          className="text-sm font-semibold text-apple-blue hover:underline"
        >
          {strings.seeAll}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              onClick={act.onClick}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-apple-border shadow-apple-sm hover:shadow-apple-md transition-all flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-base text-apple-text-primary truncate">
                    {act.title}
                  </h4>
                  <p className="text-xs text-apple-text-muted truncate">{act.subtitle}</p>
                </div>
              </div>

              {/* Blue pill button matching Kotlin QuickActionCard */}
              <button
                type="button"
                className="w-full py-2 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-sm rounded-full transition-colors shadow-sm"
              >
                {act.btn}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
