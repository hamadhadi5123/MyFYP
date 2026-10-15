import React from 'react';
import { useDataMind } from '../../context/DataMindContext';
import { AUTONOMY_LEVELS } from '../../data/autonomyTasks';
import { AutonomyLevel } from '../../types';
import { Bot, HelpCircle, CheckCircle2, UserCheck, Sparkles, ArrowRight } from 'lucide-react';

interface AutonomyDialWidgetProps {
  onLevelSelect?: (level: AutonomyLevel) => void;
  compact?: boolean;
}

export const AutonomyDialWidget: React.FC<AutonomyDialWidgetProps> = ({ 
  onLevelSelect,
  compact = false 
}) => {
  const { autonomyLevel, setAutonomyLevel } = useDataMind();

  const handleSelect = (lvl: AutonomyLevel) => {
    setAutonomyLevel(lvl);
    if (onLevelSelect) onLevelSelect(lvl);
  };

  const levelIcons = [
    Bot,          // L0
    Sparkles,     // L1
    HelpCircle,   // L2
    CheckCircle2, // L3
    UserCheck,    // L4
  ];

  const activeInfo = AUTONOMY_LEVELS[autonomyLevel];

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        {AUTONOMY_LEVELS.map(info => {
          const isSelected = autonomyLevel === info.level;
          return (
            <button
              key={info.level}
              onClick={() => handleSelect(info.level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              L{info.level}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Engine A · Fading Scaffolding
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              Wood/Bruner/Ross (1976)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            The Autonomy Dial
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select the assistance level to modulate how much cognitive responsibility the co-pilot assumes.
          </p>
        </div>

        {/* Assistance / Independence Balance */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              AI Assistance
            </div>
            <div className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              {activeInfo.assistanceRatio}%
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              Human Autonomy
            </div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {100 - activeInfo.assistanceRatio}%
            </div>
          </div>
        </div>
      </div>

      {/* 5-Level Interactive Stepper / Dial */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
        {AUTONOMY_LEVELS.map(info => {
          const isSelected = autonomyLevel === info.level;
          const Icon = levelIcons[info.level];

          return (
            <button
              key={info.level}
              onClick={() => handleSelect(info.level)}
              className={`relative flex flex-col p-4 rounded-xl text-left transition-all border ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {isSelected && (
                <span className="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                  Active
                </span>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSelected 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  L{info.level}
                </span>
              </div>

              <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {info.name}
              </div>
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                {info.tagline}
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {info.description}
              </div>

              <div className="mt-auto pt-3">
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${100 - info.assistanceRatio}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                  <span>Help {info.assistanceRatio}%</span>
                  <span>Own {100 - info.assistanceRatio}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Guidance Banner for Active Level */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white">
            Level {autonomyLevel} Behavior: 
          </span>{' '}
          {autonomyLevel === 0 && 'The co-pilot completes the task directly, logging code and rationale for you.'}
          {autonomyLevel === 1 && 'The co-pilot walks you through the operation step-by-step before finalizing.'}
          {autonomyLevel === 2 && 'The co-pilot asks guiding Socratic questions to prompt your own reasoning.'}
          {autonomyLevel === 3 && 'You make the analysis decision first; the co-pilot evaluates and validates your rationale.'}
          {autonomyLevel === 4 && 'Hands-off mode. You perform the analysis unaided, building genuine long-term capability.'}
        </div>
      </div>
    </div>
  );
};
