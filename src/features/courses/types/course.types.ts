export type CourseTier = 'FREE' | 'PAID' | 'HYBRID';

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
  isFree: boolean;
  videoUrl?: string | null;
  durationSeconds: number;
  markdownContent: string;
  diagramUrl?: string | null;
  starterCode?: string | null;
  solutionCode?: string | null;
  expectedOutput?: string | null;
  taskId?: string | null; // e.g. "t-de-1"
}

export interface Module {
  id: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
  tier: CourseTier;
  priceInInr: number;
  roadmapSectionId?: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  modules: Module[];
}
