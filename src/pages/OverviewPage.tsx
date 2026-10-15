import React from 'react';
import { useDataMind } from '../context/DataMindContext';
import { AUTONOMY_LEVELS } from '../data/autonomyTasks';
import { 
  ArrowRight, 
  Sparkles, 
  Database, 
  Bot, 
  GraduationCap, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle2, 
  Network, 
  Layers, 
  Clock, 
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  Zap,
  BrainCircuit,
  Lock,
  User,
  LogIn
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';

interface OverviewPageProps {
  onNavigate: (page: string) => void;
}

// Illustrative decreasing dependence trend data across demonstration sessions
const DEPENDENCE_TREND_DATA = [
  { session: 'S1 (Baseline)', assistance: 95, autonomy: 5, label: 'Full Co-pilot support' },
  { session: 'S2 (Imputation)', assistance: 85, autonomy: 15, label: 'Guided step walkthrough' },
  { session: 'S3 (Statistics)', assistance: 70, autonomy: 30, label: 'Socratic hint prompts' },
  { session: 'S4 (Visuals)', assistance: 50, autonomy: 50, label: 'Peer evaluation' },
  { session: 'S5 (Causal)', assistance: 30, autonomy: 70, label: 'Check my work' },
  { session: 'S6 (Current)', assistance: 20, autonomy: 80, label: 'Independent reasoning' },
];

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { 
    currentDataset, 
    autonomyLevel, 
    activityLogs, 
    completedTaskIds, 
    loadSampleDataset, 
    activeDatasetKey,
    currentUser,
    openAuthModal
  } = useDataMind();

  const levelInfo = AUTONOMY_LEVELS[autonomyLevel];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070B14] via-[#0F1B33] to-[#0A1325] text-white p-8 md:p-12 border border-slate-800/90 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            {/* User Greeting & Status */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Capability-Preserving Co-Pilot</span>
              </div>

              {currentUser && (
                <div 
                  onClick={() => openAuthModal('signin')}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs transition-colors"
                  title="Click to switch profile or log out"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">({currentUser.role})</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Understand your data.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Build your independence.
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
              Traditional AI copilot tools create passive dependence by solving analysis tasks for you. DataMind structures AI scaffolding to fade over time so you retain genuine competence.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('studio')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/30 hover:scale-[1.02]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Enter Learning Studio</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('workspace')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700/80 transition-all hover:scale-[1.02]"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Explore Dataset</span>
              </button>

              <button
                onClick={() => onNavigate('tutor')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700/80 transition-all hover:scale-[1.02]"
              >
                <Bot className="w-4 h-4 text-sky-400" />
                <span>AI Data Tutor</span>
              </button>
            </div>
          </div>

          {/* Quick Hero Status Card */}
          <div className="lg:w-80 p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Session Control
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Level {autonomyLevel} Active
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Assistance Ratio:</span>
                  <span className="font-bold text-white">{levelInfo.assistanceRatio}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${levelInfo.assistanceRatio}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>Learner Autonomy:</span>
                  <span className="font-bold text-emerald-400">{100 - levelInfo.assistanceRatio}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${100 - levelInfo.assistanceRatio}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => openAuthModal('signin')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch / Login</span>
              </button>

              <button
                onClick={() => onNavigate('studio')}
                className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1"
              >
                <span>Adjust Dial →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Dataset */}
        <div 
          onClick={() => onNavigate('workspace')}
          className="cursor-pointer group p-5 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Dataset</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white truncate">
            {currentDataset?.name || 'No Dataset'}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentDataset?.rowCount || 0} rows</span>
            <span>•</span>
            <span>{currentDataset?.columnCount || 0} features</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
            <span>Inspect in Workspace</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Current Learning Level */}
        <div 
          onClick={() => onNavigate('studio')}
          className="cursor-pointer group p-5 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Autonomy Dial</span>
            <span className="text-xs font-mono font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">L{autonomyLevel} / 4</span>
          </div>
          <div className="text-base font-extrabold text-slate-900 dark:text-white truncate">
            {levelInfo.name}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>AI Assistance:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{levelInfo.assistanceRatio}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
              style={{ width: `${(autonomyLevel / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 3: Completed Activities */}
        <div 
          onClick={() => onNavigate('progress')}
          className="cursor-pointer group p-5 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Competence Tasks</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {completedTaskIds.length}{' '}
            <span className="text-xs font-normal text-slate-400">/ 3 Core Tasks</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Fading scaffolding practice activities
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
            <span>View mastery breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Independence Trajectory */}
        <div 
          onClick={() => onNavigate('progress')}
          className="cursor-pointer group p-5 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Independence Score</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-500">
            {100 - levelInfo.assistanceRatio}%
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            <span>Assistance fading systematically</span>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 font-mono">
            Wood & Bruner Scaffolding
          </div>
        </div>
      </section>

      {/* The Core Thesis: Decreasing Dependence Curve */}
      <section className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Headline Research Metric
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                Empirical Demonstration Curve
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Fading Scaffolding: The Decreasing-Dependence Trajectory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Unlike commercial data assistants that maximize user reliance, DataMind structurally shifts cognitive labor from the AI co-pilot to the human analyst over successive sessions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Human Autonomy (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">AI Assistance (%)</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DEPENDENCE_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAutonomy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
              <XAxis dataKey="session" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0D1527', 
                  borderColor: '#1E293B', 
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(val: any, name: any) => [`${val}%`, name === 'autonomy' ? 'Human Independence' : 'AI Assistance']}
              />
              <Area 
                type="monotone" 
                dataKey="autonomy" 
                stroke="#10B981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorAutonomy)" 
              />
              <Line 
                type="monotone" 
                dataKey="assistance" 
                stroke="#64748B" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                dot={{ r: 4, fill: '#64748B' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            <strong>Success Definition:</strong> The learner requires strictly less prompting to detect skewness, evaluate confounders, and select appropriate estimators.
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            Target: Level 4 (Autonomous)
          </span>
        </div>
      </section>

      {/* The Three Conceptual Engines Breakdown */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            The Three Core Engines of DataMind
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            A principled pedagogical architecture designed for the CS Final Year Project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Engine A */}
          <div 
            onClick={() => onNavigate('studio')}
            className="cursor-pointer group p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-lg mb-4 ring-1 ring-emerald-500/20">
                A
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                The Skeleton · Priority 1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                The Autonomy Dial
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Structurally enforces fading scaffolding across 5 discrete levels: from <em>Do It For Me</em> down to <em>Independent Hands-Off Work</em>. Moves dynamically with user competence.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Learning Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Engine B */}
          <div 
            onClick={() => onNavigate('explanation')}
            className="cursor-pointer group p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-black text-lg mb-4 ring-1 ring-sky-500/20">
                B
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Cognitive Swarm · Priority 2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Explanation Variety
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Repurposes parallel agents into 5 mental models: <em>Procedural</em>, <em>Formulaic</em>, <em>Analogical</em>, <em>Visual</em>, and <em>Causal</em>. Tracks which model clicks for the learner.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Explanation Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Engine C */}
          <div 
            onClick={() => onNavigate('causal')}
            className="cursor-pointer group p-6 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-black text-lg mb-4 ring-1 ring-purple-500/20">
                C
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Mechanisms · Prototype
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                The Causal Mentor
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Teaches the "why" behind data decisions through Directed Acyclic Graphs (DAGs), unmeasured confounders, backdoor paths, and progressive why-depth.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Inspect Causal DAGs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Grid: Recent Datasets + Activity Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sample Datasets Quick Switcher */}
        <div className="p-6 md:p-7 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Built-in Demonstration Datasets</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Load</span>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'student', title: 'Student Performance Benchmark', rows: 25, cols: 8, tag: 'Education / Regression' },
              { key: 'sales', title: 'Retail Sales & Profitability', rows: 18, cols: 8, tag: 'Business / Outliers' },
              { key: 'weather', title: 'Weather & Grid Energy Demand', rows: 15, cols: 6, tag: 'Time Series / Correlation' }
            ].map(ds => {
              const isSelected = activeDatasetKey === ds.key;
              return (
                <div
                  key={ds.key}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {ds.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ds.rows} rows · {ds.cols} columns · {ds.tag}
                    </div>
                  </div>
                  <button
                    onClick={() => loadSampleDataset(ds.key as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Load'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Session Activity Timeline */}
        <div className="p-6 md:p-7 rounded-3xl bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Live Session Activity Log</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 4).map(log => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {log.title}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {log.detail}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Next Activity:</span>
            <button
              onClick={() => onNavigate('studio')}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Practice Task at Level {autonomyLevel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
