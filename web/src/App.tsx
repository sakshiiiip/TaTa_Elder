import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SahaayProvider } from './context/SahaayContext';
import { FamilyLoginScreen } from './pages/FamilyLoginScreen';
import { FamilyLayout } from './layouts/FamilyLayout';
import { ParentLayout } from './layouts/ParentLayout';

// 9 Separate Parent Pages
import { ParentHome } from './pages/parent/ParentHome';
import { SahaayAssistant } from './pages/parent/SahaayAssistant';
import { ParentHealth as SeniorHealth } from './pages/parent/ParentHealth';
import { DailyLife as SeniorDailyLife } from './pages/parent/DailyLife';
import { ParentPayments } from './pages/parent/ParentPayments';
import { ParentFamily } from './pages/parent/ParentFamily';
import { ParentNotifications } from './pages/parent/ParentNotifications';
import { ParentSettings } from './pages/parent/ParentSettings';
import { EmergencyCenter as SeniorEmergencyCenter } from './pages/parent/EmergencyCenter';

// 12 Separate Family Pages
import { FamilyOverview } from './pages/family/FamilyOverview';
import { ParentHealth as FamilyParentHealth } from './pages/family/ParentHealth';
import { DailyLife as FamilyDailyLife } from './pages/family/DailyLife';
import { AppointmentsTransport } from './pages/family/AppointmentsTransport';
import { HomeMaintenance } from './pages/family/HomeMaintenance';
import { WeeklyParentSummary } from './pages/family/WeeklyParentSummary';
import { Payments as FamilyPayments } from './pages/family/Payments';
import { FamilyMembers } from './pages/family/FamilyMembers';
import { Messages } from './pages/family/Messages';
import { Notifications as FamilyNotifications } from './pages/family/Notifications';
import { Settings as FamilySettings } from './pages/family/Settings';
import { EmergencyCenter as FamilyEmergencyCenter } from './pages/family/EmergencyCenter';

export const App: React.FC = () => {
  return (
    <SahaayProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Route redirects to Family Overview */}
          <Route path="/" element={<Navigate to="/family/overview" replace />} />

          {/* Family Login Screen */}
          <Route path="/login" element={<FamilyLoginScreen />} />

          {/* Parent Application Routes with Shared ParentLayout */}
          <Route path="/parent" element={<ParentLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<ParentHome />} />
            <Route path="sahaay" element={<SahaayAssistant />} />
            <Route path="health" element={<SeniorHealth />} />
            <Route path="daily-life" element={<SeniorDailyLife />} />
            <Route path="payments" element={<ParentPayments />} />
            <Route path="family" element={<ParentFamily />} />
            <Route path="notifications" element={<ParentNotifications />} />
            <Route path="settings" element={<ParentSettings />} />
            <Route path="emergency" element={<SeniorEmergencyCenter />} />
          </Route>

          {/* Family Dashboard Routes with Shared FamilyLayout */}
          <Route path="/family" element={<FamilyLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<FamilyOverview />} />
            <Route path="health" element={<FamilyParentHealth />} />
            <Route path="daily-life" element={<FamilyDailyLife />} />
            <Route path="appointments" element={<AppointmentsTransport />} />
            <Route path="home-maintenance" element={<HomeMaintenance />} />
            <Route path="weekly-summary" element={<WeeklyParentSummary />} />
            <Route path="payments" element={<FamilyPayments />} />
            <Route path="family" element={<FamilyMembers />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<FamilyNotifications />} />
            <Route path="settings" element={<FamilySettings />} />
            <Route path="emergency" element={<FamilyEmergencyCenter />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/family/overview" replace />} />
        </Routes>
      </BrowserRouter>
    </SahaayProvider>
  );
};

export default App;
