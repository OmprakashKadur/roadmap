'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

export type ViewMode = 'all' | 'topics' | 'tasks';
export type TierFilter = 'all' | 'free' | 'pro';
export type LevelFilter = 'all' | 'beginner' | 'essential' | 'advanced';

interface RoadmapFilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  tierFilter: TierFilter;
  onTierFilterChange: (tier: TierFilter) => void;
  levelFilter: LevelFilter;
  onLevelFilterChange: (level: LevelFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalVisibleCount: number;
}

export function RoadmapFilterBar({
  viewMode,
  onViewModeChange,
  tierFilter,
  onTierFilterChange,
  levelFilter,
  onLevelFilterChange,
  searchQuery,
  onSearchChange,
  totalVisibleCount,
}: RoadmapFilterBarProps) {
  return (
    <div className="bg-[#0b0d14]/90 border border-white/[0.08] rounded-xl p-4 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* View Mode Segmented Control */}
        <div className="flex items-center bg-[#07090e] p-1 rounded-lg border border-white/[0.06] text-xs font-mono">
          <button
            onClick={() => onViewModeChange('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              viewMode === 'all'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Milestones
          </button>
          <button
            onClick={() => onViewModeChange('topics')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              viewMode === 'topics'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Concepts Only
          </button>
          <button
            onClick={() => onViewModeChange('tasks')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              viewMode === 'tasks'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛠️ Labs & Solutions
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 95+ topics, algorithms, ETL, Kubernetes..."
            className="w-full bg-[#07090e] border border-white/[0.08] rounded-lg pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.05] text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tier Filter */}
          <div className="flex items-center gap-1 bg-[#07090e] p-0.5 rounded-md border border-white/[0.06] text-[11px]">
            <button
              onClick={() => onTierFilterChange('all')}
              className={`px-2.5 py-1 rounded transition ${
                tierFilter === 'all'
                  ? 'bg-white/[0.1] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Access
            </button>
            <button
              onClick={() => onTierFilterChange('free')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                tierFilter === 'free'
                  ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              🟢 Free Only
            </button>
            <button
              onClick={() => onTierFilterChange('pro')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                tierFilter === 'pro'
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              ⭐ Pro Only
            </button>
          </div>

          <div className="h-4 w-px bg-white/[0.08]" />

          {/* Level Filter */}
          <div className="flex items-center gap-1 text-[11px]">
            {(['all', 'beginner', 'essential', 'advanced'] as LevelFilter[]).map((level) => (
              <button
                key={level}
                onClick={() => onLevelFilterChange(level)}
                className={`px-2.5 py-1 rounded-md border transition capitalize ${
                  levelFilter === level
                    ? 'bg-white/[0.1] border-white/[0.2] text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Showing <span className="font-bold text-amber-400">{totalVisibleCount}</span> matching items
        </div>
      </div>
    </div>
  );
}
