'use client';

import React, { useState } from 'react';
import { BookOpen, Layers, Terminal, FileText, Copy, Check, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Lesson } from '@/features/courses/types/course.types';
import { Button } from '@/features/shared/components/Button';

interface LessonTabsProps {
  lesson: Lesson;
  isUnlocked: boolean;
}

export function LessonTabs({ lesson, isUnlocked }: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'diagram' | 'workshop' | 'notes'>('guide');
  const [copiedStarter, setCopiedStarter] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [noteContent, setNoteContent] = useState('');

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

  return (
    <div className="bg-[#0b0d14] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl">
      {/* Tab Buttons */}
      <div className="flex items-center gap-1.5 p-2.5 bg-[#080a10] border-b border-white/[0.08] overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition border ${
            activeTab === 'guide'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>📖 Concept Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('diagram')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition border ${
            activeTab === 'diagram'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>🖼️ Architecture Schematics</span>
        </button>

        <button
          onClick={() => setActiveTab('workshop')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition border ${
            activeTab === 'workshop'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>🛠️ Hands-on Workshop</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition border ${
            activeTab === 'notes'
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-sm'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>📝 Engineering Notes</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Tab 1: Concept Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-sm">
            <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-line">
              {lesson.markdownContent}
            </div>
          </div>
        )}

        {/* Tab 2: Architecture Diagrams */}
        {activeTab === 'diagram' && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              System Blueprint & Component Topology
            </h3>
            <div className="aspect-video w-full rounded-xl bg-[#040508] border border-white/[0.08] flex items-center justify-center p-6 text-center font-mono">
              <div className="space-y-2 text-slate-500">
                <Layers className="w-8 h-8 mx-auto text-amber-400 animate-pulse" />
                <p className="text-xs text-slate-300 font-bold">
                  {lesson.title} — Architectural Schematic
                </p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  Interactive zoomable vector topology showing request flow, data partitioning, and database persistence layers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Hands-on Workshop */}
        {activeTab === 'workshop' && (
          <div className="space-y-6">
            {/* Starter Code */}
            {lesson.starterCode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" /> Starter Code Template
                  </span>
                  <button
                    onClick={() => handleCopy(lesson.starterCode || '', true)}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition"
                  >
                    {copiedStarter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedStarter ? 'Copied' : 'Copy Starter'}
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#040508]">
                  <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    <code>{lesson.starterCode}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Solution (Gated if unpaid) */}
            {isUnlocked ? (
              lesson.solutionCode && (
                <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#07090f]">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="w-full p-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition text-left"
                  >
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ✅ Complete Working Solution Code
                    </span>
                    {showSolution ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {showSolution && (
                    <div className="p-4 border-t border-white/[0.06] space-y-2">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleCopy(lesson.solutionCode || '', false)}
                          className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition"
                        >
                          {copiedSolution ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedSolution ? 'Copied' : 'Copy Solution'}
                        </button>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#040508]">
                        <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                          <code>{lesson.solutionCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="p-5 border border-amber-500/30 rounded-xl bg-[#101422] text-center space-y-2 font-mono">
                <Lock className="w-5 h-5 text-amber-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Full Solution & Edge Cases Locked</h4>
                <p className="text-[11px] text-slate-400">
                  Upgrade to the Pro course to reveal the complete production solution and test suite.
                </p>
              </div>
            )}

            {lesson.expectedOutput && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Expected Console Output
                </span>
                <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#020306]">
                  <pre className="p-4 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
                    <code>{lesson.expectedOutput}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Private Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Personal Engineering Scratchpad
            </h3>
            <textarea
              rows={8}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Take personal markdown notes on this lesson..."
              className="w-full p-4 bg-[#07090e] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-between items-center text-xs font-mono text-slate-500">
              <span>Notes save automatically to your account.</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => alert('Note saved to account!')}
                className="font-mono text-xs border-white/[0.1]"
              >
                Save Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
