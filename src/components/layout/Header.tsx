import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Database, 
  Sparkles, 
  Bell,
  User,
  LogOut,
  Settings,
  LineChart,
  ChevronDown,
  Gauge,
  Shield,
  LogIn
} from 'lucide-react';
import { useDataMind } from '../../context/DataMindContext';
import { AutonomyLevel } from '../../types';

interface HeaderProps {
  currentPage: string;
  onOpenMobileMenu: () => void;
  onNavigate: (page: string) => void;
}

const PAGE_METADATA: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: 'Overview Dashboard',
    subtitle: 'Capability-preserving co-pilot for exploratory data analysis',
  },
  workspace: {
    title: 'Dataset Workspace',
    subtitle: 'In-browser CSV parsing, schema inference, data cleaning & dynamic charts',
  },
  tutor: {
    title: 'AI Data Tutor',
    subtitle: 'Context-grounded pedagogical conversational assistant',
  },
  studio: {
    title: 'Learning Studio & Autonomy Dial',
    subtitle: 'Fading scaffolding: transfer responsibility from AI to learner',
  },
  explanation: {
    title: 'Explanation Lab',
    subtitle: 'Parallel cognitive mental models & learner style scoreboard',
  },
  causal: {
    title: 'Causal Mentor Engine',
    subtitle: 'Directed Acyclic Graphs, confounders, and progressive why-reasoning',
  },
  progress: {
    title: 'My Learning Progress',
    subtitle: 'Session metrics, independence trend, and cognitive mastery',
  },
  evaluation: {
    title: 'Evaluation & Benchmarks',
    subtitle: 'Live frontend test runner & formal FYP research evaluation protocol',
  },
  settings: {
    title: 'Settings & Documentation',
    subtitle: 'System preferences, pedagogical thesis guide, and prototype limits',
  },
  auth: {
    title: 'Authentication & Access',
    subtitle: 'Sign in to access your research profile or test as evaluator',
  },
};

const LEVEL_COLORS: Record<AutonomyLevel, { badge: string; text: string }> = {
  0: { badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700', text: 'text-slate-500' },
  1: { badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/30', text: 'text-emerald-500' },
  2: { badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-500/30', text: 'text-sky-500' },
  3: { badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/30', text: 'text-amber-500' },
  4: { badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-500/30', text: 'text-purple-500' },
};

export const Header: React.FC<HeaderProps> = ({ currentPage, onOpenMobileMenu, onNavigate }) => {
  const { 
    currentDataset, 
    theme, 
    toggleTheme, 
    autonomyLevel, 
    setAutonomyLevel,
    activityLogs,
    currentUser,
    isAuthenticated,
    logout,
    openAuthModal
  } = useDataMind();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const meta = PAGE_METADATA[currentPage] || { title: 'DataMind', subtitle: '' };
  const levelStyle = LEVEL_COLORS[autonomyLevel] || LEVEL_COLORS[1];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#070B14]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile trigger & Page Info */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                {meta.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                FYP Prototype
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 font-normal">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Active Dataset, Dial Indicator, Theme Toggle, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Dataset Pill */}
          {currentDataset && (
            <button
              onClick={() => onNavigate('workspace')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
              title="Click to inspect dataset in workspace"
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold truncate max-w-[120px]">{currentDataset.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">({currentDataset.rowCount} rows)</span>
            </button>
          )}

          {/* Autonomy Dial Pill */}
          <button
            onClick={() => onNavigate('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 ${levelStyle.badge}`}
            title="Autonomy Dial: modulates assistance vs student control"
          >
            <Gauge className={`w-3.5 h-3.5 ${levelStyle.text}`} />
            <span>Level {autonomyLevel}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Notification / Activity bell */}
          <button
            onClick={() => onNavigate('progress')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Recent session activities & timeline"
          >
            <Bell className="w-4 h-4" />
            {activityLogs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated && currentUser ? (
            <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all text-left group"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${currentUser.avatarColor || 'from-emerald-500 to-teal-700'} text-white text-xs font-extrabold flex items-center justify-center shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/30`}>
                  {currentUser.avatarInitials}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-emerald-500 transition-colors">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-fade-in">
                  {/* User summary */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${currentUser.avatarColor || 'from-emerald-500 to-teal-700'} text-white text-sm font-extrabold flex items-center justify-center shadow-md`}>
                      {currentUser.avatarInitials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {currentUser.email}
                      </div>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Autonomy Level Quick Switch */}
                  <div className="py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                      <span>Autonomy Level</span>
                      <span className="font-bold text-emerald-500">L{autonomyLevel}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {([0, 1, 2, 3, 4] as AutonomyLevel[]).map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => {
                            setAutonomyLevel(lvl);
                            setIsProfileOpen(false);
                          }}
                          className={`py-1 rounded-lg text-xs font-bold transition-all ${
                            autonomyLevel === lvl
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          L{lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Edit Profile & Preferences</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('progress');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <LineChart className="w-4 h-4 text-slate-400" />
                      <span>My Learning Mastery</span>
                    </button>

                    <button
                      onClick={() => {
                        openAuthModal('signin');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span>Switch Account / Preset</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
