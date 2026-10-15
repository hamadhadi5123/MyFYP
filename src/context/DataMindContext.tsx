import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Dataset, 
  AutonomyLevel, 
  ExplanationStyle, 
  ActivityLog, 
  ChatMessage,
  UserProfile,
  UserRole
} from '../types';
import { getSampleDatasets } from '../data/sampleDatasets';
import { generateTutorResponse } from '../data/tutorKnowledge';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface DataMindContextType {
  // Datasets
  currentDataset: Dataset | null;
  activeDatasetKey: string;
  loadSampleDataset: (key: 'student' | 'sales' | 'weather') => void;
  loadCustomDataset: (dataset: Dataset) => void;
  applyDataCleaning: (options: {
    column?: string;
    missingStrategy?: 'mean' | 'median' | 'drop';
    removeDuplicates?: boolean;
  }) => { affectedRows: number; description: string };
  resetCurrentDataset: () => void;
  
  // Autonomy Dial
  autonomyLevel: AutonomyLevel;
  setAutonomyLevel: (level: AutonomyLevel) => void;
  
  // Chat Tutor
  chatMessages: ChatMessage[];
  isTutorTyping: boolean;
  sendChatMessage: (content: string) => void;
  clearChat: () => void;
  resetChat: () => void;
  
  // Explanation Variety
  preferredStyle: ExplanationStyle;
  setPreferredStyle: (style: ExplanationStyle) => void;
  styleScoreboard: Record<ExplanationStyle, { helped: number; neededAlternative: number }>;
  recordStyleFeedback: (style: ExplanationStyle, helped: boolean) => void;
  
  // Activities & Progress
  activityLogs: ActivityLog[];
  completedTaskIds: string[];
  markTaskCompleted: (taskId: string, title: string) => void;
  logActivity: (type: ActivityLog['type'], title: string, detail: string) => void;
  
  // Theme & Settings
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Toast notifications
  toasts: ToastNotification[];
  addToast: (message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  
  // Auth & Profile
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password?: string; name?: string; role?: UserRole; isGuest?: boolean }) => boolean;
  signup: (data: { name: string; email: string; password?: string; role: UserRole; institution?: string; goal?: string }) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;

  // Session reset
  resetAllDemoState: () => void;
}

export const DEMO_USERS: Record<string, UserProfile> = {
  aftab: {
    id: 'user-aftab',
    name: 'Muhammad Aftab Asghar',
    email: 'aftab.asghar@students.riphah.edu.pk',
    role: 'student',
    avatarInitials: 'MA',
    avatarColor: 'from-emerald-500 to-teal-700',
    institution: 'Riphah International University',
    joinedDate: 'October 2026',
    targetLearningGoal: 'Master Causal Inference & Exploratory Data Analysis with fading AI support',
    isGuest: false,
  },
  hamad: {
    id: 'user-hamad',
    name: 'Muhammad Hamad Asghar',
    email: 'hamad.asghar@students.riphah.edu.pk',
    role: 'student',
    avatarInitials: 'MH',
    avatarColor: 'from-blue-500 to-indigo-700',
    institution: 'Riphah International University',
    joinedDate: 'October 2026',
    targetLearningGoal: 'Statistical Modeling & Directed Acyclic Graphs',
    isGuest: false,
  },
  evaluator: {
    id: 'user-evaluator',
    name: 'Dr. Faculty Evaluator',
    email: 'faculty.evaluator@riphah.edu.pk',
    role: 'educator',
    avatarInitials: 'FE',
    avatarColor: 'from-purple-500 to-pink-700',
    institution: 'Faculty of Computing & Applied Sciences',
    joinedDate: 'October 2026',
    targetLearningGoal: 'Evaluate pedagogical efficacy & independence progression metrics',
    isGuest: false,
  },
  guest: {
    id: 'user-guest',
    name: 'Guest Learner',
    email: 'guest.explorer@datamind.ai',
    role: 'analyst',
    avatarInitials: 'GL',
    avatarColor: 'from-cyan-500 to-sky-700',
    institution: 'Independent Explorer',
    joinedDate: 'Today',
    targetLearningGoal: 'Test capability-preserving co-pilot features',
    isGuest: true,
  }
};

const DataMindContext = createContext<DataMindContextType | undefined>(undefined);

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  timestamp: 'Just now',
  content: `👋 **Welcome to DataMind!** I'm your capability-preserving data analysis co-pilot. 

My objective is **not** to simply do the analysis for you—it is to help you understand the decisions, assumptions, and mechanisms so you become more independent over time.

I have loaded the **Student Performance Benchmark** dataset for our session. How can I guide your exploration today?`,
  suggestedFollowUps: [
    'Explain my dataset.',
    'How should I handle missing values?',
    'Which chart should I use?',
    'What does correlation mean?'
  ],
  reasoningSnippet: 'Co-pilot starts in scaffolded educational mode, encouraging student formulation of hypotheses rather than passive task completion.'
};

export const DataMindProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sampleDatasets = getSampleDatasets();
  
  // Datasets state
  const [currentDataset, setCurrentDataset] = useState<Dataset>(sampleDatasets.student);
  const [activeDatasetKey, setActiveDatasetKey] = useState<string>('student');
  const [originalDatasetSnapshot, setOriginalDatasetSnapshot] = useState<Dataset>(sampleDatasets.student);

  // Autonomy Level (default to Level 1: Do It and Explain)
  const [autonomyLevel, setAutonomyLevelState] = useState<AutonomyLevel>(1);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [isTutorTyping, setIsTutorTyping] = useState<boolean>(false);

  // Explanation style & Scoreboard
  const [preferredStyle, setPreferredStyle] = useState<ExplanationStyle>('causal');
  const [styleScoreboard, setStyleScoreboard] = useState<Record<ExplanationStyle, { helped: number; neededAlternative: number }>>({
    procedural: { helped: 4, neededAlternative: 1 },
    formula: { helped: 2, neededAlternative: 2 },
    analogical: { helped: 6, neededAlternative: 1 },
    visual: { helped: 7, neededAlternative: 0 },
    causal: { helped: 9, neededAlternative: 1 },
  });

  // Activities & Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'act-init-1',
      timestamp: '10 mins ago',
      type: 'dataset_loaded',
      title: 'Benchmark Dataset Loaded',
      detail: 'Loaded Student Performance Benchmark (25 rows, 8 features)',
      autonomyLevel: 1
    },
    {
      id: 'act-init-2',
      timestamp: '5 mins ago',
      type: 'level_change',
      title: 'Autonomy Dial Configured',
      detail: 'Set to Level 1 (Do It and Explain)',
      autonomyLevel: 1
    }
  ]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['task-outliers']);

  // Theme
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('datamind_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'light';
  });

  // Auth & Profile state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('datamind_user_session');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored user profile', e);
        }
      }
    }
    // Default to Muhammad Aftab Asghar
    return DEMO_USERS.aftab;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = ({ email, password, name, role, isGuest }: { email: string; password?: string; name?: string; role?: UserRole; isGuest?: boolean }) => {
    let matchedUser: UserProfile | undefined = Object.values(DEMO_USERS).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!matchedUser) {
      const fallbackName = name || email.split('@')[0].replace(/[._-]/g, ' ') || 'Learner';
      const initials = fallbackName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'DM';
      matchedUser = {
        id: `user-${Date.now()}`,
        name: fallbackName,
        email,
        role: role || 'student',
        avatarInitials: initials,
        avatarColor: 'from-emerald-500 to-teal-700',
        institution: 'Riphah International University',
        joinedDate: 'October 2026',
        targetLearningGoal: 'Capability-preserving data analysis',
        isGuest: !!isGuest,
      };
    }

    setCurrentUser(matchedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('datamind_user_session', JSON.stringify(matchedUser));
    }
    setIsAuthModalOpen(false);
    logActivity('level_change', `Signed in as ${matchedUser.name}`, `Role: ${matchedUser.role.toUpperCase()}`);
    addToast(`Welcome back, ${matchedUser.name}!`, 'success');
    return true;
  };

  const signup = ({ name, email, role, institution, goal }: { name: string; email: string; password?: string; role: UserRole; institution?: string; goal?: string }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'DM';
    const roleColors: Record<UserRole, string> = {
      student: 'from-emerald-500 to-teal-700',
      researcher: 'from-purple-500 to-indigo-700',
      analyst: 'from-cyan-500 to-blue-700',
      educator: 'from-amber-500 to-orange-700',
    };

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatarInitials: initials,
      avatarColor: roleColors[role] || 'from-emerald-500 to-teal-700',
      institution: institution || 'Academic Institution',
      joinedDate: 'October 2026',
      targetLearningGoal: goal || 'Independent exploratory data analysis',
      isGuest: false,
    };

    setCurrentUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('datamind_user_session', JSON.stringify(newUser));
    }
    setIsAuthModalOpen(false);
    logActivity('level_change', `Account Created: ${newUser.name}`, `Role: ${newUser.role.toUpperCase()}`);
    addToast(`Account created! Welcome to DataMind, ${newUser.name}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('datamind_user_session');
    }
    addToast('You have been signed out', 'info');
    setIsAuthModalOpen(true);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('datamind_user_session', JSON.stringify(updated));
    }
    addToast('Profile updated successfully', 'success');
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('datamind_theme', theme);
  }, [theme]);

  const addToast = (message: string, type: ToastNotification['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logActivity = (type: ActivityLog['type'], title: string, detail: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type,
      title,
      detail,
      autonomyLevel
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const setAutonomyLevel = (level: AutonomyLevel) => {
    setAutonomyLevelState(level);
    logActivity('level_change', `Autonomy Dial updated to Level ${level}`, `Assistance target adjusted to ${100 - level * 25}%`);
    addToast(`Autonomy Dial set to Level ${level}`, 'info');
  };

  const loadSampleDataset = (key: 'student' | 'sales' | 'weather') => {
    const freshSamples = getSampleDatasets();
    const selected = freshSamples[key];
    if (selected) {
      setCurrentDataset(selected);
      setOriginalDatasetSnapshot(selected);
      setActiveDatasetKey(key);
      logActivity('dataset_loaded', `Loaded ${selected.name}`, `${selected.rowCount} rows, ${selected.columnCount} columns`);
      addToast(`Loaded ${selected.name}`, 'success');
    }
  };

  const loadCustomDataset = (dataset: Dataset) => {
    setCurrentDataset(dataset);
    setOriginalDatasetSnapshot(dataset);
    setActiveDatasetKey('custom');
    logActivity('dataset_loaded', `Imported ${dataset.name}`, `${dataset.rowCount} rows, ${dataset.columnCount} columns`);
    addToast(`Imported ${dataset.name} successfully`, 'success');
  };

  const applyDataCleaning = ({
    column,
    missingStrategy,
    removeDuplicates
  }: {
    column?: string;
    missingStrategy?: 'mean' | 'median' | 'drop';
    removeDuplicates?: boolean;
  }) => {
    if (!currentDataset) return { affectedRows: 0, description: 'No active dataset' };

    let updatedRows = [...currentDataset.rows.map(r => ({ ...r }))];
    let affectedCount = 0;
    let desc = '';

    // Handle duplicate removal
    if (removeDuplicates) {
      const seen = new Set<string>();
      const deduplicated: Record<string, any>[] = [];
      for (const row of updatedRows) {
        const hash = JSON.stringify(row);
        if (!seen.has(hash)) {
          seen.add(hash);
          deduplicated.push(row);
        } else {
          affectedCount++;
        }
      }
      updatedRows = deduplicated;
      desc = `Removed ${affectedCount} duplicate row(s).`;
    }

    // Handle missing imputation
    if (column && missingStrategy) {
      const targetCol = currentDataset.columns.find(c => c.name === column);
      if (targetCol) {
        if (missingStrategy === 'drop') {
          const before = updatedRows.length;
          updatedRows = updatedRows.filter(r => r[column] !== null && r[column] !== undefined && r[column] !== '');
          affectedCount = before - updatedRows.length;
          desc = `Dropped ${affectedCount} rows with missing values in '${column}'.`;
        } else {
          const fillValue = missingStrategy === 'mean' 
            ? targetCol.stats?.mean ?? 0 
            : targetCol.stats?.median ?? 0;

          for (const row of updatedRows) {
            if (row[column] === null || row[column] === undefined || row[column] === '') {
              row[column] = fillValue;
              affectedCount++;
            }
          }
          desc = `Imputed ${affectedCount} missing cells in '${column}' using ${missingStrategy} (${fillValue}).`;
        }
      }
    }

    // Recompute column summaries on updated rows
    const updatedColumns = currentDataset.columns.map(col => {
      let missingCount = 0;
      const values: any[] = [];
      for (const row of updatedRows) {
        const v = row[col.name];
        if (v === null || v === undefined || v === '') {
          missingCount++;
        } else {
          values.push(v);
        }
      }
      
      let stats = col.stats;
      if (col.type === 'numeric' && values.length > 0) {
        const nums = values.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = Math.round((sum / nums.length) * 100) / 100;
        const mid = Math.floor(nums.length / 2);
        const median = nums.length % 2 !== 0 ? nums[mid] : Math.round(((nums[mid - 1] + nums[mid]) / 2) * 100) / 100;
        stats = {
          min: nums[0],
          max: nums[nums.length - 1],
          mean,
          median,
          stdDev: stats?.stdDev
        };
      }

      return {
        ...col,
        missingCount,
        stats
      };
    });

    const newMissingTotal = updatedColumns.reduce((sum, c) => sum + c.missingCount, 0);

    setCurrentDataset({
      ...currentDataset,
      rows: updatedRows,
      rowCount: updatedRows.length,
      columns: updatedColumns,
      missingValueCount: newMissingTotal,
      duplicateRowCount: removeDuplicates ? 0 : currentDataset.duplicateRowCount
    });

    logActivity('imputation_applied', 'Data Cleaning Applied', desc);
    addToast(desc, 'success');
    return { affectedRows: affectedCount, description: desc };
  };

  const resetCurrentDataset = () => {
    setCurrentDataset({ ...originalDatasetSnapshot });
    addToast('Dataset reset to original snapshot', 'info');
  };

  const sendChatMessage = (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      content
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTutorTyping(true);

    // Simulate tutor response with realistic delay
    setTimeout(() => {
      const response = generateTutorResponse(content, currentDataset);
      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        content: response.content,
        suggestedFollowUps: response.suggestedFollowUps,
        reasoningSnippet: response.reasoningSnippet
      };

      setChatMessages(prev => [...prev, assistantMsg]);
      setIsTutorTyping(false);
      logActivity('task_attempt', 'AI Data Tutor Consultation', `Asked: "${content.slice(0, 30)}..."`);
    }, 700);
  };

  const clearChat = () => {
    setChatMessages([]);
    addToast('Conversation cleared', 'info');
  };

  const resetChat = () => {
    setChatMessages([INITIAL_GREETING]);
    addToast('Conversation reset to initial state', 'info');
  };

  const recordStyleFeedback = (style: ExplanationStyle, helped: boolean) => {
    setStyleScoreboard(prev => ({
      ...prev,
      [style]: {
        helped: prev[style].helped + (helped ? 1 : 0),
        neededAlternative: prev[style].neededAlternative + (helped ? 0 : 1)
      }
    }));
    addToast(helped ? `Marked ${style} explanation as helpful!` : 'Feedback noted. Swapping explanation...', 'info');
  };

  const markTaskCompleted = (taskId: string, title: string) => {
    if (!completedTaskIds.includes(taskId)) {
      setCompletedTaskIds(prev => [...prev, taskId]);
      logActivity('task_completed', `Activity Completed: ${title}`, `Mastered under Autonomy Level ${autonomyLevel}`);
      addToast(`🎉 Activity Completed: ${title}`, 'success');
    }
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  const resetAllDemoState = () => {
    const samples = getSampleDatasets();
    setCurrentDataset(samples.student);
    setOriginalDatasetSnapshot(samples.student);
    setActiveDatasetKey('student');
    setAutonomyLevelState(1);
    setChatMessages([INITIAL_GREETING]);
    setCompletedTaskIds(['task-outliers']);
    setActivityLogs([
      {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        type: 'dataset_loaded',
        title: 'Demo Session Reset',
        detail: 'Restored baseline demonstration state',
        autonomyLevel: 1
      }
    ]);
    addToast('All demonstration state has been reset', 'info');
  };

  return (
    <DataMindContext.Provider
      value={{
        currentDataset,
        activeDatasetKey,
        loadSampleDataset,
        loadCustomDataset,
        applyDataCleaning,
        resetCurrentDataset,
        autonomyLevel,
        setAutonomyLevel,
        chatMessages,
        isTutorTyping,
        sendChatMessage,
        clearChat,
        resetChat,
        preferredStyle,
        setPreferredStyle,
        styleScoreboard,
        recordStyleFeedback,
        activityLogs,
        completedTaskIds,
        markTaskCompleted,
        logActivity,
        theme,
        toggleTheme,
        setTheme,
        toasts,
        addToast,
        removeToast,
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        resetAllDemoState
      }}
    >
      {children}
    </DataMindContext.Provider>
  );
};

export const useDataMind = () => {
  const context = useContext(DataMindContext);
  if (!context) {
    throw new Error('useDataMind must be used within a DataMindProvider');
  }
  return context;
};
