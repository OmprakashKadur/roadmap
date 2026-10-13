'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthModal } from '@/features/auth/hooks/useAuthModal';
import { createClient } from '@/lib/supabase/client';
import { ROADMAP_SECTIONS } from '../data/roadmapData';

export function useRoadmapProgress() {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();

  // Lazy initialization from localStorage for guests
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(() => {
    const base = new Set(['react-basics', 'react-hooks', 'js-basics', 'js-es6']);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fde_app_topics');
        if (saved) return new Set(JSON.parse(saved));
      } catch {
        // Fallback to base
      }
    }
    return base;
  });

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const base = new Set(['t-react-1']);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fde_app_tasks');
        if (saved) return new Set(JSON.parse(saved));
      } catch {
        // Fallback to base
      }
    }
    return base;
  });

  // Sync from Supabase when user authenticates
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const supabase = createClient();

    supabase
      .from('task_progress')
      .select('task_id, status')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!isMounted || !data || data.length === 0) return;
        const taskSet = new Set<string>();
        const topicSet = new Set<string>(['react-basics', 'react-hooks', 'js-basics', 'js-es6']);
        data.forEach((row) => {
          if (row.task_id.startsWith('topic:')) {
            topicSet.add(row.task_id.replace('topic:', ''));
          } else {
            taskSet.add(row.task_id);
          }
        });
        setCompletedTasks(taskSet);
        setCompletedTopics(topicSet);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleTopic = async (topicId: string) => {
    if (!user) {
      openLogin('login', 'Please sign in to save your roadmap progress and sync across devices.');
      return;
    }

    const next = new Set(completedTopics);
    const isAdding = !next.has(topicId);
    if (isAdding) {
      next.add(topicId);
    } else {
      next.delete(topicId);
    }
    setCompletedTopics(next);

    // Persist to Supabase
    const supabase = createClient();
    if (isAdding) {
      await supabase.from('task_progress').upsert({
        user_id: user.id,
        task_id: `topic:${topicId}`,
        status: 'done',
        completed_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from('task_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('task_id', `topic:${topicId}`);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!user) {
      openLogin('login', 'Please sign in to track hands-on tasks and sync progress.');
      return;
    }

    const next = new Set(completedTasks);
    const isAdding = !next.has(taskId);
    if (isAdding) {
      next.add(taskId);
    } else {
      next.delete(taskId);
    }
    setCompletedTasks(next);

    // Persist to Supabase
    const supabase = createClient();
    if (isAdding) {
      await supabase.from('task_progress').upsert({
        user_id: user.id,
        task_id: taskId,
        status: 'done',
        completed_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from('task_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('task_id', taskId);
    }
  };

  // Calculate readiness score
  let totalTopics = 0;
  let totalTasks = 0;
  ROADMAP_SECTIONS.forEach((sec) => {
    totalTopics += sec.topics.length;
    totalTasks += sec.tasks.length;
  });

  const totalItems = totalTopics + totalTasks;
  const completedCount = completedTopics.size + completedTasks.size;
  const readinessPercent = Math.round((completedCount / totalItems) * 100);

  return {
    completedTopics,
    completedTasks,
    toggleTopic,
    toggleTask,
    totalTopics,
    totalTasks,
    readinessPercent,
    isTopicDone: (id: string) => completedTopics.has(id),
    isTaskDone: (id: string) => completedTasks.has(id),
  };
}
