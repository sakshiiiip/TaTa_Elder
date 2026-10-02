/**
 * familyDataBridge.ts
 * Shared data bridge and persistence layer between Sahaay Parent Dashboard and Family Connect.
 * Enables live synchronization of Doctor Appointments & Transport, Home Maintenance requests,
 * and Weekly Summary metrics without requiring backend server setup.
 */

export interface TransportDetails {
  type: 'family' | 'cab' | 'medical';
  providerName: string;
  driverName?: string;
  pickupLocation: string;
  pickupTime: string;
  status: 'Confirmed' | 'Scheduled' | 'Pending';
  note?: string;
}

export interface FamilyAppointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  reason: string;
  parentName: string;
  status: 'Confirmed' | 'Rescheduled' | 'Cancelled';
  transport?: TransportDetails;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Carpentry' | 'Cleaning' | 'Appliance Repair' | 'Painting' | 'Other';
  requestedBy: string;
  date: string;
  status: 'Requested' | 'Assigned' | 'In Progress' | 'Completed';
  assignedTo?: string;
  handlerType?: 'Rahul Sharma' | 'Priya Sharma' | 'Local Service Provider';
  details?: string;
  completedDate?: string;
}

const STORAGE_KEYS = {
  APPOINTMENTS: 'sahaay_family_appointments',
  MAINTENANCE: 'sahaay_home_maintenance_requests',
  WEEKLY_SUMMARY: 'sahaay_weekly_summary',
};

// Initial Sample Appointments
const DEFAULT_APPOINTMENTS: FamilyAppointment[] = [
  {
    id: 'apt-1',
    doctor: 'Dr. Sharma',
    specialty: 'Cardiology',
    hospital: 'City Care Hospital',
    date: '4 October 2026',
    time: '5:00 PM',
    reason: 'Regular ECG and blood pressure review',
    parentName: 'Ashutosh Pandey',
    status: 'Confirmed',
    transport: {
      type: 'family',
      providerName: 'Family Ride',
      driverName: 'Rahul Sharma',
      pickupLocation: 'Home (Flat 402, Sunshine Apts, Bandra West)',
      pickupTime: '4:15 PM',
      status: 'Confirmed',
      note: 'Rahul taking parent via Western Express Highway',
    },
  },
  {
    id: 'apt-2',
    doctor: 'Dr. Anita Mehta',
    specialty: 'Ophthalmology',
    hospital: 'Vision Eye Institute Bandra',
    date: '12 October 2026',
    time: '11:00 AM',
    reason: 'Annual cataract follow-up and vision test',
    parentName: 'Ashutosh Pandey',
    status: 'Confirmed',
  },
];

// Initial Sample Maintenance Requests
const DEFAULT_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'maint-101',
    title: 'Kitchen tap is leaking',
    category: 'Plumbing',
    requestedBy: 'Ashutosh Pandey',
    date: '30 September',
    status: 'Requested',
    details: 'Under-sink cold water tap leaking onto tile floor. Washer needs replacement.',
  },
  {
    id: 'maint-102',
    title: 'Balcony tube light flickering',
    category: 'Electrical',
    requestedBy: 'Ashutosh Pandey',
    date: '29 September',
    status: 'Assigned',
    assignedTo: 'Rahul Sharma',
    handlerType: 'Rahul Sharma',
    details: 'LED ballast replacement in main balcony.',
  },
  {
    id: 'maint-103',
    title: 'Bathroom light repair',
    category: 'Electrical',
    requestedBy: 'Ashutosh Pandey',
    date: '28 September',
    status: 'Completed',
    assignedTo: 'Sunil Verma (Local Electrician)',
    handlerType: 'Local Service Provider',
    completedDate: '28 September',
    details: 'Ceiling bulb holder replaced and tested.',
  },
  {
    id: 'maint-104',
    title: 'Bedroom cupboard door hinge loose',
    category: 'Carpentry',
    requestedBy: 'Ashutosh Pandey',
    date: '24 September',
    status: 'Completed',
    assignedTo: 'Priya Sharma',
    handlerType: 'Priya Sharma',
    completedDate: '25 September',
    details: 'Screws tightened and oiled.',
  },
];

export const FamilyDataBridge = {
  // 1. Appointments API
  getAppointments(): FamilyAppointment[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_APPOINTMENTS;
  },

  saveAppointments(list: FamilyAppointment[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
      // Also update parent single booked appointment key if applicable
      const primary = list.find(a => a.status === 'Confirmed');
      if (primary) {
        localStorage.setItem(
          'sahaay_appointment',
          JSON.stringify({
            doctor: primary.doctor,
            specialty: primary.specialty,
            clinic: primary.hospital,
            date: primary.date,
            time: primary.time,
            confirmed: true,
            transportArranged: !!primary.transport,
            transportNote: primary.transport ? `${primary.transport.driverName || primary.transport.providerName} pickup at ${primary.transport.pickupTime}` : undefined,
          })
        );
      }
    } catch (_) {}
  },

  addAppointment(appointment: Omit<FamilyAppointment, 'id'>): FamilyAppointment {
    const appointments = this.getAppointments();
    const newApt: FamilyAppointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
    };
    const updated = [newApt, ...appointments];
    this.saveAppointments(updated);
    return newApt;
  },

  updateAppointmentTransport(aptId: string, transport: TransportDetails): FamilyAppointment[] {
    const appointments = this.getAppointments();
    const updated = appointments.map(a => (a.id === aptId ? { ...a, transport } : a));
    this.saveAppointments(updated);
    return updated;
  },

  cancelAppointment(aptId: string): FamilyAppointment[] {
    const appointments = this.getAppointments();
    const updated = appointments.map(a => (a.id === aptId ? { ...a, status: 'Cancelled' as const } : a));
    this.saveAppointments(updated);
    return updated;
  },

  // 2. Home Maintenance API
  getMaintenanceRequests(): MaintenanceRequest[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_MAINTENANCE;
  },

  saveMaintenanceRequests(list: MaintenanceRequest[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(list));
    } catch (_) {}
  },

  addMaintenanceRequest(req: Omit<MaintenanceRequest, 'id' | 'status' | 'date'> & { date?: string }): MaintenanceRequest {
    const list = this.getMaintenanceRequests();
    const newReq: MaintenanceRequest = {
      ...req,
      id: `maint-${Date.now().toString().slice(-4)}`,
      date: req.date || 'Today',
      status: 'Requested',
    };
    const updated = [newReq, ...list];
    this.saveMaintenanceRequests(updated);
    return newReq;
  },

  assignMaintenanceRequest(
    reqId: string,
    handlerType: 'Rahul Sharma' | 'Priya Sharma' | 'Local Service Provider',
    assignedTo: string
  ): MaintenanceRequest[] {
    const list = this.getMaintenanceRequests();
    const updated = list.map(item => {
      if (item.id === reqId) {
        return {
          ...item,
          status: 'Assigned' as const,
          handlerType,
          assignedTo,
        };
      }
      return item;
    });
    this.saveMaintenanceRequests(updated);
    return updated;
  },

  updateMaintenanceStatus(reqId: string, status: 'Requested' | 'Assigned' | 'In Progress' | 'Completed'): MaintenanceRequest[] {
    const list = this.getMaintenanceRequests();
    const updated = list.map(item => {
      if (item.id === reqId) {
        return {
          ...item,
          status,
          completedDate: status === 'Completed' ? 'Today' : item.completedDate,
        };
      }
      return item;
    });
    this.saveMaintenanceRequests(updated);
    return updated;
  },
};
