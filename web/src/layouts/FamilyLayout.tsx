import React from 'react';
import { Outlet } from 'react-router-dom';
import { FamilyProvider } from '../context/FamilyContext';
import { FamilyNavbar } from '../components/FamilyNavbar';

export const FamilyLayout: React.FC = () => {
  return (
    <FamilyProvider>
      <div className="min-h-screen bg-apple-canvas text-apple-text-primary flex flex-col font-sans selection:bg-blue-100 selection:text-apple-blue">
        {/* Persistent Family Header */}
        <FamilyNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7" role="main">
          <Outlet />
        </main>
      </div>
    </FamilyProvider>
  );
};
