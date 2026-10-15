import React from 'react';
import { Lightbulb, Info } from 'lucide-react';

interface ReasoningPanelProps {
  title?: string;
  rationale: string;
  assumptions?: string[];
  alternatives?: string[];
  compact?: boolean;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({
  title = 'Analysis Reasoning & Pedagogical Rationale',
  rationale,
  assumptions,
  alternatives,
  compact = false,
}) => {
  return (
    <div className={`rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-500/30 p-4 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-800 dark:text-emerald-300">
        <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>{title}</span>
        <span className="ml-auto text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
          Pedagogical Rule
        </span>
      </div>

      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
        {rationale}
      </p>

      {assumptions && assumptions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-emerald-500/15">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Key Assumptions:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-xs pl-1">
            {assumptions.map((asm, idx) => (
              <li key={idx}>{asm}</li>
            ))}
          </ul>
        </div>
      )}

      {alternatives && alternatives.length > 0 && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
          <span className="font-semibold not-italic">Consider also: </span>
          {alternatives.join(' · ')}
        </div>
      )}
    </div>
  );
};
