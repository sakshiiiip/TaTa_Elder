import React, { createContext, useContext, useState } from 'react';
import { ShoppingCart, Wrench, Utensils, Sparkles, Pill, AlertTriangle, Bell, CheckCircle2, CreditCard } from 'lucide-react';

export interface BillItem {
  id: string;
  category: 'electricity' | 'water' | 'medicine' | 'groceries';
  title: string;
  provider: string;
  amount: string;
  due: string;
  status: 'Pending' | 'Paid';
  paidOn?: string;
  paymentMethod?: string;
}

export interface DailyRequestItem {
  id: string;
  category: 'groceries' | 'repair' | 'cooking' | 'cleaning' | 'medicine';
  title: string;
  desc: string;
  status: string;
  statusType: 'help_needed' | 'assigned' | 'completed' | 'normal';
  assignedTo: string;
  time: string;
}

export interface FamilyTaskItem {
  id: string;
  title: string;
  assignee: 'Rahul' | 'Priya';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
}

export interface FamilyNotificationItem {
  id: string;
  type: 'checkin' | 'medicine' | 'payment' | 'request' | 'emergency';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  priority: 'high' | 'normal';
}

interface FamilyContextType {
  // Check-in
  checkInCompleted: boolean;
  toggleCheckIn: () => void;

  // Bills & Payments
  bills: BillItem[];
  payBill: (billId: string) => void;

  // Daily Life Requests
  dailyRequests: DailyRequestItem[];
  handleFulfillRequest: (reqId: string, statusText: string) => void;
  assignDailyRequest: (reqId: string, assignee: string) => void;

  // Family Tasks
  familyTasks: FamilyTaskItem[];
  toggleTaskStatus: (taskId: string) => void;
  reassignTask: (taskId: string) => void;
  addFamilyTask: (title: string, assignee: 'Rahul' | 'Priya', dueDate: string) => void;

  // Notifications
  notifications: FamilyNotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkInCompleted, setCheckInCompleted] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleCheckIn = () => {
    setCheckInCompleted(prev => !prev);
    showToast(!checkInCompleted ? 'Simulated: Check-in completed' : 'Simulated: Missed check-in alert active');
  };

  // 1. BILLS
  const [bills, setBills] = useState<BillItem[]>([
    {
      id: '1',
      category: 'electricity',
      title: 'Electricity Bill',
      provider: 'Adani Electricity Mumbai Ltd.',
      amount: '1,240',
      due: '5 October 2026',
      status: 'Pending',
    },
    {
      id: '2',
      category: 'water',
      title: 'Water Charges',
      provider: 'Municipal Corp of Greater Mumbai (MCGM)',
      amount: '480',
      due: '18 September 2026',
      status: 'Paid',
      paidOn: '16 September 2026',
      paymentMethod: 'UPI (Rahul)',
    },
    {
      id: '3',
      category: 'medicine',
      title: 'Monthly Prescription Refill',
      provider: 'Apollo Pharmacy Bandra West',
      amount: '650',
      due: '14 September 2026',
      status: 'Paid',
      paidOn: '14 September 2026',
      paymentMethod: 'Credit Card (Priya)',
    },
    {
      id: '4',
      category: 'groceries',
      title: 'Monthly Dairy & Staples',
      provider: 'Sahakari Bhandar Cooperative',
      amount: '1,890',
      due: '1 September 2026',
      status: 'Paid',
      paidOn: '1 September 2026',
      paymentMethod: 'UPI (Rahul)',
    },
  ]);

  const payBill = (billId: string) => {
    setBills(prev =>
      prev.map(b => (b.id === billId ? { ...b, status: 'Paid', paidOn: 'Today', paymentMethod: 'UPI (Rahul)' } : b))
    );
    // Also complete the task if paying electricity bill
    setFamilyTasks(prev =>
      prev.map(t => (t.title.toLowerCase().includes('electricity') ? { ...t, status: 'Completed' } : t))
    );
    showToast('Payment successful! Receipt shared with Ashutosh.');
  };

  // 2. DAILY REQUESTS
  const [dailyRequests, setDailyRequests] = useState<DailyRequestItem[]>([
    {
      id: 'req-1',
      category: 'groceries',
      title: 'Groceries & Provisions',
      desc: 'Cow milk (2L), curd, fresh spinach, tomatoes & digestive biscuits',
      status: 'Family help needed',
      statusType: 'help_needed',
      assignedTo: 'Unassigned',
      time: 'Today, 8:40 AM',
    },
    {
      id: 'req-2',
      category: 'repair',
      title: 'Kitchen Tap Leaking',
      desc: 'Under-sink cold water tap leaking onto tile floor',
      status: 'Assigned to Rahul',
      statusType: 'assigned',
      assignedTo: 'Rahul',
      time: 'Yesterday, 6:15 PM',
    },
    {
      id: 'req-3',
      category: 'cooking',
      title: 'Daily Lunch & Dinner',
      desc: 'Satvik low-sodium tiffin subscription active through society mess',
      status: 'Normal',
      statusType: 'normal',
      assignedTo: 'Priya (Auto-renewed)',
      time: 'Ongoing',
    },
    {
      id: 'req-4',
      category: 'cleaning',
      title: 'Deep House Dusting',
      desc: 'Scheduled balcony and fan cleaning through trusted cooperative helper',
      status: 'Completed',
      statusType: 'completed',
      assignedTo: 'Priya',
      time: '2 days ago',
    },
    {
      id: 'req-5',
      category: 'medicine',
      title: 'Amlodipine 5mg Strip Refill',
      desc: 'Blood pressure maintenance strip ending in 4 days',
      status: 'Assigned to Rahul',
      statusType: 'assigned',
      assignedTo: 'Rahul',
      time: 'Today, 9:15 AM',
    },
  ]);

  const handleFulfillRequest = (reqId: string, statusText: string) => {
    setDailyRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status: statusText, statusType: 'completed' } : r))
    );
    showToast(`Request updated: ${statusText}`);
  };

  const assignDailyRequest = (reqId: string, assignee: string) => {
    setDailyRequests(prev =>
      prev.map(r =>
        r.id === reqId
          ? {
              ...r,
              assignedTo: assignee,
              status: `Assigned to ${assignee}`,
              statusType: 'assigned',
            }
          : r
      )
    );
    showToast(`Request assigned to ${assignee}`);
  };

  // 3. FAMILY TASKS
  const [familyTasks, setFamilyTasks] = useState<FamilyTaskItem[]>([
    {
      id: 't-1',
      title: 'Pay electricity bill',
      assignee: 'Rahul',
      status: 'Pending',
      dueDate: '5 Oct',
    },
    {
      id: 't-2',
      title: 'Book cardiologist follow-up',
      assignee: 'Priya',
      status: 'Completed',
      dueDate: '28 Sep',
    },
    {
      id: 't-3',
      title: 'Check kitchen tap plumber arrival',
      assignee: 'Rahul',
      status: 'In Progress',
      dueDate: 'Today',
    },
    {
      id: 't-4',
      title: 'Call on Sunday afternoon',
      assignee: 'Priya',
      status: 'Pending',
      dueDate: 'Sun, 4 PM',
    },
  ]);

  const toggleTaskStatus = (taskId: string) => {
    setFamilyTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const nextStatus =
            task.status === 'Completed'
              ? 'Pending'
              : task.status === 'Pending'
              ? 'In Progress'
              : 'Completed';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const reassignTask = (taskId: string) => {
    setFamilyTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const nextAssignee = task.assignee === 'Rahul' ? 'Priya' : 'Rahul';
          showToast(`Reassigned "${task.title}" to ${nextAssignee}`);
          return { ...task, assignee: nextAssignee };
        }
        return task;
      })
    );
  };

  const addFamilyTask = (title: string, assignee: 'Rahul' | 'Priya', dueDate: string) => {
    const newTask: FamilyTaskItem = {
      id: `t-${Date.now()}`,
      title,
      assignee,
      status: 'Pending',
      dueDate: dueDate || 'This week',
    };
    setFamilyTasks(prev => [newTask, ...prev]);
    showToast(`Assigned new task to ${assignee}`);
  };

  // 4. NOTIFICATIONS
  const [notifications, setNotifications] = useState<FamilyNotificationItem[]>([
    {
      id: 'notif-1',
      type: 'checkin',
      title: 'Morning Check-in Recorded',
      description: 'Ashutosh checked in at 9:02 AM: "I am feeling good and took morning medicine."',
      time: 'Today, 9:02 AM',
      isRead: false,
      priority: 'normal',
    },
    {
      id: 'notif-2',
      type: 'medicine',
      title: 'Medicine Taken: Amlodipine 5mg',
      description: 'Ashutosh confirmed morning blood pressure medicine with warm water.',
      time: 'Today, 8:30 AM',
      isRead: false,
      priority: 'normal',
    },
    {
      id: 'notif-3',
      type: 'payment',
      title: 'Electricity Bill Due Soon',
      description: 'Adani Electricity bill of ₹1,240 is due in 5 days (5 October).',
      time: 'Today, 8:00 AM',
      isRead: false,
      priority: 'high',
    },
    {
      id: 'notif-4',
      type: 'request',
      title: 'New Grocery Request Logged',
      description: 'Ashutosh added milk and vegetables to daily grocery list.',
      time: 'Yesterday, 8:40 PM',
      isRead: true,
      priority: 'normal',
    },
    {
      id: 'notif-5',
      type: 'emergency',
      title: 'Weekly Safety Check Passed',
      description: 'All emergency contacts verified. No emergency events logged this week.',
      time: '2 days ago',
      isRead: true,
      priority: 'normal',
    },
  ]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  return (
    <FamilyContext.Provider
      value={{
        checkInCompleted,
        toggleCheckIn,
        bills,
        payBill,
        dailyRequests,
        handleFulfillRequest,
        assignDailyRequest,
        familyTasks,
        toggleTaskStatus,
        reassignTask,
        addFamilyTask,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toastMessage,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-apple-text-primary text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-apple-lg border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </FamilyContext.Provider>
  );
};

export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
