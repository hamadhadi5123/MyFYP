import React from 'react';
import { useDataMind } from '../context/DataMindContext';
import { AutonomyDialWidget } from '../components/dial/AutonomyDialWidget';
import { AutonomyTaskPlayer } from '../components/dial/AutonomyTaskPlayer';
import { 
  GraduationCap, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  Award,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface LearningStudioPageProps {
  onNavigate: (page: string) => void;
}

const LEARNING_JOURNEY_DATA = [
  { module: 'M1: Ingestion', assistance: 100, autonomy: 0, level: 'L0' },
  { module: 'M2: Quality & Missing', assistance: 75, autonomy: 25, level: 'L1' },
  { module: 'M3: Skewness & Outliers', assistance: 50, autonomy: 50, level: 'L2' },
  { module: 'M4: Visual Hypothesis', assistance: 25, autonomy: 75, level: 'L3' },
  { module: 'M5: Causal Modeling', assistance: 0, autonomy: 100, level: 'L4' },
];

export const LearningStudioPage: React.FC<LearningStudioPageProps> = ({ onNavigate }) => {
  const { 
    autonomyLevel, 
    completedTaskIds, 
    activityLogs 
  } = useDataMind();

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Flagship FYP Architecture · Engine A
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Learning Studio & The Autonomy Dial
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Architected fading scaffolding based on Wood, Bruner & Ross (1976). Adjust the dial to dynamically transition from full AI execution down to unassisted independent analysis.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Completed in Session</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">
              {completedTaskIds.length} <span className="text-xs text-slate-400">/ 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. The Interactive 5-Level Autonomy Dial */}
      <AutonomyDialWidget />

      {/* 2. The Interactive Practice Task Player */}
      <AutonomyTaskPlayer />

      {/* 3. Learning Journey & Pedagogical Foundation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scaffolding Fading Curve */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span>Curriculum Fading Scaffolding Journey</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                Illustrative Demo Curve
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How AI assistance systematically steps down as the student masters data analysis competencies.
            </p>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={LEARNING_JOURNEY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />
                  <XAxis dataKey="level" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [`${val}%`, name === 'autonomy' ? 'Human Autonomy' : 'AI Support']}
                  />
                  <Area type="monotone" dataKey="autonomy" stroke="#10B981" fill="#10B981" fillOpacity={0.25} />
                  <Area type="monotone" dataKey="assistance" stroke="#64748B" fill="#64748B" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Level 0 (100% help)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Transfer of Responsibility →</span>
            <span>Level 4 (0% help)</span>
          </div>
        </div>

        {/* Why This Matters Panel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Why Capability Preservation Matters
              </h3>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>The Deskilling Epidemic:</strong> Current enterprise AI tools optimize solely for <em>task completion</em>: the human asks, the AI generates the Python code, and the human accepts without understanding. Over time, analysts become dependent and deskilled.
              </p>
              <p>
                <strong>The Structural Failure of Prompting:</strong> LLMs are trained to be "helpful-by-default," which causes them to over-explain and linger. Prompting alone cannot solve this; it requires an explicit <strong>Autonomy Dial</strong> architecture.
              </p>
              <p>
                <strong>The Pedagogical Triad:</strong> DataMind implements Bruner's three scaffolding tenets: <em>Contingency</em> (assistance matched to current error), <em>Fading</em> (assistance gradually withdrawn), and <em>Transfer of Responsibility</em> (learner performs the task unaided).
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Next Recommended Module:</span>
            <button
              onClick={() => onNavigate('explanation')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Explanation Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
