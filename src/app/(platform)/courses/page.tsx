'use client';

import React, { useState, useMemo } from 'react';
import { COURSES } from '@/features/courses/data/coursesData';
import { CourseCard } from '@/features/courses/components/CourseCard';
import { Sparkles, Search, X } from 'lucide-react';

export default function CoursesPage() {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = useMemo(() => {
    return COURSES.filter((c) => {
      const matchesTier = selectedTier === 'all' || c.tier === selectedTier;
      
      let matchesCategory = true;
      if (selectedCategory === 'frontend') {
        matchesCategory = ['html-fundamentals', 'modern-css', 'javascript-deep-dive', 'react-fundamentals'].includes(c.slug);
      } else if (selectedCategory === 'fullstack') {
        matchesCategory = ['nextjs-fullstack', 'react-fundamentals', 'javascript-deep-dive'].includes(c.slug);
      } else if (selectedCategory === 'backend') {
        matchesCategory = ['nodejs-backend-architecture', 'postgresql-prisma-mastery'].includes(c.slug);
      } else if (selectedCategory === 'data') {
        matchesCategory = ['enterprise-etl', 'postgresql-prisma-mastery'].includes(c.slug);
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);

      return matchesTier && matchesCategory && matchesSearch;
    });
  }, [selectedTier, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#0c0e17] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE MULTI-MODAL COURSES & EMBEDDED WORKSHOPS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            PRACTICAL <span className="text-amber-400">DEVELOPER</span> COURSES
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-sans">
            Curated video lectures, architecture diagrams, and runnable code challenges. Master HTML, CSS, JavaScript, React, Next.js, Node.js, PostgreSQL, and Enterprise ETL.
          </p>
        </div>
      </section>

      {/* Catalog & Filter Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-[#0b0d14] border border-white/[0.08] p-4 rounded-xl shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { id: 'all', label: 'All Domains' },
                { id: 'frontend', label: '🎨 Frontend (HTML/CSS/React)' },
                { id: 'fullstack', label: '⚡ Full-Stack & Next.js' },
                { id: 'backend', label: '🛠️ Backend & PostgreSQL' },
                { id: 'data', label: '📊 Data Pipelines & ETL' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition whitespace-nowrap border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold'
                      : 'border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full bg-[#07090e] border border-white/[0.08] rounded-lg pl-8 pr-8 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Tier Row */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Tiers' },
                { id: 'FREE', label: '🟢 100% Free' },
                { id: 'HYBRID', label: '⚡ Hybrid (Preview Free)' },
                { id: 'PAID', label: '⭐ Pro Only' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-2.5 py-1 rounded text-[11px] transition ${
                    selectedTier === tier.id
                      ? 'bg-white/[0.1] text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              Showing <span className="text-amber-400 font-bold">{filteredCourses.length}</span> courses
            </span>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </main>
    </div>
  );
}
