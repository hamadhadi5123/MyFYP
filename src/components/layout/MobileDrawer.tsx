import React from 'react';
import { 
  X, 
  LayoutDashboard, 
  Database, 
  Bot, 
  GraduationCap, 
  Sparkles, 
  Network, 
  LineChart, 
  CheckSquare, 
  Settings, 
  Shield,
  UserCircle,
  LogIn
} from 'lucide-react';
import { useDataMind } from '../../context/DataMindContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate
}) => {
  const { autonomyLevel, currentUser, isAuthenticated, openAuthModal } = useDataMind();

  if (!isOpen) return null;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'workspace', label: 'Dataset Workspace', icon: Database },
    { id: 'tutor', label: 'AI Data Tutor', icon: Bot },
    { id: 'studio', label: 'Learning Studio', icon: GraduationCap },
    { id: 'explanation', label: 'Explanation Lab', icon: Sparkles },
    { id: 'causal', label: 'Causal Mentor', icon: Network },
    { id: 'progress', label: 'My Progress', icon: LineChart },
    { id: 'evaluation', label: 'Evaluation & Tests', icon: CheckSquare },
    { id: 'auth', label: 'Login & Accounts', icon: UserCircle },
    { id: 'settings', label: 'Settings & Help', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-72 bg-[#070B14] text-slate-300 flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-base">DataMind</span>
              <span className="text-[10px] ml-1.5 font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">FYP</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card or Login Prompt */}
        <div className="p-3 border-b border-slate-800/80">
          {isAuthenticated && currentUser ? (
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor || 'from-emerald-500 to-teal-700'} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                {currentUser.avatarInitials}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">
                  {currentUser.role}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal('signin');
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
