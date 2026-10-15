import React from 'react';
import { useDataMind } from '../context/DataMindContext';
import { AUTONOMY_LEVELS } from '../data/autonomyTasks';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ProgressPageProps {
  onNavigate: (page: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const { 
    autonomyLevel, 
    completedTaskIds, 
    activityLogs,
    styleScoreboard 
  } = useDataMind();

  const levelInfo = AUTONOMY_LEVELS[autonomyLevel];

  // Dynamic Skill Competence scores based on current session activities
  const skillCategories = [
    {
      name: 'Data Cleaning & Imputation',
      score: completedTaskIds.includes('task-outliers') ? 85 : 40,
      badge: completedTaskIds.includes('task-outliers') ? 'Mastered' : 'Practicing',
      color: '#10B981'
    },
    {
      name: 'Exploratory Visualization',
      score: completedTaskIds.includes('task-visualization') ? 90 : 55,
      badge: completedTaskIds.includes('task-visualization') ? 'Proficient' : 'In Progress',
      color: '#0284C7'
    },
    {
      name: 'Causal Inference & Confounders',
      score: completedTaskIds.includes('task-correlation') ? 80 : 35,
      badge: completedTaskIds.includes('task-correlation') ? 'Proficient' : 'Developing',
      color: '#8B5CF6'
    },
    {
      name: 'Descriptive Statistics',
      score: 75,
      badge: 'Proficient',
      color: '#D97706'
    }
  ];

  const milestones = [
    {
      id: 'm1',
      title: 'Scaffolding Initiate',
      desc: 'Set Autonomy Dial to Level 1 and inspected guided walkthrough.',
      achieved: true,
      time: 'Session Start'
    },
    {
      id: 'm2',
      title: 'Outlier Defender',
      desc: 'Correctly selected Median Imputation to prevent leverage skew.',
      achieved: completedTaskIds.includes('task-outliers'),
      time: 'In Session'
    },
    {
      id: 'm3',
      title: 'Causal Skeptic',
      desc: 'Successfully identified confounding backdoor path in observational correlation.',
      achieved: completedTaskIds.includes('task-correlation'),
      time: 'In Session'
    },
    {
      id: 'm4',
      title: 'Autonomous Master (Level 4)',
      desc: 'Completed an unassisted analysis decision without emergency scaffolding.',
      achieved: autonomyLevel === 4,
      time: autonomyLevel === 4 ? 'Just achieved' : 'Pending Level 4'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Longitudinal Scaffolding Tracker
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            My Learning Progress & Autonomy Delta
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Tracks the core thesis metric: transfer of analytical responsibility from co-pilot to human learner during active session use.
          </p>
        </div>

        <button
          onClick={() => onNavigate('studio')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs shadow-md transition-colors self-start md:self-auto"
        >
          <span>Practice More Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Current Autonomy</span>
            <span className="text-xs font-bold text-emerald-500">L{autonomyLevel}</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {levelInfo.name}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {100 - levelInfo.assistanceRatio}% independent execution
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Activities</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {completedTaskIds.length} <span className="text-xs text-slate-400 font-normal">/ 3 tasks</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Recorded in current session
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">AI Support Fading</span>
            <TrendingDown className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            -{100 - levelInfo.assistanceRatio}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Reduction in cognitive scaffolding
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Earned Milestones</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {milestones.filter(m => m.achieved).length} <span className="text-xs text-slate-400 font-normal">/ 4</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Pedagogical achievements
          </div>
        </div>
      </div>

      {/* Skill Mastery Category Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Bars */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Science Competency Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live estimated capability across core methodological disciplines.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {skillCategories.map(skill => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
                      {skill.badge}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{skill.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.score}%`, backgroundColor: skill.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Scores update dynamically as you complete practice exercises in the Learning Studio.
          </div>
        </div>

        {/* Skill Mastery Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Competence Distribution Chart
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Visual comparison of your relative capability across skills.
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillCategories} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`${val}%`, 'Capability Score']}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {skillCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone Badges */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Pedagogical Milestones</span>
          </h3>

          <div className="space-y-3">
            {milestones.map(m => (
              <div 
                key={m.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  m.achieved
                    ? 'border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 opacity-70'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  m.achieved ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{m.time}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Session Timeline */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Full Session Interaction Timeline</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">{activityLogs.length} events logged</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {activityLogs.map(log => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-white">{log.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{log.detail}</div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
