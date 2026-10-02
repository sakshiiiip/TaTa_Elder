import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  Car,
  AlertTriangle,
  Plus,
  CheckCircle2,
  CalendarPlus,
  X,
  ChevronRight,
  ShieldCheck,
  User,
  Phone,
  FileText,
} from 'lucide-react';
import {
  FamilyDataBridge,
  FamilyAppointment,
  TransportDetails,
} from '../../services/familyDataBridge';
import { useFamily } from '../../context/FamilyContext';

export const AppointmentsTransport: React.FC = () => {
  const { showToast } = useFamily();
  const [appointments, setAppointments] = useState<FamilyAppointment[]>(() =>
    FamilyDataBridge.getAppointments()
  );

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [detailsAppointment, setDetailsAppointment] = useState<FamilyAppointment | null>(null);

  // Booking Form State
  const [bookForm, setBookForm] = useState({
    parentName: 'Ashutosh Pandey',
    doctor: 'Dr. Sharma',
    specialty: 'Cardiology',
    hospital: 'City Care Hospital',
    date: '4 October 2026',
    time: '5:00 PM',
    reason: 'Regular ECG and blood pressure review',
  });

  // Transport Form State
  const [transportType, setTransportType] = useState<'family' | 'cab' | 'medical'>('family');
  const [driverName, setDriverName] = useState('Rahul Sharma');
  const [pickupLocation, setPickupLocation] = useState('Home (Flat 402, Sunshine Apts, Bandra West)');
  const [pickupTime, setPickupTime] = useState('4:15 PM');
  const [transportNote, setTransportNote] = useState('Rahul driving from Pune morning, reaching Bandra by 3:45 PM');

  useEffect(() => {
    FamilyDataBridge.saveAppointments(appointments);
  }, [appointments]);

  // Handle Book Appointment
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt = FamilyDataBridge.addAppointment({
      doctor: bookForm.doctor,
      specialty: bookForm.specialty,
      hospital: bookForm.hospital,
      date: bookForm.date,
      time: bookForm.time,
      reason: bookForm.reason,
      parentName: bookForm.parentName,
      status: 'Confirmed',
    });

    setAppointments(FamilyDataBridge.getAppointments());
    setIsBookModalOpen(false);
    showToast('Appointment booked successfully.');
  };

  // Open Transport Modal for a specific appointment
  const handleOpenTransportModal = (aptId: string) => {
    setSelectedAppointmentId(aptId);
    const targetApt = appointments.find((a) => a.id === aptId);
    if (targetApt?.transport) {
      setTransportType(targetApt.transport.type);
      setDriverName(targetApt.transport.driverName || 'Rahul Sharma');
      setPickupLocation(targetApt.transport.pickupLocation);
      setPickupTime(targetApt.transport.pickupTime);
      setTransportNote(targetApt.transport.note || '');
    } else {
      setTransportType('family');
      setDriverName('Rahul Sharma');
      setPickupLocation('Home (Flat 402, Sunshine Apts, Bandra West)');
      setPickupTime('4:15 PM');
      setTransportNote('Rahul will take parent');
    }
    setIsTransportModalOpen(true);
  };

  // Handle Save Transport
  const handleSaveTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId) return;

    let providerName = 'Family Ride';
    if (transportType === 'cab') providerName = 'Book a cab for parent (Uber Senior Assist)';
    if (transportType === 'medical') providerName = 'Medical Transport (Ambulance / Wheelchair Van)';

    const details: TransportDetails = {
      type: transportType,
      providerName,
      driverName: transportType === 'family' ? driverName : providerName,
      pickupLocation,
      pickupTime,
      status: 'Confirmed',
      note: transportNote,
    };

    const updated = FamilyDataBridge.updateAppointmentTransport(selectedAppointmentId, details);
    setAppointments(updated);
    setIsTransportModalOpen(false);
    showToast('Transport arranged successfully ✓');
  };

  // Handle Cancel Appointment
  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment for Ashutosh?')) {
      const updated = FamilyDataBridge.cancelAppointment(id);
      setAppointments(updated);
      showToast('Appointment cancelled.');
    }
  };

  // Handle Add to Calendar
  const handleAddToCalendar = (apt: FamilyAppointment) => {
    const title = `${apt.doctor} (${apt.specialty}) Appointment - Ashutosh`;
    const details = `Hospital: ${apt.hospital}\nTime: ${apt.date} at ${apt.time}\nReason: ${apt.reason}`;
    showToast(`Added "${title}" to your family calendar.`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-apple-blue-light text-apple-blue text-xs font-bold rounded-full">
                Remote Healthcare Coordination
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                Synced with Ashutosh
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
              Appointments & Transport
            </h1>
            <p className="text-sm sm:text-base text-apple-text-muted mt-1 max-w-2xl">
              Help manage your parent's doctor appointments, hospital visits, and arranged rides from Pune or Bengaluru.
            </p>
          </div>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-sm rounded-2xl shadow-apple transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Book Appointment</span>
          </button>
        </div>
      </section>

      {/* 2. Upcoming Appointments List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-apple-text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5 text-apple-blue" />
            <span>Upcoming Appointments</span>
          </h2>
          <span className="text-xs font-bold text-apple-text-muted">
            {appointments.filter((a) => a.status !== 'Cancelled').length} Scheduled
          </span>
        </div>

        <div className="space-y-5">
          {appointments.map((apt) => {
            const isConfirmed = apt.status === 'Confirmed';
            const isCancelled = apt.status === 'Cancelled';

            return (
              <div
                key={apt.id}
                className={`bg-white rounded-3xl p-5 sm:p-7 border transition-all shadow-apple-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                  isCancelled ? 'border-gray-200 opacity-60 bg-gray-50/50' : 'border-apple-border'
                }`}
              >
                {/* Left: Doctor & Schedule Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-apple-blue flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                      <Stethoscope className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-apple-text-primary">
                          {apt.doctor}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-apple-blue">
                          {apt.specialty}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            isConfirmed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-apple-text-secondary flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1 font-semibold text-apple-text-primary">
                          <Calendar className="w-3.5 h-3.5 text-apple-blue" />
                          {apt.date} • {apt.time}
                        </span>
                        <span className="flex items-center gap-1 text-apple-text-muted">
                          <MapPin className="w-3.5 h-3.5 text-apple-text-muted" />
                          {apt.hospital}
                        </span>
                      </p>

                      <p className="text-xs text-apple-text-muted">
                        Reason: <strong className="text-apple-text-secondary">{apt.reason}</strong> • Patient: {apt.parentName}
                      </p>
                    </div>
                  </div>

                  {/* Actions for this appointment */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-apple-border/70">
                    <button
                      onClick={() => setDetailsAppointment(apt)}
                      className="px-3.5 py-1.5 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setBookForm({
                          parentName: apt.parentName,
                          doctor: apt.doctor,
                          specialty: apt.specialty,
                          hospital: apt.hospital,
                          date: apt.date,
                          time: apt.time,
                          reason: apt.reason,
                        });
                        setIsBookModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-apple-blue font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleAddToCalendar(apt)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                      <span>Add to Calendar</span>
                    </button>
                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: TRANSPORT SECTION */}
                <div className="lg:w-80 p-4 sm:p-5 rounded-2xl bg-apple-canvas/70 border border-apple-border space-y-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-apple-text-muted uppercase tracking-wider flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-apple-blue" />
                      Transport
                    </span>

                    {apt.transport ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Transport arranged ✓
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Needs Ride
                      </span>
                    )}
                  </div>

                  {apt.transport ? (
                    <div className="space-y-1.5 text-xs text-apple-text-secondary">
                      <div className="font-bold text-apple-text-primary text-sm flex items-center gap-1.5">
                        <span>{apt.transport.type === 'family' ? '🚗' : apt.transport.type === 'cab' ? '🚕' : '🚑'}</span>
                        <span>{apt.transport.driverName || apt.transport.providerName}</span>
                      </div>
                      <div>
                        Pickup: <strong>{apt.transport.pickupLocation}</strong>
                      </div>
                      <div>
                        Pickup time: <strong className="text-apple-blue font-bold">{apt.transport.pickupTime}</strong>
                      </div>
                      {apt.transport.note && (
                        <p className="text-[11px] text-apple-text-muted italic">
                          "{apt.transport.note}"
                        </p>
                      )}
                      <button
                        onClick={() => handleOpenTransportModal(apt.id)}
                        className="mt-2 text-xs font-bold text-apple-blue hover:underline cursor-pointer block"
                      >
                        Change Transport Details →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-apple-text-muted">
                        No transport scheduled yet. Rahul or Priya can arrange a ride, book a cab, or request medical van.
                      </p>
                      <button
                        onClick={() => handleOpenTransportModal(apt.id)}
                        className="w-full py-2 bg-white hover:bg-blue-50 border border-apple-border hover:border-apple-blue text-apple-blue font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Arrange Transport</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          BOOK APPOINTMENT MODAL
          ========================================================================= */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 border-b border-apple-border flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-apple-blue-light text-apple-blue flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-apple-text-primary">
                    Book Doctor Appointment
                  </h3>
                  <p className="text-xs text-apple-text-muted">
                    Coordinate clinic or hospital visit for Ashutosh
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="w-8 h-8 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Select Parent
                </label>
                <select
                  value={bookForm.parentName}
                  onChange={(e) => setBookForm({ ...bookForm, parentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm font-semibold bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                >
                  <option value="Ashutosh Pandey">Ashutosh Pandey (Father • 68 yrs • Bandra West)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={bookForm.doctor}
                    onChange={(e) => setBookForm({ ...bookForm, doctor: e.target.value })}
                    placeholder="e.g. Dr. Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Speciality
                  </label>
                  <select
                    value={bookForm.specialty}
                    onChange={(e) => setBookForm({ ...bookForm, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Neurology">Neurology</option>
                    <option value="ENT Specialist">ENT Specialist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Hospital / Clinic
                </label>
                <input
                  type="text"
                  value={bookForm.hospital}
                  onChange={(e) => setBookForm({ ...bookForm, hospital: e.target.value })}
                  placeholder="e.g. City Care Hospital or Apollo Clinic Bandra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={bookForm.date}
                    onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                    placeholder="e.g. 4 October 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={bookForm.time}
                    onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })}
                    placeholder="e.g. 5:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Reason for Visit
                </label>
                <textarea
                  rows={2}
                  value={bookForm.reason}
                  onChange={(e) => setBookForm({ ...bookForm, reason: e.target.value })}
                  placeholder="e.g. Regular ECG and blood pressure review"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                  required
                />
              </div>

              <div className="pt-3 border-t border-apple-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-apple-text-secondary hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-xs rounded-xl shadow-apple transition-all cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          ARRANGE TRANSPORT MODAL
          🚗 Family Ride | 🚕 Cab | 🚑 Medical Transport
          ========================================================================= */}
      {isTransportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 border-b border-apple-border flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-apple-blue text-white flex items-center justify-center shadow-sm">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-apple-text-primary">
                    Arrange Transport for Parent
                  </h3>
                  <p className="text-xs text-apple-text-muted">
                    Safe door-to-door transit for medical appointments
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTransportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransport} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {/* Transport Options Selection */}
              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-2">
                  Select Transport Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTransportType('family');
                      setDriverName('Rahul Sharma');
                      setTransportNote('Rahul will take parent');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      transportType === 'family'
                        ? 'bg-blue-50/80 border-apple-blue text-apple-blue font-bold shadow-xs ring-2 ring-apple-blue/20'
                        : 'bg-apple-canvas border-apple-border text-apple-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚗</div>
                    <div className="font-bold text-sm">Family Ride</div>
                    <div className="text-[11px] text-apple-text-muted mt-0.5">Rahul will take parent</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTransportType('cab');
                      setDriverName('Uber Senior Assist');
                      setTransportNote('Book a cab for parent');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      transportType === 'cab'
                        ? 'bg-blue-50/80 border-apple-blue text-apple-blue font-bold shadow-xs ring-2 ring-apple-blue/20'
                        : 'bg-apple-canvas border-apple-border text-apple-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚕</div>
                    <div className="font-bold text-sm">Cab</div>
                    <div className="text-[11px] text-apple-text-muted mt-0.5">Book a cab for parent</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTransportType('medical');
                      setDriverName('City Care Medical Ambulance');
                      setTransportNote('For medical/emergency needs');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      transportType === 'medical'
                        ? 'bg-blue-50/80 border-apple-blue text-apple-blue font-bold shadow-xs ring-2 ring-apple-blue/20'
                        : 'bg-apple-canvas border-apple-border text-apple-text-primary hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚑</div>
                    <div className="font-bold text-sm">Medical Transport</div>
                    <div className="text-[11px] text-apple-text-muted mt-0.5">For medical/emergency needs</div>
                  </button>
                </div>
              </div>

              {transportType === 'family' && (
                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Family Driver / Escort
                  </label>
                  <select
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                  >
                    <option value="Rahul Sharma">Rahul Sharma (Son)</option>
                    <option value="Priya Sharma">Priya Sharma (Daughter)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Pickup Location
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Pickup Time
                </label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="e.g. 4:15 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Notes for Ride
                </label>
                <input
                  type="text"
                  value={transportNote}
                  onChange={(e) => setTransportNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm bg-apple-canvas outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>

              <div className="pt-3 border-t border-apple-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsTransportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-apple-text-secondary hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-apple transition-all cursor-pointer"
                >
                  Confirm Transport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {detailsAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-apple-lg border border-apple-border p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-apple-border">
              <h3 className="font-extrabold text-lg text-apple-text-primary">
                Appointment Details
              </h3>
              <button
                onClick={() => setDetailsAppointment(null)}
                className="w-8 h-8 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-sm text-apple-text-secondary">
              <p><strong>Doctor:</strong> {detailsAppointment.doctor} ({detailsAppointment.specialty})</p>
              <p><strong>Hospital:</strong> {detailsAppointment.hospital}</p>
              <p><strong>Date & Time:</strong> {detailsAppointment.date} at {detailsAppointment.time}</p>
              <p><strong>Reason:</strong> {detailsAppointment.reason}</p>
              <p><strong>Status:</strong> {detailsAppointment.status}</p>
              {detailsAppointment.transport ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 mt-2 text-xs">
                  <div className="font-bold">Transport Arranged ✓</div>
                  <div>Driver: {detailsAppointment.transport.driverName}</div>
                  <div>Pickup: {detailsAppointment.transport.pickupLocation} ({detailsAppointment.transport.pickupTime})</div>
                </div>
              ) : (
                <p className="text-xs text-amber-700 font-semibold mt-2">No transport arranged yet.</p>
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDetailsAppointment(null)}
                className="px-5 py-2 bg-apple-canvas hover:bg-gray-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTransport;
