import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { BookOpen, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/features/shared/components/Button';
import { Badge } from '@/features/shared/components/Badge';
import { COURSES } from '@/features/courses/data/coursesData';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's completed tasks count from Supabase Postgres
  const completedTasksCount = await prisma.taskProgress.count({
    where: { userId: user.id },
  });

  // Fetch enrolled courses
  const enrollments = await prisma.userCourseAccess.findMany({
    where: { userId: user.id },
    include: { course: true },
  });

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* User Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              Learner Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as <code className="text-slate-300">{user.email}</code>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="text-center">
              <span className="text-2xl font-black text-cyan-400 block">{completedTasksCount}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Tasks Shipped</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center">
              <span className="text-2xl font-black text-emerald-400 block">{enrollments.length}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Pro Courses</span>
            </div>
          </div>
        </div>

        {/* Quick Jump Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Roadmap */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 hover:border-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Interactive Career Roadmap</h3>
                <p className="text-xs text-slate-400">21 Sections • 64+ Hands-on Practical Tasks</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track your progress across systems programming, data pipelines, cloud DevOps, and enterprise consulting.
            </p>
            <Link href="/roadmap" className="inline-block">
              <Button variant="primary" size="sm" className="text-xs">
                Jump to Roadmap ↗
              </Button>
            </Link>
          </div>

          {/* Browse Courses */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 hover:border-slate-700 transition">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Course Video Catalog</h3>
                <p className="text-xs text-slate-400">Deep-dive walkthroughs with interactive code</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore free introductory video modules and unlocked pro architectures with verified code.
            </p>
            <Link href="/courses" className="inline-block">
              <Button variant="secondary" size="sm" className="text-xs">
                Browse Courses ↗
              </Button>
            </Link>
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Available Courses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              return (
                <div key={course.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={course.tier === 'FREE' ? 'free' : course.tier === 'PAID' ? 'paid' : 'hybrid'}>
                      {course.tier === 'FREE' ? 'Free' : course.tier === 'HYBRID' ? 'Hybrid' : 'Pro'}
                    </Badge>
                    {isEnrolled && (
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Enrolled
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-500">{course.estimatedHours}h total</span>
                    <Link href={`/courses/${course.slug}`} className="text-indigo-400 hover:text-indigo-300 font-semibold">
                      View Syllabus ↗
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
