import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { FloatingAssistantOverlay } from '../components/FloatingAssistantOverlay';
import { EmergencySosModal } from '../components/EmergencySosModal';
import { ProfileModal } from '../components/ProfileModal';

export const ParentLayout: React.FC = () => {
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-apple-canvas text-apple-text-primary flex flex-col font-sans selection:bg-blue-100 selection:text-apple-blue pb-16 md:pb-6">
      {/* Desktop & Tablet Top Navbar */}
      <Navbar
        onOpenSos={() => setIsSosOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Page Area where active child route renders */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" role="main">
        <Outlet />
      </main>

      {/* Floating In-Page Accessibility Assistant */}
      <FloatingAssistantOverlay onOpenSos={() => setIsSosOpen(true)} />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals accessible from any parent screen */}
      <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default ParentLayout;
