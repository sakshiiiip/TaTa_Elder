import React from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { Stethoscope, MapPin, Clock, ChevronRight } from 'lucide-react';

interface DoctorBookingWidgetProps {
  onClick: () => void;
}

export const DoctorBookingWidget: React.FC<DoctorBookingWidgetProps> = ({ onClick }) => {
  const { bookedAppointment, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const isBooked = !!bookedAppointment?.specialty;

  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-apple-border shadow-apple-md hover:shadow-apple-lg transition-all cursor-pointer group"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-doctor-bg flex items-center justify-center text-doctor-blue shadow-sm group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-apple-text-primary leading-tight">{strings.doctorTitle}</h3>
            <p className="text-xs sm:text-sm font-semibold text-green-600">
              {isBooked ? strings.activeAppointment : strings.bookClinicVisits}
            </p>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-bold text-apple-blue bg-apple-blue-light px-3 py-1.5 rounded-xl group-hover:bg-blue-100 transition-colors">
          {isBooked ? strings.viewDetails : strings.bookNow}
        </span>
      </div>

      <hr className="my-4 border-apple-border/70" />

      {/* Content Area */}
      {isBooked ? (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xl">👨‍⚕️</span>
            <span className="font-bold text-base text-apple-text-primary">
              {bookedAppointment.specialty}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                bookedAppointment.mode?.toLowerCase().includes('online')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {bookedAppointment.mode?.toLowerCase().includes('online') ? strings.onlineConsultation : strings.inPersonConsultation}
            </span>
          </div>

          {bookedAppointment.location && (
            <div className="flex items-center gap-2 text-sm text-apple-text-secondary">
              <MapPin className="w-4 h-4 text-apple-text-muted" />
              <span>{bookedAppointment.location}</span>
            </div>
          )}

          {bookedAppointment.dateTime && (
            <div className="flex items-center gap-2 text-sm font-semibold text-apple-blue">
              <Clock className="w-4 h-4" />
              <span>{bookedAppointment.dateTime}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between text-apple-text-secondary text-sm">
          <span>{strings.bookClinicVisits}</span>
          <ChevronRight className="w-4 h-4 text-apple-text-muted group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );
};
