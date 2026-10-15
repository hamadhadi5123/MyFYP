import React, { useState } from 'react';
import { useDataMind } from '../context/DataMindContext';
import { TOPIC_EXPLANATIONS, EXPLANATION_STYLES } from '../data/explanationData';
import { ExplanationStyle } from '../types';
import { 
  Sparkles, 
  Copy, 
  ThumbsUp, 
  HelpCircle, 
  Columns, 
  RotateCcw, 
  ListOrdered, 
  Sigma, 
  LayoutGrid, 
  Network, 
  Check, 
  Info,
  Clock
} from 'lucide-react';
import { ReasoningPanel } from '../components/common/ReasoningPanel';

export const ExplanationLabPage: React.FC = () => {
  const { 
    preferredStyle, 
    setPreferredStyle, 
    styleScoreboard, 
    recordStyleFeedback, 
    addToast 
  } = useDataMind();

  const [selectedTopicId, setSelectedTopicId] = useState(TOPIC_EXPLANATIONS[0].topicId);
  const [activeStyle, setActiveStyle] = useState<ExplanationStyle>(preferredStyle);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewHistory, setViewHistory] = useState<{ topic: string; style: string; time: string }[]>([
    { topic: 'Mean vs Median Imputation', style: 'Causal & Reasoning', time: '5m ago' },
    { topic: 'P-Values & Significance', style: 'Analogical', time: '12m ago' },
  ]);

  const topic = TOPIC_EXPLANATIONS.find(t => t.topicId === selectedTopicId) || TOPIC_EXPLANATIONS[0];
  const explanation = topic.styles[activeStyle];

  const handleStyleChange = (style: ExplanationStyle) => {
    setActiveStyle(style);
    setPreferredStyle(style);
    setViewHistory(prev => [
      { topic: topic.topicTitle, style: EXPLANATION_STYLES.find(s => s.id === style)?.name || style, time: 'Just now' },
      ...prev.slice(0, 5)
    ]);
  };

  const handleCopy = () => {
    const fullText = `${explanation.title}\n\n${explanation.content}\n\nKey Takeaway: ${explanation.keyTakeaway}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    addToast('Explanation copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getStyleIcon = (id: ExplanationStyle) => {
    switch (id) {
      case 'procedural': return ListOrdered;
      case 'formula': return Sigma;
      case 'analogical': return Sparkles;
      case 'visual': return LayoutGrid;
      case 'causal': return Network;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Cognitive Diversity · Engine B
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            The Explanation Lab
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Repurposes multi-agent swarms into 5 parallel cognitive representations. Discover which mental model unlocks intuition for your learning style.
          </p>
        </div>

        <button
          onClick={() => setIsCompareMode(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            isCompareMode
              ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
              : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Columns className="w-4 h-4" />
          <span>{isCompareMode ? 'Exit Comparison' : 'Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* Topic & Style Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Topic Selector */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Select Topic Curriculum
          </label>
          <div className="space-y-1.5">
            {TOPIC_EXPLANATIONS.map(t => (
              <button
                key={t.topicId}
                onClick={() => setSelectedTopicId(t.topicId)}
                className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all border ${
                  selectedTopicId === t.topicId
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white truncate">
                  {t.topicTitle}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {t.summary}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Style Selector (5 styles) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            2. Select Cognitive Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {EXPLANATION_STYLES.map(style => {
              const Icon = getStyleIcon(style.id);
              const isSelected = activeStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-mono text-slate-400">
                      {styleScoreboard[style.id]?.helped || 0}★
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs">{style.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {style.shortDescription}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Explanation Body: Standard or Side-by-Side Comparison */}
      {!isCompareMode ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {/* Top Bar of Explanation Box */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {EXPLANATION_STYLES.find(s => s.id === activeStyle)?.name} Mental Model
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {explanation.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => recordStyleFeedback(activeStyle, true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>This Clicked!</span>
              </button>

              <button
                onClick={() => recordStyleFeedback(activeStyle, false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Alternative</span>
              </button>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="p-6 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80">
              <pre className="font-sans text-xs md:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {explanation.content}
              </pre>
            </div>

            {/* Key Takeaway Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong>Core Intuitive Takeaway: </strong>
                {explanation.keyTakeaway}
              </div>
            </div>

            {/* Assumptions & Scientific Limitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>Foundational Assumptions</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {topic.assumptions.map((asm, idx) => (
                    <li key={idx}>{asm}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-500" />
                  <span>Boundary Conditions & Limitations</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {topic.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Side-by-Side Comparison Mode (all 5 styles simultaneously!) */
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Simultaneous 5-Model Cognitive Comparison for: {topic.topicTitle}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {EXPLANATION_STYLES.map(style => {
              const exp = topic.styles[style.id];
              const Icon = getStyleIcon(style.id);
              return (
                <div 
                  key={style.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                      <Icon className="w-4 h-4" />
                      <span>{style.name}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-2">
                      {exp.title}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-8">
                      {exp.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        handleStyleChange(style.id);
                        setIsCompareMode(false);
                      }}
                      className="w-full py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      Focus This Style
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Grid: Pheromone Scoreboard + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The Cognitive Style Scoreboard */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Learner Cognitive Scoreboard ("Pheromone Trail")</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Session-only feedback tracking which mental models produce successful breakthroughs for your mind.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {EXPLANATION_STYLES.map(style => {
              const score = styleScoreboard[style.id] || { helped: 0, neededAlternative: 0 };
              const total = score.helped + score.neededAlternative || 1;
              const helpedRatio = Math.round((score.helped / total) * 100);

              return (
                <div key={style.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{style.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {score.helped} positive ({helpedRatio}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${helpedRatio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
            * Session demo metric: does not store personal behavioral profiles outside browser memory.
          </div>
        </div>

        {/* Explanation Exploration History */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recent Explanations Inspected</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">{viewHistory.length} events</span>
            </div>

            <div className="space-y-2.5">
              {viewHistory.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{item.topic}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{item.style} style</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            Tip: Learners who switch styles when confused show 34% higher retention than single-style readers.
          </div>
        </div>
      </div>
    </div>
  );
};
