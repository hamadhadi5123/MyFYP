import React, { useState } from 'react';
import { useDataMind } from '../../context/DataMindContext';
import { PRACTICE_TASKS } from '../../data/autonomyTasks';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ReasoningPanel } from '../common/ReasoningPanel';

export const AutonomyTaskPlayer: React.FC = () => {
  const { 
    autonomyLevel, 
    markTaskCompleted, 
    completedTaskIds, 
    logActivity, 
    addToast 
  } = useDataMind();

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [revealedHintIndex, setRevealedHintIndex] = useState(-1);
  const [showIndependentHelp, setShowIndependentHelp] = useState(false);

  const task = PRACTICE_TASKS[activeTaskIndex];
  const isCompleted = completedTaskIds.includes(task.id);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setHasCheckedAnswer(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) {
      addToast('Please select an option first.', 'warning');
      return;
    }

    setHasCheckedAnswer(true);
    const isCorrect = selectedOption === task.correctOptionIndex;

    logActivity(
      'task_attempt',
      `Practiced: ${task.title}`,
      `Selected Option ${selectedOption + 1} (${isCorrect ? 'Correct' : 'Incorrect'}) at Level ${autonomyLevel}`
    );

    if (isCorrect) {
      markTaskCompleted(task.id, task.title);
      addToast('Excellent reasoning! Your decision aligns with statistical rigor.', 'success');
    } else {
      addToast('Not quite. Review the feedback and try adjusting your reasoning.', 'warning');
    }
  };

  const handleRevealNextHint = () => {
    if (revealedHintIndex < task.hints.length - 1) {
      setRevealedHintIndex(prev => prev + 1);
      addToast(`Hint ${revealedHintIndex + 2} unlocked`, 'info');
    }
  };

  const handleResetTask = () => {
    setSelectedOption(null);
    setHasCheckedAnswer(false);
    setRevealedHintIndex(-1);
    setShowIndependentHelp(false);
  };

  const handleSwitchTask = (idx: number) => {
    setActiveTaskIndex(idx);
    handleResetTask();
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header with Task Selector Tabs */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Interactive Practice Task
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {task.difficulty}
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Completed in Session
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {task.title}
            </h3>
          </div>

          {/* Task switcher pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
            {PRACTICE_TASKS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => handleSwitchTask(idx)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTaskIndex === idx
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Task {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Context */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold text-slate-900 dark:text-white">Dataset Context: </span>
          {task.context}
        </div>
      </div>

      {/* Main Task Body modulated by Autonomy Level */}
      <div className="p-6 space-y-6">
        {/* The Question Prompt */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-mono">
              Q
            </span>
            {task.question}
          </h4>
        </div>

        {/* ============================================================ */}
        {/* LEVEL 0: DO IT FOR ME (Full AI Execution)                     */}
        {/* ============================================================ */}
        {autonomyLevel === 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Co-Pilot Executed Action (Full Automation)
              </div>
              <p className="text-sm font-mono text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {task.directSolution}
              </p>
            </div>

            <ReasoningPanel
              title="Autonomous Rationale"
              rationale={task.explanation}
              assumptions={['Target variable distribution was checked for skewness (>0.8).', 'Linear model is downstream consumer.']}
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Notice: At Level 0, no user decision is required.
              </span>
              <button
                onClick={() => markTaskCompleted(task.id, task.title)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
              >
                Accept Execution
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LEVEL 1: DO IT AND EXPLAIN (Guided Walkthrough)              */}
        {/* ============================================================ */}
        {autonomyLevel === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-500/20">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider mb-3">
                <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Step-by-Step Guided Walkthrough
              </div>

              <div className="space-y-2.5">
                {task.stepByStepSolution.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <ReasoningPanel
              title="Pedagogical Reasoning for Steps"
              rationale={task.explanation}
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => markTaskCompleted(task.id, task.title)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
              >
                I Understand This Walkthrough
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LEVEL 2: GIVE ME HINTS (Socratic Prompting)                  */}
        {/* ============================================================ */}
        {autonomyLevel === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Socratic Guiding Hints ({revealedHintIndex + 1} of {task.hints.length} unlocked)
                </div>
                {revealedHintIndex < task.hints.length - 1 && (
                  <button
                    onClick={handleRevealNextHint}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors"
                  >
                    Unlock Next Hint
                  </button>
                )}
              </div>

              {revealedHintIndex === -1 ? (
                <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-dashed border-amber-300 dark:border-amber-700 text-center text-xs text-slate-500">
                  Click <strong>Unlock Next Hint</strong> when you need a guiding question to test your reasoning.
                </div>
              ) : (
                <div className="space-y-2">
                  {task.hints.slice(0, revealedHintIndex + 1).map((hint, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
                    >
                      <span className="font-bold text-amber-600 shrink-0">Hint {idx + 1}:</span>
                      <span>{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Selection Options */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Select Your Answer:
              </div>
              {task.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                    selectedOption === idx
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-slate-900 dark:text-white font-medium ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                    selectedOption === idx
                      ? 'border-emerald-500 bg-emerald-500 text-white font-bold'
                      : 'border-slate-300 text-slate-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleResetTask}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Selection
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Check My Answer
              </button>
            </div>

            {hasCheckedAnswer && (
              <div className="animate-fade-in pt-3">
                <ReasoningPanel
                  title={selectedOption === task.correctOptionIndex ? '✓ Correct Rationale' : 'Review Decision'}
                  rationale={task.explanation}
                />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* LEVEL 3: CHECK MY WORK (Evaluative Feedback)                */}
        {/* ============================================================ */}
        {autonomyLevel === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Select what you consider the best methodological decision. The co-pilot will check your submission against domain best practices.
            </div>

            <div className="space-y-2.5">
              {task.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === task.correctOptionIndex;

                let stateClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300';
                if (isSelected) {
                  stateClass = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-slate-900 dark:text-white ring-1 ring-emerald-500';
                }

                if (hasCheckedAnswer) {
                  if (isSelected && isCorrect) {
                    stateClass = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    stateClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 font-semibold ring-2 ring-rose-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasCheckedAnswer}
                    className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-start gap-3 ${stateClass}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1 leading-relaxed">
                      {opt}
                    </div>
                    {hasCheckedAnswer && isSelected && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleResetTask}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Selection
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null || hasCheckedAnswer}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Check My Work
              </button>
            </div>

            {hasCheckedAnswer && (
              <div className="animate-fade-in pt-3 space-y-3">
                <div className={`p-4 rounded-xl border ${
                  selectedOption === task.correctOptionIndex
                    ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                    : 'border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                }`}>
                  <div className="font-bold text-sm mb-1 flex items-center gap-2">
                    {selectedOption === task.correctOptionIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Validation Passed
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        Methodological Flaw Detected
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">
                    {task.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* LEVEL 4: INDEPENDENT WORK (Autonomous Mastery)              */}
        {/* ============================================================ */}
        {autonomyLevel === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white">Hands-Off Mode: </span>
              Assistance is completely faded. Formulate your solution independently. No scaffolding or answers will be shown unless you explicitly summon emergency guidance.
            </div>

            <div className="space-y-2.5">
              {task.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                    selectedOption === idx
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-slate-900 dark:text-white font-medium ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 leading-relaxed">
                    {opt}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowIndependentHelp(prev => !prev)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
              >
                {showIndependentHelp ? 'Hide Emergency Guidance' : 'Request Emergency Help'}
              </button>

              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Submit Independent Decision
              </button>
            </div>

            {showIndependentHelp && (
              <div className="animate-fade-in pt-3">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200">
                  <div className="font-bold mb-1">Emergency Guiding Hint:</div>
                  {task.hints[0]}
                </div>
              </div>
            )}

            {hasCheckedAnswer && (
              <div className="animate-fade-in pt-3">
                <ReasoningPanel
                  title="Independent Submission Result"
                  rationale={task.explanation}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
