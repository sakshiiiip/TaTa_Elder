import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { DoctorBookingState } from '../types';
import { X, CheckCircle, Stethoscope, MapPin, Clock, Video, Building, Calendar } from 'lucide-react';

interface DoctorAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: number;
  initialState?: Partial<DoctorBookingState>;
}

export const DoctorAppointmentModal: React.FC<DoctorAppointmentModalProps> = ({
  isOpen,
  onClose,
  initialTab = 0,
  initialState,
}) => {
  const { bookedAppointment, updateAppointment, cancelAppointment, showFeedback } = useSahaay();

  const [selectedTab, setSelectedTab] = useState<number>(() => {
    if (initialTab !== undefined) return initialTab;
    return bookedAppointment?.specialty ? 0 : 1;
  });

  const [specialty, setSpecialty] = useState<string>(
    initialState?.specialty || bookedAppointment?.specialty || 'General Physician'
  );
  const [location, setLocation] = useState<string>(
    initialState?.location || bookedAppointment?.location || 'Bandra Medical Clinic'
  );
  const [dateTime, setDateTime] = useState<string>(
    initialState?.dateTime || bookedAppointment?.dateTime || 'Tomorrow at 5:00 PM'
  );
  const [mode, setMode] = useState<string>(
    initialState?.mode || bookedAppointment?.mode || 'in-person clinic visit'
  );

  const specialties = [
    'General Physician',
    'Dermatologist',
    'Cardiologist',
    'Pediatrician',
    'Dentist',
    'Orthopedic',
    'Eye Specialist',
    'ENT Specialist',
  ];

  const quickTimes = [
    'Today at 4:00 PM',
    'Tomorrow at 10:00 AM',
    'Tomorrow at 5:00 PM',
    'Next Monday 11:00 AM',
  ];

  if (!isOpen) return null;

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: DoctorBookingState = {
      specialty,
      location,
      dateTime,
      mode,
      isConfirmed: true,
    };
    updateAppointment(newBooking);
    showFeedback(`Doctor appointment scheduled with ${specialty}!`);
    onClose();
  };

  const handleCancel = () => {
    cancelAppointment();
    showFeedback('Appointment cancelled.');
    setSelectedTab(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F5F7] w-full max-w-2xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-apple-border flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-apple-text-primary">
              Doctor Appointments
            </h2>
            <p className="text-xs sm:text-sm text-apple-text-muted">
              Manage or schedule healthcare visits
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-white border-b border-apple-border flex gap-2">
          <button
            onClick={() => setSelectedTab(0)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              selectedTab === 0
                ? 'bg-apple-blue text-white shadow-sm'
                : 'bg-apple-canvas text-apple-text-secondary hover:text-apple-text-primary'
            }`}
          >
            Active Booking
          </button>
          <button
            onClick={() => setSelectedTab(1)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              selectedTab === 1
                ? 'bg-apple-blue text-white shadow-sm'
                : 'bg-apple-canvas text-apple-text-secondary hover:text-apple-text-primary'
            }`}
          >
            Book Manually
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {selectedTab === 0 ? (
            /* Active Booking Details */
            bookedAppointment?.specialty ? (
              <div className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    {bookedAppointment.isConfirmed ? 'CONFIRMED' : 'IN PROGRESS'}
                  </span>
                  <span className="text-xs text-apple-text-muted font-mono font-medium">
                    Booking ID: #SAH-8821
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-apple-blue shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-apple-text-muted font-medium">Doctor Specialty</div>
                      <div className="text-base font-bold text-apple-text-primary">
                        {bookedAppointment.specialty}
                      </div>
                    </div>
                  </div>

                  <hr className="border-apple-border/60" />

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-apple-blue shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-apple-text-muted font-medium">Location / Clinic</div>
                      <div className="text-base font-bold text-apple-text-primary">
                        {bookedAppointment.location}
                      </div>
                    </div>
                  </div>

                  <hr className="border-apple-border/60" />

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-apple-blue shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-apple-text-muted font-medium">Preferred Date & Time</div>
                      <div className="text-base font-bold text-apple-text-primary">
                        {bookedAppointment.dateTime}
                      </div>
                    </div>
                  </div>

                  <hr className="border-apple-border/60" />

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 text-apple-blue shrink-0">
                      {bookedAppointment.mode?.toLowerCase().includes('online') ? (
                        <Video className="w-5 h-5" />
                      ) : (
                        <Building className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-apple-text-muted font-medium">Consultation Mode</div>
                      <div className="text-base font-bold text-apple-text-primary capitalize">
                        {bookedAppointment.mode}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCancel}
                    className="w-full py-3 border border-red-300 text-red-600 hover:bg-red-50 font-bold rounded-2xl transition-colors cursor-pointer"
                  >
                    Cancel This Appointment
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-apple-border text-center space-y-3">
                <span className="text-4xl">📋</span>
                <h3 className="font-bold text-lg text-apple-text-primary">No Active Appointment</h3>
                <p className="text-sm text-apple-text-muted max-w-sm mx-auto">
                  You do not have any upcoming doctor appointments. Use the form or speak to Sahaay to schedule one.
                </p>
                <button
                  onClick={() => setSelectedTab(1)}
                  className="px-5 py-2.5 bg-apple-blue text-white font-bold rounded-xl text-sm"
                >
                  Schedule Appointment
                </button>
              </div>
            )
          ) : (
            /* Manual Booking Form */
            <form onSubmit={handleBookSubmit} className="space-y-4">
              {/* Doctor Specialty selection */}
              <div className="bg-white rounded-3xl p-5 border border-apple-border space-y-3">
                <label className="block text-sm font-bold text-apple-text-primary">
                  1. Select Doctor Specialty
                </label>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => setSpecialty(spec)}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        specialty === spec
                          ? 'bg-apple-blue text-white shadow-sm'
                          : 'bg-apple-canvas text-apple-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input */}
              <div className="bg-white rounded-3xl p-5 border border-apple-border space-y-3">
                <label className="block text-sm font-bold text-apple-text-primary">
                  2. Area or Clinic Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full px-4 py-3 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-apple-text-primary text-sm font-medium"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="bg-white rounded-3xl p-5 border border-apple-border space-y-3">
                <label className="block text-sm font-bold text-apple-text-primary">
                  3. Preferred Date & Time
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {quickTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDateTime(time)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        dateTime === time
                          ? 'border-apple-blue bg-apple-blue-light text-apple-blue'
                          : 'border-apple-border bg-apple-canvas text-apple-text-secondary'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="Or enter custom time (e.g. Monday 3 PM)"
                  className="w-full px-4 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-apple-text-primary text-sm"
                />
              </div>

              {/* Mode Selection */}
              <div className="bg-white rounded-3xl p-5 border border-apple-border space-y-3">
                <label className="block text-sm font-bold text-apple-text-primary">
                  4. Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('in-person clinic visit')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      mode.includes('in-person')
                        ? 'border-apple-blue bg-apple-blue-light text-apple-blue font-bold'
                        : 'border-apple-border bg-apple-canvas text-apple-text-secondary font-medium'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <div>
                      <div className="text-sm font-bold">In-Person Visit</div>
                      <div className="text-xs text-apple-text-muted">Clinic appointment</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('online consultation')}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      mode.includes('online')
                        ? 'border-apple-blue bg-apple-blue-light text-apple-blue font-bold'
                        : 'border-apple-border bg-apple-canvas text-apple-text-secondary font-medium'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <div>
                      <div className="text-sm font-bold">Online Consultation</div>
                      <div className="text-xs text-apple-text-muted">Video or phone call</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold rounded-2xl shadow-apple-md transition-all active:scale-98 cursor-pointer"
              >
                Schedule Appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
