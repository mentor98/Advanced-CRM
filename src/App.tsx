import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { QuickCreateModal } from './components/common/QuickCreateModal';
import { AICopilotDrawer } from './components/common/AICopilotDrawer';
import { TestRunnerModal } from './components/common/TestRunnerModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { DealsKanbanView } from './components/deals/DealsKanbanView';
import { DealDetailModal } from './components/deals/DealDetailModal';
import { LeadsView } from './components/leads/LeadsView';
import { LeadDetailModal } from './components/leads/LeadDetailModal';
import { ContactsView } from './components/contacts/ContactsView';
import { ContactDetailModal } from './components/contacts/ContactDetailModal';
import { CompaniesView } from './components/companies/CompaniesView';
import { CompanyDetailModal } from './components/companies/CompanyDetailModal';
import { TasksView } from './components/tasks/TasksView';
import { EmailHubView } from './components/emails/EmailHubView';
import { ForecastView } from './components/forecast/ForecastView';
import { TeamView } from './components/team/TeamView';
import { AuditLogsView } from './components/audit/AuditLogsView';

const MainLayout: React.FC = () => {
  const { activeView } = useCRM();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'deals':
        return <DealsKanbanView />;
      case 'leads':
        return <LeadsView />;
      case 'contacts':
        return <ContactsView />;
      case 'companies':
        return <CompaniesView />;
      case 'tasks':
        return <TasksView />;
      case 'emails':
        return <EmailHubView />;
      case 'forecast':
        return <ForecastView />;
      case 'team':
        return <TeamView />;
      case 'audit':
        return <AuditLogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/60 dark:bg-slate-950/60">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <QuickCreateModal />
      <AICopilotDrawer />
      <TestRunnerModal />
      <DealDetailModal />
      <LeadDetailModal />
      <ContactDetailModal />
      <CompanyDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CRMProvider>
          <MainLayout />
        </CRMProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
