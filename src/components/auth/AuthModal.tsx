import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  BookOpen, 
  Compass, 
  Cpu, 
  Fingerprint,
  Layers,
  Network,
  Gauge
} from 'lucide-react';
import { useDataMind, DEMO_USERS } from '../../context/DataMindContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    login, 
    signup, 
    addToast 
  } = useDataMind();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode || 'signin');
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

  // Sync mode with parent if prop changed
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      addToast('Please enter your email address', 'warning');
      return;
    }
    login({
      email: signInEmail,
      password: signInPassword
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim()) {
      addToast('Please provide your name and email', 'warning');
      return;
    }
    signup({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
      role: signUpRole,
      institution: signUpInstitution,
      goal: signUpGoal
    });
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
    }
  };

  const handleForgotPassword = () => {
    if (signInEmail) {
      addToast(`Password recovery link simulated to ${signInEmail}`, 'info');
    } else {
      addToast('Enter your email to receive a password reset link', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#0D1527] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Close or explore as guest"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Brand & Theoretical Foundation Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#080E1C] via-[#0F1B35] to-[#0A1329] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Ambient glowing radial lights */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Logo & Project Tag */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl tracking-tight text-white">DataMind</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    FYP Core
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Capability-Preserving Co-Pilot
                </p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug mb-3">
              Don't get deskilled.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Learn as you analyze.
              </span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              Most AI tools solve tasks for you and create passive dependence. DataMind systematically fades its assistance as your competence grows.
            </p>

            {/* Feature Pills */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Autonomy Dial (L0–L4)</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Dynamic scaffolding shifting control from AI to learner</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">5 Cognitive Explanations</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Procedural, Formula, Analogical, Visual & Causal mental models</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Causal DAG Reasoning</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Discover why correlation does not imply causation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Research & University Citation */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
              <span>Riphah International University</span>
              <span className="text-emerald-400">2023–2027</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Lead: Muhammad Aftab Asghar · Muhammad Hamad Asghar
            </p>
          </div>
        </div>

        {/* Right Side: Authentication Tabs & Forms */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-white dark:bg-[#0D1527] flex flex-col justify-between">
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
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
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Guest Explore Pill */}
              <button
                type="button"
                onClick={() => handleQuickDemoSelect('guest')}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 font-medium transition-colors"
              >
                <span>Guest Preview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Demo Selector Carousel / Badges */}
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span>Instant 1-Click Access (Viva / Demo)</span>
                <span className="text-[10px] text-emerald-500 font-mono">No Password Needed</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('aftab')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Aftab (Lead)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">FYP Student</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('hamad')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Hamad</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Data Science</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('evaluator')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:border-purple-500 dark:hover:border-purple-500 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Dr. Evaluator</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Faculty / Jury</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('guest')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Guest User</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Quick Preview</div>
                </button>
              </div>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[11px] font-medium text-slate-400">or sign in with credentials</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* SIGN IN FORM */}
            {mode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address or Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="aftab.asghar@students.riphah.edu.pk"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
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
                      onClick={handleForgotPassword}
                      className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
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

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">
                      Remember this workstation
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-4"
                >
                  <span>Sign In to DataMind</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Muhammad Aftab Asghar"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Academic / Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="user@university.edu"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Your Role
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
                          className={`flex items-center gap-1.5 p-2 rounded-lg text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    University / Institution
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={signUpInstitution}
                      onChange={(e) => setSignUpInstitution(e.target.value)}
                      placeholder="e.g. Riphah International University"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-3"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Start Learning</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Data stored locally in your browser</span>
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Skip to Demo →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
