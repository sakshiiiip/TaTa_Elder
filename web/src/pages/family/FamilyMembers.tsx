import React, { useState } from 'react';
import {
  Users,
  User,
  Heart,
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useFamily, FamilyTaskItem } from '../../context/FamilyContext';
import { FamilyMessageModal } from '../../components/FamilyMessageModal';

export const FamilyMembers: React.FC = () => {
  const {
    familyTasks,
    toggleTaskStatus,
    reassignTask,
    addFamilyTask,
    showToast,
  } = useFamily();

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'message' | 'voice' | 'call'>('call');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<'Rahul' | 'Priya'>('Rahul');
  const [newTaskDueDate, setNewTaskDueDate] = useState('Tomorrow');

  const familyMembersList = [
    {
      id: 'rahul',
      name: 'Rahul Sharma',
      relation: 'Son (Primary Account)',
      city: 'Pune, Maharashtra',
      distance: '148 km from Mumbai',
      role: 'Handles utility payments & home repairs',
      phone: '+91 98765 43210',
      initials: 'R',
      avatarBg: 'bg-blue-100 text-apple-blue',
      status: 'Active Now',
    },
    {
      id: 'priya',
      name: 'Priya Sharma',
      relation: 'Daughter (Co-Caregiver)',
      city: 'Bengaluru, Karnataka',
      distance: '980 km from Mumbai',
      role: 'Handles doctor appointments & tiffin meal plans',
      phone: '+91 98765 24680',
      initials: 'P',
      avatarBg: 'bg-purple-100 text-purple-700',
      status: 'Available',
    },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addFamilyTask(newTaskTitle.trim(), newTaskAssignee, newTaskDueDate);
    setNewTaskTitle('');
    setIsAddTaskModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-purple-50 text-purple-800 text-xs font-bold rounded-full border border-purple-200">
              👥 Family Circle & Coordination
            </span>
            <span className="text-xs text-apple-text-muted font-semibold">
              Shared Caregiving
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-apple-text-primary tracking-tight">
            Family Members & Responsibilities
          </h1>
          <p className="text-sm text-apple-text-muted mt-1">
            Coordinate with siblings to manage Ashutosh’s healthcare, bills, and daily check-ins without duplicate work.
          </p>
        </div>

        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold text-sm rounded-2xl shadow-apple-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Family Task</span>
        </button>
      </section>

      {/* 2. Parent Profile Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-apple-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-apple-blue-light text-apple-blue flex items-center justify-center font-black text-2xl shadow-sm">
              👴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-apple-text-primary">
                  Ashutosh Pandey
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-apple-blue border border-blue-200">
                  Parent • 68 yrs
                </span>
              </div>
              <p className="text-xs sm:text-sm text-apple-text-muted flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-apple-blue shrink-0" />
                <span>Flat 402, Shanti Kunj, Bandra West, Mumbai, MH 400050</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setModalMode('call');
                setIsMessageModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Ashutosh</span>
            </button>
            <button
              onClick={() => {
                setModalMode('message');
                setIsMessageModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-apple-canvas hover:bg-gray-200 text-apple-text-primary font-bold text-xs rounded-xl border border-apple-border transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-apple-blue" />
              <span>Send Message</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div className="p-3 rounded-2xl bg-apple-canvas border border-apple-border/60">
            <span className="text-apple-text-muted block">Preferred Language</span>
            <span className="font-bold text-apple-text-primary text-sm mt-0.5 block">Hindi / English</span>
          </div>
          <div className="p-3 rounded-2xl bg-apple-canvas border border-apple-border/60">
            <span className="text-apple-text-muted block">Living Situation</span>
            <span className="font-bold text-apple-text-primary text-sm mt-0.5 block">Independent (Mumbai)</span>
          </div>
          <div className="p-3 rounded-2xl bg-apple-canvas border border-apple-border/60">
            <span className="text-apple-text-muted block">Emergency Contact</span>
            <span className="font-bold text-apple-text-primary text-sm mt-0.5 block">Rahul Sharma (Son)</span>
          </div>
          <div className="p-3 rounded-2xl bg-apple-canvas border border-apple-border/60">
            <span className="text-apple-text-muted block">Society Assistance</span>
            <span className="font-bold text-emerald-700 text-sm mt-0.5 block">RWA Guard & Care Desk</span>
          </div>
        </div>
      </section>

      {/* 3. Family Members Circle Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {familyMembersList.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-6 border border-apple-border shadow-apple-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${member.avatarBg}`}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-apple-text-primary leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-apple-blue mt-0.5">{member.relation}</p>
                    <p className="text-xs text-apple-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{member.city}</span>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  {member.status}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-apple-canvas border border-apple-border text-xs mb-4">
                <span className="text-apple-text-muted block font-medium">Caregiving Responsibility</span>
                <span className="font-bold text-apple-text-primary mt-1 block">{member.role}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-apple-border flex items-center justify-between text-xs">
              <span className="font-semibold text-apple-text-muted">{member.phone}</span>
              <button
                onClick={() => {
                  setModalMode('message');
                  setIsMessageModalOpen(true);
                }}
                className="font-bold text-apple-blue hover:underline cursor-pointer flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Sibling</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Family Task Matrix */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-apple-border shadow-apple-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-apple-text-primary">Shared Family Task Board</h3>
            <p className="text-xs text-apple-text-muted mt-0.5">
              Click checkbox to toggle status or click assignee tag to swap between Rahul and Priya.
            </p>
          </div>
          <span className="text-xs font-bold text-apple-text-muted">
            {familyTasks.filter(t => t.status === 'Completed').length} / {familyTasks.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {familyTasks.map((task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200/80 opacity-80'
                    : 'bg-apple-canvas border-apple-border hover:border-apple-blue'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isCompleted ? 'bg-emerald-600 text-white' : 'border-2 border-gray-400 hover:border-apple-blue'
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isCompleted ? 'line-through text-apple-text-muted' : 'text-apple-text-primary'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-apple-text-muted">Due: {task.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => reassignTask(task.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 rounded-xl text-xs font-bold text-apple-text-secondary border border-apple-border transition-colors cursor-pointer"
                    title="Click to reassign between Rahul and Priya"
                  >
                    <User className="w-3.5 h-3.5 text-apple-blue" />
                    <span>Assigned: <strong className="text-apple-blue">{task.assignee}</strong></span>
                  </button>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : task.status === 'In Progress'
                        ? 'bg-blue-50 text-apple-blue border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-apple-lg border border-apple-border">
            <h3 className="text-lg font-extrabold text-apple-text-primary mb-1">Assign New Family Task</h3>
            <p className="text-xs text-apple-text-muted mb-4">Add a shared reminder for Rahul or Priya.</p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-apple-text-primary block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Order Diwali gift box, check AC service"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-apple-border text-sm outline-none focus:ring-2 focus:ring-apple-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-apple-text-primary block mb-1">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value as 'Rahul' | 'Priya')}
                    className="w-full px-3 py-2 rounded-xl border border-apple-border text-sm outline-none bg-apple-canvas"
                  >
                    <option value="Rahul">Rahul (Son)</option>
                    <option value="Priya">Priya (Daughter)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-apple-text-primary block mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-apple-border text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-apple-border">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-apple-text-muted hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-apple-blue hover:bg-apple-blue-dark text-white shadow-sm"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      <FamilyMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        initialMode={modalMode}
      />
    </div>
  );
};
