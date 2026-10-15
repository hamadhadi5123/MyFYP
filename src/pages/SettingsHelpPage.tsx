import React, { useState } from 'react';
import { useDataMind } from '../context/DataMindContext';
import { AUTONOMY_LEVELS } from '../data/autonomyTasks';
import { EXPLANATION_STYLES } from '../data/explanationData';
import { 
  Settings, 
  Sun, 
  Moon, 
  RotateCcw, 
  AlertTriangle, 
  HelpCircle, 
  Info, 
  ShieldCheck, 
  User, 
  Check, 
  Sparkles, 
  BookOpen,
  Edit3,
  Save,
  LogIn,
  LogOut,
  Building2,
  Mail,
  GraduationCap
} from 'lucide-react';
import { UserRole } from '../types';

export const SettingsHelpPage: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    autonomyLevel, 
    setAutonomyLevel, 
    preferredStyle, 
    setPreferredStyle, 
    resetAllDemoState, 
    currentUser,
    updateProfile,
    openAuthModal,
    logout,
    addToast 
  } = useDataMind();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || 'Muhammad Aftab Asghar');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'aftab.asghar@students.riphah.edu.pk');
  const [editRole, setEditRole] = useState<UserRole>(currentUser?.role || 'student');
  const [editInstitution, setEditInstitution] = useState(currentUser?.institution || 'Riphah International University');
  const [editGoal, setEditGoal] = useState(currentUser?.targetLearningGoal || 'Master Causal Inference & Exploratory Data Analysis with fading AI support');

  // Sync edit form if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditEmail(currentUser.email);
      setEditRole(currentUser.role);
      setEditInstitution(currentUser.institution || 'Riphah International University');
      setEditGoal(currentUser.targetLearningGoal || '');
    }
  }, [currentUser]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      addToast('Name and email cannot be empty', 'warning');
      return;
    }
    const initials = editName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'DM';
    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      role: editRole,
      institution: editInstitution.trim(),
      targetLearningGoal: editGoal.trim(),
      avatarInitials: initials,
    });
    setIsEditingProfile(false);
  };

  const faqs = [
    {
      q: 'What is the core problem DataMind solves?',
      a: 'Current AI tools optimize purely for task completion: the human asks, the AI answers, and the human becomes progressively deskilled and dependent. DataMind treats human skill growth as a first-class objective with a measurable metric—so the human ends needing the AI less, not more.'
    },
    {
      q: 'How does the Autonomy Dial work?',
      a: 'The Autonomy Dial modulates assistance across 5 levels (Level 0: Do it for me, Level 1: Do it and explain, Level 2: Give me hints, Level 3: Check my work, Level 4: Independent work). As user competence improves, scaffolding structurally fades.'
    },
    {
      q: 'What is the Explanation Variety Engine?',
      a: 'Instead of providing one generic wall of text, DataMind offers 5 distinct cognitive models: Procedural, Formula-based, Analogical, Visual, and Causal. It tracks which mental model helps you understand faster.'
    },
    {
      q: 'Why does the Causal Mentor emphasize "Correlation != Causation"?',
      a: 'Observational data often exhibits high statistical correlations caused by unobserved confounders or selection bias. The Causal Mentor uses Directed Acyclic Graphs (DAGs) to teach students how to identify backdoor paths and articulate assumptions.'
    },
    {
      q: 'Is a live LLM or GPU backend required for this frontend demonstration?',
      a: 'No. This frontend is an autonomous, self-contained educational demonstration designed for FYP presentations. It uses in-memory datasets and educational knowledge rules to ensure zero external API dependencies or latency during defense.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#070B14] via-[#0F1B33] to-[#0A1325] text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              System Preferences & Thesis Guide
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Settings, Profile & Pedagogical Guide
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Configure appearance, update your learning profile, manage session state, and explore the cognitive thesis behind DataMind.
          </p>
        </div>
      </div>

      {/* Profile & Appearance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic User Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>Learner Profile</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {currentUser?.role || 'Student'}
              </span>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isEditingProfile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pt-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${currentUser?.avatarColor || 'from-emerald-500 to-teal-700'} text-white font-extrabold text-xl flex items-center justify-center shadow-md ring-2 ring-emerald-500/20`}>
                  {currentUser?.avatarInitials || 'MA'}
                </div>
                <div>
                  <div className="font-bold text-base text-slate-900 dark:text-white">
                    {currentUser?.name || 'Muhammad Aftab Asghar'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{currentUser?.email || 'aftab.asghar@students.riphah.edu.pk'}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{currentUser?.institution || 'Riphah International University'}</span>
                  </div>
                </div>
              </div>

              {currentUser?.targetLearningGoal && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Learning Goal:</span>
                  <span className="text-slate-500 dark:text-slate-400">{currentUser.targetLearningGoal}</span>
                </div>
              )}

              {/* Account Actions */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Switch Account / Preset</span>
                </button>

                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="researcher">Researcher</option>
                    <option value="analyst">Analyst</option>
                    <option value="educator">Educator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Learning Goal
                </label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <strong>Project Co-Authors:</strong> Muhammad Aftab Asghar · Muhammad Hamad Asghar
          </div>
        </div>

        {/* Interface Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-500" />
            <span>Interface Preferences</span>
          </h3>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-4 h-4 text-sky-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Preferred Style Selector */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Default Cognitive Explanation Style
            </label>
            <select
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value as any)}
              className="w-full p-2.5 rounded-2xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {EXPLANATION_STYLES.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.shortDescription})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Session State Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Reset Demonstration Session</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Restores baseline sample datasets, initial autonomy level, chat history, and test logs.
            </p>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60 border border-rose-300 dark:border-rose-800 transition-colors self-start sm:self-auto"
          >
            Reset All Session Data
          </button>
        </div>
      </div>

      {/* FAQ & Pedagogical Thesis Guide */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>Frequently Asked Questions & FYP Thesis Rationale</span>
        </h3>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs space-y-1 hover:border-emerald-500/30 transition-colors">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-emerald-500">Q:</span>
                <span>{faq.q}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 pl-4 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Demo Session?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                This will reset all current session modifications: uploaded datasets will be restored to the Student Performance benchmark, the Autonomy Dial will return to Level 1, and chat will be cleared.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllDemoState();
                  setShowResetModal(false);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
