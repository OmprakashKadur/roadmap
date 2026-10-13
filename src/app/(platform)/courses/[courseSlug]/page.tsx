import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, BookOpen, Lock, PlayCircle, ArrowLeft } from 'lucide-react';
import { getCourseBySlug } from '@/features/courses/data/coursesData';
import { Button } from '@/features/shared/components/Button';
import { RazorpayCheckoutButton } from '@/features/payment/components/RazorpayCheckoutButton';

interface CourseDetailPageProps {
  params: Promise<{ courseSlug: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Banner */}
      <div className="border-b border-white/[0.08] bg-[#0c0e17] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Courses
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
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
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> {course.estimatedHours}h total
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> {totalLessons} lessons
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
            {course.description}
          </p>

          {/* CTA Box */}
          <div className="pt-4 flex items-center gap-4 flex-wrap">
            {firstLesson && (
              <Link href={`/courses/${course.slug}/learn/${firstLesson.slug}`}>
                <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono gap-2 shadow-lg shadow-amber-500/20">
                  <PlayCircle className="w-4 h-4" />
                  {course.tier === 'FREE' ? 'Start Free Course' : 'Start Lesson 1 (Free Preview)'}
                </Button>
              </Link>
            )}

            {course.tier !== 'FREE' && (
              <RazorpayCheckoutButton
                courseId={course.id}
                courseTitle={course.title}
                amountInInr={course.priceInInr}
              />
            )}
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] font-mono">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">[ SYLLABUS ]</span> Course Curriculum & Lessons
          </h2>
          <span className="text-xs text-slate-400">
            {course.modules.length} Modules • {totalLessons} Lessons
          </span>
        </div>

        <div className="space-y-4">
          {course.modules.map((module) => (
            <div
              key={module.id}
              className="bg-[#0b0d14] border border-white/[0.08] rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-4 bg-[#0e111a] border-b border-white/[0.06] flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-white tracking-wide">
                  {module.title}
                </span>
                <span className="text-[11px] text-slate-400">
                  {module.lessons.length} Lessons
                </span>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${course.slug}/learn/${lesson.slug}`}
                    className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-white/[0.04] text-slate-400 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition">
                        {lesson.isFree ? (
                          <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-slate-200 group-hover:text-white transition">
                          {lesson.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono mt-0.5">
                          <span>{Math.round(lesson.durationSeconds / 60)} mins</span>
                          {lesson.taskId && (
                            <>
                              <span>•</span>
                              <span className="text-cyan-400">Includes Lab Workshop</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      {lesson.isFree ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          Free Preview
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Pro
                        </span>
                      )}
                      <span className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition text-xs">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
