'use client';

import React, { useState, useMemo } from 'react';
import { ALL_ROADMAPS } from '@/features/roadmap/data/roadmapData';
import { RoadmapTopic, RoadmapTask, RoadmapSection } from '@/features/roadmap/types/roadmap.types';
import { useRoadmapProgress } from '@/features/roadmap/hooks/useRoadmapProgress';
import { RoadmapFilterBar, ViewMode, LevelFilter, TierFilter } from '@/features/roadmap/components/RoadmapFilterBar';
import { RoadmapSectionCard } from '@/features/roadmap/components/RoadmapSectionCard';
import { TaskDrawer } from '@/features/roadmap/components/TaskDrawer';
import { TopicDrawer } from '@/features/roadmap/components/TopicDrawer';
import { Button } from '@/features/shared/components/Button';
import {
  BookOpen,
  Terminal,
  CheckCircle2,
  ListTree,
  FileCode2,
} from 'lucide-react';

export default function RoadmapPage() {
  const {
    completedTopics,
    completedTasks,
    toggleTopic,
    toggleTask,
    totalTasks,
    readinessPercent,
  } = useRoadmapProgress();

  // Selected Roadmap in Switcher (roadmap.sh style)
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('fde-flagship');

  // Presentation Mode: Flowchart Node Tree vs W3Schools Chapter Guide
  const [displayStyle, setDisplayStyle] = useState<'flowchart' | 'w3schools'>('flowchart');

  // Filters
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Drawers
  const [selectedTask, setSelectedTask] = useState<{ task: RoadmapTask; section: RoadmapSection } | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ topic: RoadmapTopic; section: RoadmapSection } | null>(null);

  // W3Schools mode active section selection
  const [activeW3SectionId, setActiveW3SectionId] = useState<string>('start');

  const currentRoadmap = useMemo(() => {
    return ALL_ROADMAPS.find((r) => r.id === selectedRoadmapId) || ALL_ROADMAPS[0];
  }, [selectedRoadmapId]);

  // Filter sections within active roadmap
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return currentRoadmap.sections
      .filter((sec) => {
        if (tierFilter === 'free' && sec.isPro) return false;
        if (tierFilter === 'pro' && !sec.isPro) return false;
        return true;
      })
      .map((sec) => {
        const matchingTopics = sec.topics.filter((t) => {
          const matchesLevel = levelFilter === 'all' || t.level === levelFilter;
          const matchesQuery =
            !q ||
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            t.subtopics.some((s) => s.toLowerCase().includes(q));
          return matchesLevel && matchesQuery;
        });

        const matchingTasks = sec.tasks.filter((t) => {
          const matchesLevel =
            levelFilter === 'all' ||
            (levelFilter === 'beginner' && t.level === 'beginner') ||
            (levelFilter === 'essential' && t.level === 'intermediate') ||
            (levelFilter === 'advanced' && t.level === 'advanced');
          const matchesQuery =
            !q ||
            t.title.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q);
          return matchesLevel && matchesQuery;
        });

        return {
          section: sec,
          topics: matchingTopics,
          tasks: matchingTasks,
        };
      });
  }, [currentRoadmap, tierFilter, levelFilter, searchQuery]);

  const totalVisibleItems = useMemo(() => {
    return filteredSections.reduce((acc, curr) => {
      let count = 0;
      if (viewMode !== 'tasks') count += curr.topics.length;
      if (viewMode !== 'topics') count += curr.tasks.length;
      return acc + count;
    }, 0);
  }, [filteredSections, viewMode]);

  const activeW3SectionData = useMemo(() => {
    return (
      currentRoadmap.sections.find((s) => s.id === activeW3SectionId) ||
      currentRoadmap.sections[0]
    );
  }, [currentRoadmap, activeW3SectionId]);

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Banner: Technical Blueprint Hero */}
      <section className="relative border-b border-white/[0.08] bg-[#0c0e17]/80 backdrop-blur-xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/25 font-mono text-[11px] text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>PALANTIR • SCALE AI • ANDURIL ENGINEERING SPECIFICATION</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                ENGINEERING <span className="text-amber-400">SKILL TREES</span> & LABS
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Interactive self-contained roadmap with full runnable solutions, client scenarios, terminal verifications, and guided courses.
              </p>
            </div>

            {/* Overall FDE Readiness Widget */}
            <div className="bg-[#111422] border border-white/[0.08] rounded-xl p-4 flex items-center gap-5 shadow-2xl shrink-0">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400 transition-all duration-700 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray="100, 100"
                    strokeDashoffset={100 - readinessPercent}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                  <span className="text-xs font-bold text-white">{readinessPercent}%</span>
                  <span className="text-[8px] text-slate-400 uppercase">Ready</span>
                </div>
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{completedTopics.size} Topics Mastered</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {completedTasks.size} / {totalTasks} Labs Completed
                </div>
                <div className="text-[10px] text-amber-400 font-semibold">
                  {readinessPercent >= 80 ? '🎖️ Production Ready' : '⚡ In Active Training'}
                </div>
              </div>
            </div>
          </div>

          {/* ROADMAP SELECTOR BAR (roadmap.sh style) */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {ALL_ROADMAPS.map((rm) => {
                const isSelected = rm.id === selectedRoadmapId;
                return (
                  <button
                    key={rm.id}
                    onClick={() => {
                      setSelectedRoadmapId(rm.id);
                      if (rm.sections[0]) setActiveW3SectionId(rm.sections[0].id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono transition whitespace-nowrap border ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm font-bold'
                        : 'bg-[#111420]/80 border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{rm.icon}</span>
                    <span>{rm.title.split('(')[0].trim()}</span>
                    {rm.tier === 'pro' && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                        PRO
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Layout Mode Toggle: roadmap.sh flowchart vs w3schools table */}
            <div className="flex items-center bg-[#07090e] p-1 rounded-lg border border-white/[0.08] text-xs font-mono shrink-0">
              <button
                onClick={() => setDisplayStyle('flowchart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
                  displayStyle === 'flowchart'
                    ? 'bg-white/[0.1] text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Visual Milestone Flowchart"
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>Tree View</span>
              </button>
              <button
                onClick={() => setDisplayStyle('w3schools')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
                  displayStyle === 'w3schools'
                    ? 'bg-white/[0.1] text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="W3Schools Chapter Syllabus"
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Chapter Guide</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Bar */}
        <RoadmapFilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          tierFilter={tierFilter}
          onTierFilterChange={setTierFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalVisibleCount={totalVisibleItems}
        />

        {/* VIEW 1: ROADMAP.SH INTERACTIVE FLOWCHART / MILESTONE TREE */}
        {displayStyle === 'flowchart' && (
          <div className="space-y-6">
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center rounded-xl border border-white/[0.08] bg-[#0c0e17] space-y-3">
                <p className="text-sm font-mono text-slate-400">
                  No topics or tasks match your filter criteria.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setLevelFilter('all');
                    setTierFilter('all');
                  }}
                  className="font-mono text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              filteredSections.map(({ section, topics, tasks }) => (
                <RoadmapSectionCard
                  key={section.id}
                  section={section}
                  filteredTopics={topics}
                  filteredTasks={tasks}
                  completedTopics={completedTopics}
                  completedTasks={completedTasks}
                  onSelectTopic={(topic, sec) => setSelectedTopic({ topic, section: sec })}
                  onSelectTask={(task, sec) => setSelectedTask({ task, section: sec })}
                  onToggleTopic={toggleTopic}
                  onToggleTask={toggleTask}
                  viewMode={viewMode}
                />
              ))
            )}
          </div>
        )}

        {/* VIEW 2: W3SCHOOLS-STYLE CHAPTER REFERENCE & SYLLABUS SPLIT */}
        {displayStyle === 'w3schools' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Chapters / Topics Index (Sidebar) */}
            <div className="lg:col-span-4 bg-[#0b0e17] border border-white/[0.08] rounded-xl p-4 space-y-3 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-white/[0.06] flex items-center justify-between">
                <span>📑 Syllabus Chapters</span>
                <span className="text-[10px] text-amber-400">
                  {currentRoadmap.sections.length} Chapters
                </span>
              </div>

              <div className="space-y-1">
                {currentRoadmap.sections.map((sec) => {
                  const isActive = sec.id === activeW3SectionId;
                  const secDoneCount = sec.topics.filter((t) => completedTopics.has(t.id)).length;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveW3SectionId(sec.id)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition flex items-center justify-between border ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold'
                          : 'border-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {sec.icon} {sec.title}
                      </span>
                      {sec.isPro ? (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded shrink-0">
                          PRO
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {secDoneCount}/{sec.topics.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Chapter Deep-Dive & Quick Drill */}
            <div className="lg:col-span-8 bg-[#0b0e17] border border-white/[0.08] rounded-xl p-6 space-y-6">
              <div className="pb-4 border-b border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeW3SectionData.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white font-mono">
                        {activeW3SectionData.title}
                      </h2>
                      {activeW3SectionData.isPro && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
                          PRO MILESTONE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{activeW3SectionData.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Topics Reference Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Chapter Concepts & Knowledge Checklist
                </h3>

                <div className="space-y-2">
                  {activeW3SectionData.topics.map((topic) => {
                    const isDone = completedTopics.has(topic.id);
                    return (
                      <div
                        key={topic.id}
                        className="bg-[#101320] border border-white/[0.06] rounded-lg p-3 flex items-start justify-between gap-3 hover:border-white/[0.15] transition"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono">{topic.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase bg-black/40 px-1.5 py-0.5 rounded">
                              {topic.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{topic.desc}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {topic.subtopics.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono text-slate-400 bg-white/[0.03] px-1.5 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedTopic({ topic, section: activeW3SectionData })}
                            className="text-[11px] font-mono"
                          >
                            Read Guide ↗
                          </Button>
                          <button
                            type="button"
                            onClick={() => toggleTopic(topic.id)}
                            className={`w-6 h-6 rounded flex items-center justify-center transition ${
                              isDone
                                ? 'bg-emerald-500 text-black'
                                : 'bg-white/[0.05] border border-white/[0.1] text-transparent hover:text-emerald-400 hover:border-emerald-400'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasks & Labs Drill Table */}
              <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" /> Interactive Hands-on Labs ({activeW3SectionData.tasks.length})
                </h3>

                <div className="space-y-2">
                  {activeW3SectionData.tasks.map((task) => {
                    const isDone = completedTasks.has(task.id);
                    return (
                      <div
                        key={task.id}
                        className={`bg-[#101320] border rounded-lg p-3 flex items-start justify-between gap-3 transition ${
                          isDone ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-white/[0.06] hover:border-amber-500/30'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white font-mono">{task.title}</span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {task.est}
                            </span>
                            {isDone && (
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                                ✓ Done
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{task.desc}</p>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => setSelectedTask({ task, section: activeW3SectionData })}
                          className="text-[11px] font-mono bg-amber-500 hover:bg-amber-400 text-black font-bold shrink-0"
                        >
                          Launch Lab ↗
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Drawers */}
      <TopicDrawer
        topic={selectedTopic?.topic || null}
        section={selectedTopic?.section || null}
        isCompleted={selectedTopic ? completedTopics.has(selectedTopic.topic.id) : false}
        onToggleComplete={toggleTopic}
        onClose={() => setSelectedTopic(null)}
      />

      <TaskDrawer
        task={selectedTask?.task || null}
        section={selectedTask?.section || null}
        isCompleted={selectedTask ? completedTasks.has(selectedTask.task.id) : false}
        onToggleComplete={toggleTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
