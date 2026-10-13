'use client';

import React from 'react';
import { X, CheckCircle, Layers, BookOpen } from 'lucide-react';
import { RoadmapTopic, RoadmapSection } from '../types/roadmap.types';
import { Button } from '@/features/shared/components/Button';

interface TopicDrawerProps {
  topic: RoadmapTopic | null;
  section: RoadmapSection | null;
  isCompleted: boolean;
  onToggleComplete: (topicId: string) => void;
  onClose: () => void;
}

export function TopicDrawer({
  topic,
  section,
  isCompleted,
  onToggleComplete,
  onClose,
}: TopicDrawerProps) {
  if (!topic || !section) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-[#0b0e17] border-l border-white/[0.1] shadow-2xl flex flex-col h-full z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/[0.08] bg-[#080a10] flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap font-mono text-[11px]">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                [{section.title.split('.')[0] || 'MILESTONE'}]
              </span>
              <span className="text-slate-400">•</span>
              <span className="uppercase text-slate-300 font-semibold">{topic.level}</span>
              {section.isPro ? (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                  PRO MILESTONE
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  🟢 FREE TRACK
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {topic.name}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">{topic.desc}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition -mr-2"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card 1: In Plain English (Mental Model) */}
          <div className="bg-[#101320] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <span>💡</span> In Plain English (Core Mental Model)
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {topic.desc} In production environments, understanding the trade-offs of {topic.name} allows engineers to avoid architectural debt, minimize data corruption, and ensure client uptime.
            </p>
          </div>

          {/* Card 2: Core Subtopics / Concepts */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Key Concepts to Master ({topic.subtopics.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topic.subtopics.map((sub, idx) => (
                <div
                  key={idx}
                  className="bg-[#101320] border border-white/[0.06] rounded-lg p-2.5 text-xs text-slate-300 font-mono flex items-center gap-2 hover:border-amber-500/30 transition"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="truncate">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Free Official Reference Links */}
          {topic.resources.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Curated Reading & Official References
              </h3>
              <div className="space-y-2">
                {topic.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-[#101320] border border-white/[0.08] hover:border-amber-500/40 hover:bg-[#141828] text-xs text-slate-200 font-mono transition group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-amber-400">↗</span>
                      <span>{res.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-400">
                      External Docs
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
            onClick={() => onToggleComplete(topic.id)}
            className={`text-xs font-mono font-bold ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            {isCompleted ? 'Mastered (Reset)' : 'Mark Topic Mastered'}
          </Button>
        </div>
      </div>
    </div>
  );
}
