import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Resource } from '../types';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
} from 'lucide-react';

interface AIMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResource: (res: Resource) => void;
}

export const AIMatcherModal: React.FC<AIMatcherModalProps> = ({
  isOpen,
  onClose,
  onSelectResource,
}) => {
  const { resources } = useApp();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [modeLabel, setModeLabel] = useState<string>('');

  if (!isOpen) return null;

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/match-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          availableResources: resources,
        }),
      });
      const data = await res.json();
      setResults(data.matches || []);
      setAdvice(data.advice || null);
      setModeLabel(data.mode === 'gemini_ai' ? 'Powered by Gemini 3.8 Flash' : 'Rule-Based Smart Matching Engine');
    } catch (err) {
      console.warn('AI matching failed, fallback active', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'Need to record a cinematic documentary video for CodeHack finals',
    'Rapid 3D prototyping of carbon-fiber drone landing gear',
    'Testing high-frequency PWM switching waveforms on custom PCB',
    'Fine-tuning a local 7B parameter LLM on campus compute cluster',
    'Host a 15-person hardware sprint with whiteboards and displays',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/60 p-6 sm:p-8 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                AI Resource Matcher & Advisor
              </h3>
              <p className="text-xs text-slate-500">
                Describe what you want to build or achieve in plain language
              </p>
            </div>
          </div>

          <form onSubmit={handleMatch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., I need to 3D print a high-strength robot chassis before Thursday..."
                className="w-full text-xs sm:text-sm pl-4 pr-24 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 shadow-inner"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-400 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Thinking...' : 'Match'}</span>
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 items-center text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">Try asking:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuery(q)}
                  className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition"
                >
                  {q.slice(0, 32)}...
                </button>
              ))}
            </div>
          </form>

          {/* Mode tag */}
          {modeLabel && (
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{modeLabel}</span>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Top Matched Campus Resources
              </h4>

              <div className="space-y-3">
                {results.map((match: any, index: number) => {
                  const targetRes = resources.find((r) => r.id === match.resourceId);
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 hover:border-purple-300 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            {match.resourceName}
                            <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                              {match.confidenceScore}% Match
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {match.reason}
                          </p>
                        </div>
                      </div>

                      {match.suggestedSlot && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            Suggested Slot:
                          </span>{' '}
                          {match.suggestedSlot}
                        </div>
                      )}

                      {match.safetyTip && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                          <strong>Safety Prerequisite:</strong> {match.safetyTip}
                        </div>
                      )}

                      {targetRes && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectResource(targetRes);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <span>Open Resource & Book</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {advice && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs text-indigo-800 dark:text-indigo-200">
                  <strong>Preparation Advice:</strong> {advice}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
