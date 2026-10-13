import Link from 'next/link';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { Course } from '../types/course.types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

export function CourseCard({ course, isEnrolled }: CourseCardProps) {
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="bg-[#0e111a] border border-white/[0.08] hover:border-amber-500/40 rounded-xl overflow-hidden shadow-xl transition flex flex-col group">
      {/* Top Banner */}
      <div className="p-6 bg-[#0a0d14] border-b border-white/[0.06] relative space-y-3">
        <div className="flex items-center justify-between gap-2 font-mono text-xs">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              course.tier === 'FREE'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : course.tier === 'HYBRID'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}
          >
            {course.tier === 'FREE'
              ? '🟢 100% Free'
              : course.tier === 'HYBRID'
              ? '⚡ Hybrid (Preview Free)'
              : '⭐ Pro Course'}
          </span>

          <span className="font-bold text-slate-300">
            {course.tier === 'FREE' ? 'Free' : `₹${course.priceInInr}`}
          </span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition leading-snug font-mono">
          {course.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="p-4 bg-[#090b10] mt-auto flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/[0.04]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {course.estimatedHours}h
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            {totalLessons} lessons
          </span>
        </div>

        <Link
          href={`/courses/${course.slug}`}
          className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition group-hover:translate-x-0.5"
        >
          {isEnrolled ? 'Continue' : 'View Syllabus'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
