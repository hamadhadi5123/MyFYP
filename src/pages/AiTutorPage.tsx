import React, { useState, useRef, useEffect } from 'react';
import { useDataMind } from '../context/DataMindContext';
import { 
  Send, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Bot, 
  User, 
  Database, 
  ArrowRight,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface AiTutorPageProps {
  onNavigate: (page: string) => void;
}

export const AiTutorPage: React.FC<AiTutorPageProps> = ({ onNavigate }) => {
  const { 
    currentDataset, 
    chatMessages, 
    isTutorTyping, 
    sendChatMessage, 
    clearChat, 
    resetChat,
    autonomyLevel 
  } = useDataMind();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = [
    'Explain my dataset.',
    'How should I handle missing values?',
    'Which chart should I use?',
    'What does correlation mean?',
    'Why should I check for duplicate rows?',
    'Explain this analysis step by step.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTutorTyping]);

  const handleSend = () => {
    if (!inputPrompt.trim() || isTutorTyping) return;
    sendChatMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-10">
      {/* Top Banner with Demo Mode & Dataset Context */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                AI Data Tutor
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/20">
                Capability-Preserving Co-Pilot
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded on <strong className="text-slate-700 dark:text-slate-300">{currentDataset?.name}</strong> · Autonomy Level {autonomyLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset to default welcome message"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear all messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Suggested:
        </span>
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => sendChatMessage(prompt)}
            className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700/80 transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main Conversation Window */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bot className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Conversation Cleared
              </h3>
              <p className="text-xs max-w-sm mt-1 text-slate-400">
                Ask a data analysis question above or click one of the suggested prompts to start learning.
              </p>
            </div>
          ) : (
            chatMessages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-2xl space-y-2`}>
                    <div
                      className={`p-4 rounded-2xl leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Pedagogical Reasoning Snippet */}
                    {!isUser && msg.reasoningSnippet && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pl-2 font-mono">
                        <Lightbulb className="w-3 h-3 text-emerald-500" />
                        <span>{msg.reasoningSnippet}</span>
                      </div>
                    )}

                    {/* Suggested follow-up prompt chips */}
                    {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 pl-1">
                        {msg.suggestedFollowUps.map(fu => (
                          <button
                            key={fu}
                            onClick={() => sendChatMessage(fu)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
                          >
                            ↳ {fu}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTutorTyping && (
            <div className="flex gap-3 text-xs items-center animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
                <span className="text-[11px] text-slate-400 font-mono ml-1">Formulating educational reasoning...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a data analysis question (e.g. 'How should I handle missing values?')..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTutorTyping}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!inputPrompt.trim() || isTutorTyping}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Press <strong>Enter</strong> to send. Responses grounded in your loaded dataset.</span>
            <span>Frontend Demo Mode · No API Key Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};
