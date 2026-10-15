import React, { useState } from 'react';
import { DataMindProvider, useDataMind } from './context/DataMindContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { DatasetWorkspacePage } from './pages/DatasetWorkspacePage';
import { AiTutorPage } from './pages/AiTutorPage';
import { LearningStudioPage } from './pages/LearningStudioPage';
import { ExplanationLabPage } from './pages/ExplanationLabPage';
import { CausalMentorPage } from './pages/CausalMentorPage';
import { ProgressPage } from './pages/ProgressPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { SettingsHelpPage } from './pages/SettingsHelpPage';
import { AuthPage } from './pages/AuthPage';

const MainApplication: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const renderActivePage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage onNavigate={setCurrentPage} />;
      case 'workspace':
        return <DatasetWorkspacePage />;
      case 'tutor':
        return <AiTutorPage onNavigate={setCurrentPage} />;
      case 'studio':
        return <LearningStudioPage onNavigate={setCurrentPage} />;
      case 'explanation':
        return <ExplanationLabPage />;
      case 'causal':
        return <CausalMentorPage />;
      case 'progress':
        return <ProgressPage onNavigate={setCurrentPage} />;
      case 'evaluation':
        return <EvaluationPage />;
      case 'auth':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsHelpPage />;
      default:
        return <OverviewPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#070B14] bg-mesh-light dark:bg-mesh-dark text-slate-900 dark:text-slate-100 transition-colors">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigate={setCurrentPage}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Authentication Modal Dialog */}
      <AuthModal />

      {/* Action Notification Toasts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <DataMindProvider>
      <MainApplication />
    </DataMindProvider>
  );
}

export default App;
