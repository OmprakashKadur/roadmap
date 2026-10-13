'use client';

import React from 'react';
import { CheckCircle2, Clock, Terminal, Lock, BookOpen } from 'lucide-react';
import { RoadmapSection, RoadmapTopic, RoadmapTask } from '../types/roadmap.types';

interface RoadmapSectionCardProps {
  section: RoadmapSection;
  filteredTopics: RoadmapTopic[];
  filteredTasks: RoadmapTask[];
  completedTopics: Set<string>;
  completedTasks: Set<string>;
  onSelectTopic: (topic: RoadmapTopic, section: RoadmapSection) => void;
  onSelectTask: (task: RoadmapTask, section: RoadmapSection) => void;
  onToggleTopic: (topicId: string) => void;
  onToggleTask: (taskId: string) => void;
  viewMode: 'all' | 'topics' | 'tasks';
}

export function RoadmapSectionCard({
  section,
  filteredTopics,
  filteredTasks,
  completedTopics,
  completedTasks,
  onSelectTopic,
  onSelectTask,
  onToggleTopic,
  onToggleTask,
  viewMode,
}: RoadmapSectionCardProps) {
  const showTopics = viewMode !== 'tasks' && filteredTopics.length > 0;
  const showTasks = viewMode !== 'topics' && filteredTasks.length > 0;

  if (!showTopics && !showTasks) return null;

  // Progress metrics
  const doneTopicsCount = section.topics.filter((t) => completedTopics.has(t.id)).length;
  const doneTasksCount = section.tasks.filter((t) => completedTasks.has(t.id)).length;
  const totalSectionItems = section.topics.length + section.tasks.length;
  const completedSectionItems = doneTopicsCount + doneTasksCount;
  const percent = totalSectionItems > 0 ? Math.round((completedSectionItems / totalSectionItems) * 100) : 0;
  const isSectionComplete = percent === 100;

  const milestoneNumber = section.title.match(/^\d+/)?.[0] || '01';

  return (
    <div
      className={`relative rounded-xl border p-6 transition-all duration-300 ${
        section.isPro
          ? 'bg-[#0c0e17] border-amber-500/25 hover:border-amber-500/50 shadow-lg shadow-amber-950/20'
          : 'bg-[#0b0d14] border-white/[0.08] hover:border-white/[0.18]'
      }`}
    >
      {/* Node circuit connection indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Milestone Badge Icon */}
          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 border ${
              section.isPro
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-white/[0.04] border-white/[0.1] text-emerald-400'
            }`}
          >
            {section.icon}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-[11px] font-bold tracking-wider text-slate-400">
                [ MILESTONE {milestoneNumber.padStart(2, '0')} ]
              </span>
              {section.isPro ? (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                  <Lock className="w-2.5 h-2.5" /> PRO ARCHITECTURE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  🟢 FREE TRACK
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {section.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">{section.subtitle}</p>
          </div>
        </div>

        {/* Section Completion Meter */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400 text-[11px]">Progress:</span>
            <span className={`font-bold ${isSectionComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {percent}%
            </span>
          </div>
          <div className="w-28 h-2 bg-black/60 rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className={`h-full transition-all duration-500 ${
                isSectionComplete ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            {completedSectionItems}/{totalSectionItems} completed
          </span>
        </div>
      </div>

      <div className="space-y-6 pt-5">
        {/* TOPICS / CONCEPTS SECTION */}
        {showTopics && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Knowledge & Core Concepts ({filteredTopics.length})
              </span>
              <span>Click card for mental model & deep dive</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTopics.map((topic) => {
                const isDone = completedTopics.has(topic.id);
                return (
                  <div
                    key={topic.id}
                    onClick={() => onSelectTopic(topic, section)}
                    className={`group relative rounded-lg border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isDone
                        ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-[#111420]/80 border-white/[0.07] hover:border-white/[0.2] hover:bg-[#151a28]'
                    }`}
                  >
                    {/* Status Edge */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-lg transition ${
                        isDone ? 'bg-emerald-400' : 'bg-slate-700 group-hover:bg-amber-400'
                      }`}
                    />

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2 pl-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition leading-snug line-clamp-1">
                          {topic.name}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTopic(topic.id);
                          }}
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition ${
                            isDone
                              ? 'bg-emerald-500 text-black shadow-sm'
                              : 'bg-white/[0.05] border border-white/[0.1] text-transparent hover:border-emerald-400 hover:text-emerald-400'
                          }`}
                          title="Toggle Status"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed pl-1">
                        {topic.desc}
                      </p>
                    </div>

                    {/* Subtopics pill list */}
                    <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono pl-1">
                      <span className="text-slate-400 uppercase tracking-wider">
                        {topic.level}
                      </span>
                      <span className="text-cyan-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
                        Inspect Guide ↗
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PRACTICAL TASKS & LABS SECTION */}
        {showTasks && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                Hands-on Workshop Labs & Solutions ({filteredTasks.length})
              </span>
              <span className="text-amber-400/80 font-bold">Self-Contained • Code & Tests</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTasks.map((task) => {
                const isDone = completedTasks.has(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task, section)}
                    className={`group relative rounded-lg border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      isDone
                        ? 'bg-emerald-950/15 border-emerald-500/30 hover:border-emerald-500/50'
                        : section.isPro
                        ? 'bg-[#131622] border-amber-500/20 hover:border-amber-500/40'
                        : 'bg-[#111420]/80 border-white/[0.07] hover:border-white/[0.2] hover:bg-[#151a28]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            [{task.id}]
                          </span>
                          {section.isPro && (
                            <span className="font-mono text-[9px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                              PRO
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(task.id);
                          }}
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition ${
                            isDone
                              ? 'bg-emerald-500 text-black shadow-sm'
                              : 'bg-white/[0.05] border border-white/[0.1] text-transparent hover:border-emerald-400 hover:text-emerald-400'
                          }`}
                          title="Toggle Task Done"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-1 group-hover:text-amber-400 transition ${
                          isDone ? 'text-slate-400 line-through' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {task.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {task.est}
                      </span>
                      <span className="text-amber-400 group-hover:translate-x-0.5 transition flex items-center gap-1 font-semibold">
                        Launch Lab ↗
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
