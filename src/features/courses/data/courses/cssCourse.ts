import { Course } from '../../types/course.types';

export const cssCourse: Course = {
  id: 'c-css-101',
  slug: 'modern-css',
  title: 'CSS3, Modern Layouts & Responsive Design',
  description: 'Build responsive, production-ready interfaces without relying on heavyweight frameworks. Master CSS Grid, Flexbox, Custom Properties, and micro-animations.',
  tier: 'FREE',
  priceInInr: 0,
  level: 'beginner',
  estimatedHours: 3.0,
  modules: [
    {
      id: 'm-css-1',
      title: 'Module 1: Layout Mastery with Flexbox & CSS Grid',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-css-1',
          slug: 'flexbox-deep-dive',
          title: '1. Flexbox 1-D Layouts: Alignment & Space Distribution',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 710,
          videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
          markdownContent: `## Modern Flexbox in Production UI

Flexbox distributes space along a single axis (either row or column).

### Key Properties:
- \`display: flex\`: Establishes a flex formatting context.
- \`justify-content\`: Aligns items along the main axis (\`space-between\`, \`center\`, \`flex-start\`).
- \`align-items\`: Aligns items along the cross axis (\`center\`, \`stretch\`, \`baseline\`).
- \`gap\`: Eliminates ugly margin hacks between adjacent child elements.`,
          starterCode: `.card-container {
  /* TODO: Arrange child items horizontally with equal spacing and vertical centering */
}`,
          solutionCode: `.card-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem;
  background-color: #0b0d14;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
}`,
          expectedOutput: `Flex container perfectly centering children with 1.5rem gap spacing.`
        },
        {
          id: 'l-css-2',
          slug: 'css-grid-dashboard-layouts',
          title: '2. Responsive 2D Grid Dashboards with minmax()',
          orderIndex: 2,
          isFree: true,
          durationSeconds: 840,
          videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
          markdownContent: `## Building Responsive Dashboards with CSS Grid

CSS Grid operates across two dimensions simultaneously (rows and columns).

### The Golden Responsive Pattern:
\`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))\`
This single line creates a completely responsive grid that auto-wraps without needing a single \`@media\` query!`,
          starterCode: `.dashboard-grid {
  /* TODO: Implement auto-fitting grid layout with minmax() */
}`,
          solutionCode: `.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  width: 100%;
}

.kpi-card {
  background: #111420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  padding: 1.25rem;
}`,
          expectedOutput: `Grid dashboard wrapping smoothly between 1, 2, and 3 columns based on screen width.`
        }
      ]
    }
  ]
};
