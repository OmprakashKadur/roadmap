import { Course } from '../../types/course.types';

export const reactCourse: Course = {
  id: 'c-react-101',
  slug: 'react-fundamentals',
  title: 'React 19 Architecture, Hooks & Component State',
  description: 'Master React 19 from fundamentals to production architecture. Learn custom hooks, memoization, Server Actions integration, optimistic updates, and clean component patterns.',
  tier: 'HYBRID',
  priceInInr: 799,
  level: 'intermediate',
  estimatedHours: 4.5,
  modules: [
    {
      id: 'm-react-1',
      title: 'Module 1: Component Lifecycle & State Mental Models (Free Preview)',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-react-1',
          slug: 'react-state-and-rendering',
          title: '1. React Rendering Cycles & Pure Component Invariants',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 850,
          videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          markdownContent: `## React 19 State & Rendering Cycles

In React, state represents data that changes over time. When state updates, React re-renders the component and updates the DOM.

### Golden Rules:
1. Treat state as read-only. Never mutate objects or arrays directly.
2. Render methods must be pure functions of props and state.
3. Use derived state via standard variables or \`useMemo\` instead of redundant \`useState\` + \`useEffect\` pairs.`,
          starterCode: `import React, { useState } from 'react';

export function TelemetryCounter() {
  // TODO: Implement stateful counter with min/max bounds
  return <div>Counter</div>;
}`,
          solutionCode: `import React, { useState } from 'react';

export function TelemetryCounter({ min = 0, max = 100 }: { min?: number; max?: number }) {
  const [count, setCount] = useState(min);

  const increment = () => setCount(prev => Math.min(prev + 1, max));
  const decrement = () => setCount(prev => Math.max(prev - 1, min));

  return (
    <div className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-lg">
      <button onClick={decrement} className="px-3 py-1 bg-slate-800 text-white rounded">-</button>
      <span className="font-mono text-lg font-bold text-amber-400">{count}</span>
      <button onClick={increment} className="px-3 py-1 bg-slate-800 text-white rounded">+</button>
    </div>
  );
}`,
          expectedOutput: `Interactive bounded counter component adhering to pure React state conventions.`
        }
      ]
    },
    {
      id: 'm-react-2',
      title: 'Module 2: Custom Hooks & Performance Optimization (Pro)',
      orderIndex: 2,
      lessons: [
        {
          id: 'l-react-2',
          slug: 'custom-hooks-debounce-throttle',
          title: '2. High-Performance Search with useDebounce & useMemo',
          orderIndex: 1,
          isFree: false,
          durationSeconds: 1040,
          videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          markdownContent: `## Custom Hooks & Input Debouncing

When filtering large enterprise tables or firing API searches, updating state on every single keystroke triggers UI freezing and excessive network load.

### Custom Hook Architecture:
A custom hook encapsulates stateful logic (\`useState\` + \`useEffect\`) inside a reusable function, keeping presentation components clean and declarative.`,
          starterCode: `// Write useDebounce(value, delayMs) hook`,
          solutionCode: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}`,
          expectedOutput: `useDebounce returns value only after input has stabilized for specified delay duration.`
        }
      ]
    }
  ]
};
