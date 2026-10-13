export interface RoadmapResource {
  label: string;
  url: string;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  desc: string;
  level: 'beginner' | 'essential' | 'recommended' | 'advanced';
  subtopics: string[];
  resources: RoadmapResource[];
  isPro?: boolean;
}

export interface RoadmapTaskGuide {
  conceptPrimer: string;
  scenario: string;
  starterSnippet: string;
  steps: string[];
  solutionSnippet: string;
  solutionExplanation: string;
  expectedOutput: string;
  checklist: string[];
}

export interface RoadmapTask {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  est: string;
  desc: string;
  guide?: RoadmapTaskGuide;
  isPro?: boolean;
}

export interface RoadmapSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  topics: RoadmapTopic[];
  tasks: RoadmapTask[];
  isPro?: boolean;
}

export interface RoadmapDefinition {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  badge: string;
  category: 'flagship' | 'data' | 'ai' | 'cloud';
  sections: RoadmapSection[];
  totalMilestones: number;
  estimatedWeeks: number;
  tier: 'free' | 'hybrid' | 'pro';
}

