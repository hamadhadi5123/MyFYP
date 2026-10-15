import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  BookOpen, 
  Compass, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  Network, 
  Gauge, 
  Zap, 
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { useDataMind, DEMO_USERS } from '../context/DataMindContext';
import { UserRole } from '../types';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    login, 
    signup, 
    logout, 
    addToast 
  } = useDataMind();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('student');
  const [signUpInstitution, setSignUpInstitution] = useState('Riphah International University');
  const [signUpGoal, setSignUpGoal] = useState('Master Exploratory Data Analysis & Causal Reasoning');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      addToast('Please enter your email address', 'warning');
      return;
    }
    const success = login({
      email: signInEmail,
      password: signInPassword
    });
    if (success) {
      onNavigate('overview');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) {
      addToast('Please provide your name and email', 'warning');
      return;
    }
    const success = signup({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
      role: signUpRole,
      institution: signUpInstitution,
      goal: signUpGoal
    });
    if (success) {
      onNavigate('overview');
    }
  };

  const handleQuickDemoSelect = (key: keyof typeof DEMO_USERS) => {
    const demo = DEMO_USERS[key];
    if (demo) {
      login({
        email: demo.email,
        name: demo.name,
        role: demo.role,
        isGuest: demo.isGuest
      });
      onNavigate('overview');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-5xl bg-white dark:bg-[#0D1527] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero & Visual Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#070B14] via-[#0F1B33] to-[#0A1224] p-8 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white font-bold text-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl tracking-tight text-white">DataMind</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    FYP 2026
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Capability-Preserving Co-Pilot
                </p>
              </div>
            </div>

            {/* Current user badge if already logged in */}
            {currentUser && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  Active Session
                </div>
                <div className="font-bold text-white text-sm">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-300">
                  {currentUser.email} · <span className="capitalize text-emerald-400">{currentUser.role}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('overview')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight mb-3">
              Transform from an AI Consumer into an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Independent Analyst.
              </span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              DataMind is engineered specifically to prevent the deskilling trap of generative AI. By structuring assistance across calibrated autonomy tiers, you retain mastery over your analysis decisions.
            </p>

            {/* Cognitive Architecture Highlights */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">5 Autonomy Levels</div>
                  <div className="text-[11px] text-slate-400">Fades assistance from 100% to 0%</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">5 Cognitive Models</div>
                  <div className="text-[11px] text-slate-400">Tailors explanations to your mental model</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Interactive Causal DAGs</div>
                  <div className="text-[11px] text-slate-400">Unmask confounding & selection bias</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>BS Computer Science FYP</span>
              <span className="text-emerald-400 font-mono">2023–2027</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Riphah International University · Aftab & Hamad
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Mode Switch Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 font-medium transition-colors"
              >
                Skip to Dashboard →
              </button>
            </div>

            {/* Quick Demo Accounts */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Quick Preset Access (Viva & Evaluation)
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">1-Click</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('aftab')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-emerald-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    Aftab (Lead)
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    FYP Student
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('hamad')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-blue-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    Hamad
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Data Science
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('evaluator')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-purple-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    Dr. Evaluator
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Faculty / Jury
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('guest')}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-cyan-500 hover:shadow-md transition-all text-left"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    Guest Learner
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Quick Preview
                  </div>
                </button>
              </div>
            </div>

            {/* Sign In Form */}
            {mode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="aftab.asghar@students.riphah.edu.pk"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => addToast('Reset link sent to demo inbox', 'info')}
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Remember login session
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-4"
                >
                  <span>Sign In & Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Muhammad Aftab Asghar"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="aftab@riphah.edu.pk"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Primary Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { role: 'student' as UserRole, label: 'Student', icon: GraduationCap },
                      { role: 'researcher' as UserRole, label: 'Researcher', icon: Cpu },
                      { role: 'analyst' as UserRole, label: 'Analyst', icon: Compass },
                      { role: 'educator' as UserRole, label: 'Educator', icon: BookOpen },
                    ].map(r => {
                      const Icon = r.icon;
                      const isSelected = signUpRole === r.role;
                      return (
                        <button
                          key={r.role}
                          type="button"
                          onClick={() => setSignUpRole(r.role)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Institution / Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={signUpInstitution}
                        onChange={(e) => setSignUpInstitution(e.target.value)}
                        placeholder="Riphah International University"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-4"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Register Account & Enter Workspace</span>
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            Capability-Preserving Co-Pilot · Designed for Genuine Learning
          </div>
        </div>
      </div>
    </div>
  );
};
