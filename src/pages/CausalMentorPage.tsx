import React, { useState } from 'react';
import { useDataMind } from '../context/DataMindContext';
import { CAUSAL_SCENARIOS } from '../data/causalScenarios';
import { InteractiveCausalGraph } from '../components/causal/InteractiveCausalGraph';
import { CausalNode } from '../types';
import { 
  Network, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Eye, 
  ChevronRight, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ReasoningPanel } from '../components/common/ReasoningPanel';

export const CausalMentorPage: React.FC = () => {
  const { addToast } = useDataMind();

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);
  const [revealedReasoningDepth, setRevealedReasoningDepth] = useState(1); // 1 to 4 levels

  const scenario = CAUSAL_SCENARIOS[selectedScenarioIndex];

  const handleSwitchScenario = (idx: number) => {
    setSelectedScenarioIndex(idx);
    setSelectedNode(null);
    setRevealedReasoningDepth(1);
    addToast(`Switched scenario to: ${CAUSAL_SCENARIOS[idx].title}`, 'info');
  };

  const handleRevealMoreReasoning = () => {
    if (revealedReasoningDepth < scenario.deepReasoningLevels.length) {
      setRevealedReasoningDepth(prev => prev + 1);
      addToast(`Revealed Level ${revealedReasoningDepth + 1} Causal Depth`, 'info');
    }
  };

  const handleResetCausal = () => {
    setSelectedNode(null);
    setRevealedReasoningDepth(1);
    addToast('Reset causal reasoning workspace', 'info');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Structural Epistemology · Engine C
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            The Causal Mentor Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Go beyond surface correlations. Articulate structural assumptions, identify backdoor confounders, and progressively unmask mechanism-level explanations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleResetCausal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Prominent Scientific Axiom Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <div className="text-xs">
          <strong>Scientific Principle: </strong>
          <em>Correlation does not prove causation.</em> DataMind never presents observational associations as proven causal interventions without explicit structural DAG identification.
        </div>
      </div>

      {/* Scenario Selector & Hypothesis Input */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Select Analytical Scenario
            </label>
            <div className="flex flex-wrap gap-2">
              {CAUSAL_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => handleSwitchScenario(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedScenarioIndex === idx
                      ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Domain: {scenario.domain}</span>
        </div>

        {/* Working Hypothesis & Observed Pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Observational Association:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
              {scenario.observedPattern}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              Working Causal Hypothesis:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {scenario.hypothesis}
            </p>
          </div>
        </div>
      </div>

      {/* The Interactive DAG Canvas */}
      <InteractiveCausalGraph
        nodes={scenario.nodes}
        edges={scenario.edges}
        selectedNodeId={selectedNode?.id}
        onSelectNode={setSelectedNode}
      />

      {/* Structured Reasoning Flow (The 6 Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Assumptions & Alternatives */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>Underlying Structural Assumptions</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {scenario.assumptions.map((asm, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{asm}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Alternative Explanations & Confounders</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {scenario.alternativeExplanations.map((alt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    !
                  </span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Evidence Needed & Progressive Why-Depth */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
              <span>Evidence Needed to Confirm Mechanism</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {scenario.evidenceNeeded.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    →
                  </span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Study Limitations & Statistical Uncertainty</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {scenario.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Progressive Reasoning Fading Section */}
      <div className="p-6 rounded-2xl border border-purple-500/30 bg-purple-50/20 dark:bg-purple-950/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Progressive Why-Reasoning (Depth {revealedReasoningDepth} of {scenario.deepReasoningLevels.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Demonstrates fading support: revealing progressively deeper structural mechanisms as autonomy advances.
            </p>
          </div>

          {revealedReasoningDepth < scenario.deepReasoningLevels.length && (
            <button
              onClick={handleRevealMoreReasoning}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal More Reasoning</span>
            </button>
          )}
        </div>

        {/* Stack of revealed reasoning cards */}
        <div className="space-y-3">
          {scenario.deepReasoningLevels.slice(0, revealedReasoningDepth).map(lvl => (
            <div
              key={lvl.level}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/80 shadow-xs animate-fade-in"
            >
              <div className="font-bold text-xs text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-2">
                <span>{lvl.title}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {lvl.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
