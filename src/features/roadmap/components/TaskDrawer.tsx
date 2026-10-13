'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Clock, Copy, Check, ChevronDown, ChevronUp, Terminal, Lock, Sparkles } from 'lucide-react';
import { RoadmapTask, RoadmapSection } from '../types/roadmap.types';
import { getTaskGuide } from '../data/roadmapData';
import { Button } from '@/features/shared/components/Button';
import { useAuthModal } from '@/features/auth/hooks/useAuthModal';

interface TaskDrawerProps {
  task: RoadmapTask | null;
  section: RoadmapSection | null;
  isCompleted: boolean;
  onToggleComplete: (taskId: string) => void;
  onClose: () => void;
}

export function TaskDrawer({
  task,
  section,
  isCompleted,
  onToggleComplete,
  onClose,
}: TaskDrawerProps) {
  const { openLogin } = useAuthModal();
  const [copiedStarter, setCopiedStarter] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!task || !section) return null;

  const isProTask = task.isPro || section.isPro;
  const guide = getTaskGuide(task, section);

  const handleCopy = (text: string, isStarter: boolean) => {
    navigator.clipboard.writeText(text);
    if (isStarter) {
      setCopiedStarter(true);
      setTimeout(() => setCopiedStarter(false), 2000);
    } else {
      setCopiedSolution(true);
      setTimeout(() => setCopiedSolution(false), 2000);
    }
  };

  const toggleChecklist = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-2xl bg-[#0b0e17] border-l border-white/[0.1] shadow-2xl flex flex-col h-full z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#080a10] flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                [{section.title.split('.')[0] || 'MILESTONE'}]
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-semibold">{task.id}</span>
              {isProTask ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                  <Lock className="w-2.5 h-2.5" /> PRO ARCHITECTURE LAB
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  🟢 FREE LAB
                </span>
              )}
              <span className="flex items-center gap-1 text-slate-400 ml-auto">
                <Clock className="w-3 h-3 text-amber-400" />
                {task.est}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {task.title}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">{task.desc}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition -mr-2"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card 1: Scenario & Objective */}
          <div className="bg-[#101320] border border-cyan-500/25 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <span>🎯</span> Client Scenario & Objective
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{guide.scenario}</p>
          </div>

          {/* Card 2: Concept Primer */}
          <div className="bg-[#101320] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <span>💡</span> Concept Primer & Mental Model
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1.5 whitespace-pre-line font-sans">
              {guide.conceptPrimer}
            </div>
          </div>

          {/* Card 3: Step-by-Step Instructions */}
          {guide.steps?.length > 0 && (
            <div className="bg-[#101320] border border-white/[0.08] rounded-xl p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Execution Milestones
              </div>
              <ol className="space-y-2">
                {guide.steps.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 font-sans leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Card 4: Starter Scaffold Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Starter Code Scaffold
              </span>
              <button
                onClick={() => handleCopy(guide.starterSnippet, true)}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition"
              >
                {copiedStarter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedStarter ? 'Copied' : 'Copy Code'}
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#040508]">
              <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                <code>{guide.starterSnippet}</code>
              </pre>
            </div>
          </div>

          {/* Card 5: Complete Working Solution (Free vs Pro Gated) */}
          <div className="border border-white/[0.1] rounded-xl overflow-hidden bg-[#07090f]">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full p-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {isProTask ? '🔒 Complete Pro Solution Code & Unit Tests' : '✅ Complete Verified Solution Code'}
                </span>
                {isProTask && (
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    PRO ONLY
                  </span>
                )}
              </div>
              {showSolution ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showSolution && (
              <div className="p-4 border-t border-white/[0.08] space-y-4">
                {isProTask ? (
                  <div className="bg-[#101422] border border-amber-500/30 rounded-xl p-5 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-mono">
                        Enterprise Solution Locked (Pro Milestone)
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        This full production implementation includes edge-case handling, multi-AZ recovery logic, and client test harness.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => openLogin()}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1" /> Unlock with Pro (₹1,499)
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Production Implementation</span>
                      <button
                        onClick={() => handleCopy(guide.solutionSnippet, false)}
                        className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition"
                      >
                        {copiedSolution ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSolution ? 'Copied' : 'Copy Solution'}
                      </button>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-white/[0.08] bg-[#040508]">
                      <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                        <code>{guide.solutionSnippet}</code>
                      </pre>
                    </div>
                    {guide.solutionExplanation && (
                      <p className="text-xs text-slate-400 italic font-sans">{guide.solutionExplanation}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Card 6: Expected Console Output */}
          {guide.expectedOutput && (
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Expected Terminal Output
              </span>
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#020306]">
                <pre className="p-4 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
                  <code>{guide.expectedOutput}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Card 7: Verification Checklist */}
          {guide.checklist?.length > 0 && (
            <div className="bg-[#101320] border border-white/[0.08] rounded-xl p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Verification Checklist
              </div>
              <div className="space-y-2">
                {guide.checklist.map((item, idx) => (
                  <label
                    key={idx}
                    onClick={() => toggleChecklist(idx)}
                    className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer select-none leading-relaxed font-sans"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[idx]}
                      readOnly
                      className="mt-0.5 rounded border-white/20 bg-slate-900 text-amber-500 focus:ring-0"
                    />
                    <span className={checkedItems[idx] ? 'line-through text-slate-500' : ''}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-white/[0.08] bg-[#080a10] flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            Close
          </Button>

          <Button
            size="sm"
            onClick={() => onToggleComplete(task.id)}
            className={`text-xs font-mono font-bold ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            {isCompleted ? 'Completed (Click to Reset)' : 'Mark Lab Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
