import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlayCircle, Lock } from 'lucide-react';
import { getLessonBySlugs } from '@/features/courses/data/coursesData';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { VideoPlayer } from '@/features/player/components/VideoPlayer';
import { LessonTabs } from '@/features/player/components/LessonTabs';
import { PaywallBanner } from '@/features/payment/components/PaywallBanner';

interface LessonPlayerPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default async function LessonPlayerPage({ params }: LessonPlayerPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const match = getLessonBySlugs(courseSlug, lessonSlug);

  if (!match) {
    notFound();
  }

  const { course, module: currentModule, lesson } = match;

  // 1. Verify user session and entitlement in Supabase Postgres
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  if (user) {
    const access = await prisma.userCourseAccess.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });
    if (access) isEnrolled = true;
  }

  // A lesson is unlocked if course is 100% free, lesson is marked free, or user is enrolled
  const isUnlocked = course.tier === 'FREE' || lesson.isFree || isEnrolled;

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0c0e17] px-4 flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" /> Syllabus
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-xs font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lesson.taskId && (
            <Link
              href="/roadmap"
              className="text-[11px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40 hover:border-cyan-600 transition"
            >
              Linked Task: {lesson.taskId}
            </Link>
          )}
        </div>
      </header>

      {/* Main Workspace (Sidebar + Player Content) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Course Modules & Lessons */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0a0d14] flex flex-col shrink-0 overflow-y-auto max-h-72 lg:max-h-none font-mono">
          <div className="p-4 border-b border-white/[0.06] bg-[#0c0e17]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Course Outline
            </h3>
          </div>

          <div className="p-3 space-y-4">
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 px-2 block truncate">
                  {mod.title}
                </span>

                <div className="space-y-0.5">
                  {mod.lessons.map((les) => {
                    const isCurrent = les.slug === lesson.slug;
                    const canAccess = course.tier === 'FREE' || les.isFree || isEnrolled;
                    return (
                      <Link
                        key={les.id}
                        href={`/courses/${course.slug}/learn/${les.slug}`}
                        className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition border ${
                          isCurrent
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 font-bold'
                            : 'border-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {canAccess ? (
                            <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-amber-400' : 'text-slate-500'}`} />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>

                        {les.isFree && course.tier !== 'FREE' && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded shrink-0 ml-1">
                            Free
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center / Right Player Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
          {/* Lesson Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                {currentModule.title}
              </span>
              <span className="text-slate-500">•</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isUnlocked
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {isUnlocked ? '🟢 Unlocked' : '🔒 Pro Lesson'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
              {lesson.title}
            </h1>
          </div>

          {/* Media / Video Tier */}
          <div>
            {isUnlocked ? (
              lesson.videoUrl ? (
                <VideoPlayer
                  videoUrl={lesson.videoUrl}
                  lessonTitle={lesson.title}
                  courseTitle={course.title}
                  durationSeconds={lesson.durationSeconds}
                />
              ) : null
            ) : (
              <PaywallBanner
                courseId={course.id}
                courseTitle={course.title}
                priceInInr={course.priceInInr}
                lessonTitle={lesson.title}
              />
            )}
          </div>

          {/* Multi-Modal Content Tabs (Markdown text, code, notes) */}
          <LessonTabs lesson={lesson} isUnlocked={isUnlocked} />
        </main>
      </div>
    </div>
  );
}
