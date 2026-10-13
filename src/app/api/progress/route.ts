import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

// POST /api/progress
// Body: { lessonId: string, completed: boolean, taskId?: string }
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { lessonId, completed, taskId } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    // 1. Upsert Lesson Progress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: Boolean(completed),
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        completed: Boolean(completed),
      },
    });

    // 2. If a roadmap task ID is linked, sync Task Progress as well
    let taskProgress = null;
    if (taskId) {
      taskProgress = await prisma.taskProgress.upsert({
        where: {
          userId_taskId: {
            userId: user.id,
            taskId,
          },
        },
        update: {
          status: completed ? 'done' : 'in-progress',
          completedAt: completed ? new Date() : null,
        },
        create: {
          userId: user.id,
          taskId,
          status: completed ? 'done' : 'in-progress',
          completedAt: completed ? new Date() : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      lessonProgress,
      taskProgress,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to record progress' }, { status: 500 });
  }
}
