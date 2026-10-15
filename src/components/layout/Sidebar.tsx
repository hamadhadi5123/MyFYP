import React from 'react';
import { 
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
  Gauge, 
  UserCircle, 
  LogIn, 
  LogOut 
} from 'lucide-react';
import { useDataMind } from '../../context/DataMindContext';
import { AUTONOMY_LEVELS } from '../../data/autonomyTasks';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { 
    autonomyLevel, 
    currentUser, 
    isAuthenticated, 
    openAuthModal, 
    logout 
  } = useDataMind();

  const currentLevelInfo = AUTONOMY_LEVELS[autonomyLevel];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'workspace', label: 'Dataset Workspace', icon: Database, badge: 'Live CSV' },
    { id: 'tutor', label: 'AI Data Tutor', icon: Bot, badge: 'Demo' },
    { id: 'studio', label: 'Learning Studio', icon: GraduationCap, badge: 'Core' },
    { id: 'explanation', label: 'Explanation Lab', icon: Sparkles, badge: '5 Styles' },
    { id: 'causal', label: 'Causal Mentor', icon: Network, badge: 'DAG' },
    { id: 'progress', label: 'My Progress', icon: LineChart, badge: null },
    { id: 'evaluation', label: 'Evaluation & Tests', icon: CheckSquare, badge: 'FYP' },
    { id: 'auth', label: 'Login & Accounts', icon: UserCircle, badge: 'Auth' },
    { id: 'settings', label: 'Settings & Help', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#070B14] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-[#080E1C]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 text-white font-bold text-lg ring-1 ring-emerald-500/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">DataMind</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                FYP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Capability-Preserving Co-Pilot
            </p>
          </div>
        </div>
      </div>

      {/* Autonomy Dial Mini Status Card */}
      <div className="px-3 pt-3 pb-1">
        <div 
          onClick={() => onNavigate('studio')}
          className="cursor-pointer group p-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/90 hover:border-emerald-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              Autonomy Level
            </span>
            <span className="text-emerald-400 font-bold group-hover:underline">
              L{autonomyLevel} / 4
            </span>
          </div>
          <div className="text-xs font-semibold text-white truncate">
            {currentLevelInfo.name}
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${(autonomyLevel / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
            <span>AI: {currentLevelInfo.assistanceRatio}%</span>
            <span className="text-emerald-400 font-medium">Learner: {100 - currentLevelInfo.assistanceRatio}%</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1 mt-2">
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-slate-800/80 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Status / Auth Card in Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080E1C]/60">
        {isAuthenticated && currentUser ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div 
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2 cursor-pointer overflow-hidden group"
              title="Click to view profile & settings"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor || 'from-emerald-500 to-teal-700'} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                {currentUser.avatarInitials}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize truncate">
                  {currentUser.role}
                </div>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('signin')}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Switch user account"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Demo Login</span>
          </button>
        )}

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Riphah CS FYP</span>
          <span className="text-emerald-400 font-mono">2023–2027</span>
        </div>
      </div>
    </aside>
  );
};
