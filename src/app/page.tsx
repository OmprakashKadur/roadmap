import Link from 'next/link';
import { Compass, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/features/shared/components/Button';
import { COURSES } from '@/features/courses/data/coursesData';
import { CourseCard } from '@/features/courses/components/CourseCard';
import { ALL_ROADMAPS } from '@/features/roadmap/data/roadmapData';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 border-b border-white/[0.08] bg-[#0c0e17]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ROADMAP.SH + W3SCHOOLS STYLE ENGINEERING BLUEPRINT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-mono">
            MASTER <span className="text-amber-400">FORWARD DEPLOYED</span> ENGINEERING
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From algorithmic foundations to distributed data pipelines, cloud VPCs, and real-world client engagements. Explore interactive skill trees with self-contained runnable solutions.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-xs">
            <Link href="/roadmap">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2 shadow-xl shadow-amber-500/20 w-full sm:w-auto">
                <Compass className="w-4 h-4" />
                Explore Skill Trees (Free + Pro)
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/courses">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto font-mono text-slate-300 hover:text-white border-white/[0.1]">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Browse Interactive Courses
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 21 Core Milestones
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 64+ Guided Client Labs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Free + Pro Access
            </span>
          </div>
        </div>
      </section>

      {/* Roadmaps Directory Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4 font-mono">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">[ CURATED ROADMAPS ]</span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">Available Engineering Tracks</h2>
          </div>
          <Link href="/roadmap" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
            Open Interactive Roadmap ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_ROADMAPS.map((rm) => (
            <Link
              key={rm.id}
              href={`/roadmap`}
              className="bg-[#0e111a] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-5 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{rm.icon}</span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    {rm.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition font-mono">
                  {rm.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {rm.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{rm.totalMilestones} Milestones</span>
                <span className="text-amber-400 font-bold group-hover:translate-x-1 transition flex items-center gap-0.5">
                  Start ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-[#0c0e17] border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4 font-mono">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">[ MULTI-MODAL COURSES ]</span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">Deep-Dive Video & Workshop Courses</h2>
            </div>
            <Link href="/courses" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
              View All Courses ↗
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
