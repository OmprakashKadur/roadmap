import { Course } from '../../types/course.types';

export const javascriptCourse: Course = {
  id: 'c-js-101',
  slug: 'javascript-deep-dive',
  title: 'JavaScript ES6+, Event Loop & Async Architecture',
  description: 'Deep dive into modern JavaScript runtime fundamentals. Master closures, prototypes, microtask event loops, Promises, async/await, and memory management.',
  tier: 'HYBRID',
  priceInInr: 499,
  level: 'intermediate',
  estimatedHours: 4.0,
  modules: [
    {
      id: 'm-js-1',
      title: 'Module 1: Closures, Scope & Modern ES6+ (Free Preview)',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-js-1',
          slug: 'closures-and-lexical-scope',
          title: '1. Lexical Scope, Closures & Private State Engines',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 920,
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          markdownContent: `## Closures & Lexical Scope

A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).

### Practical Enterprise Use Case: Factory Functions
Closures let you associate data (the lexical environment) with a function that operates on that data. This is directly analogous to object-oriented encapsulation without using classes.`,
          starterCode: `function createRateLimiter(maxCalls, timeWindowMs) {
  // TODO: Use closures to track calls and timestamps privately
  return function() {
    // Return true if allowed, false if rate limited
  };
}`,
          solutionCode: `function createRateLimiter(maxCalls, timeWindowMs) {
  let callTimestamps = [];

  return function() {
    const now = Date.now();
    // Prune expired timestamps
    callTimestamps = callTimestamps.filter(ts => now - ts < timeWindowMs);

    if (callTimestamps.length < maxCalls) {
      callTimestamps.push(now);
      return { allowed: true, remaining: maxCalls - callTimestamps.length };
    }

    return { allowed: false, remaining: 0 };
  };
}

const limiter = createRateLimiter(3, 1000);
console.log(limiter()); // { allowed: true, remaining: 2 }
console.log(limiter()); // { allowed: true, remaining: 1 }
console.log(limiter()); // { allowed: true, remaining: 0 }
console.log(limiter()); // { allowed: false, remaining: 0 }`,
          expectedOutput: `{ allowed: true, remaining: 2 }\n{ allowed: true, remaining: 1 }\n{ allowed: true, remaining: 0 }\n{ allowed: false, remaining: 0 }`
        }
      ]
    },
    {
      id: 'm-js-2',
      title: 'Module 2: Event Loop, Microtasks & Async Concurrency (Pro)',
      orderIndex: 2,
      lessons: [
        {
          id: 'l-js-2',
          slug: 'async-concurrency-pooling',
          title: '2. High-Throughput Async Concurrency Limiter Pool',
          orderIndex: 1,
          isFree: false,
          durationSeconds: 1100,
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          markdownContent: `## The Event Loop & Async Task Scheduling

The JavaScript runtime consists of:
1. **Call Stack**: Synchronous execution frames.
2. **Microtask Queue**: Promises (\`.then\`, \`await\`, \`queueMicrotask\`). Higher priority than macrotasks.
3. **Macrotask Queue**: \`setTimeout\`, \`setInterval\`, I/O operations.

### Concurrency Pools:
When calling external APIs with strict rate limits, executing 1000 promises with \`Promise.all()\` crashes the host socket pool. A concurrency limiter pools active executions to at most \`N\` simultaneous requests.`,
          starterCode: `// Write asyncPool(limit, tasks) to bound concurrent in-flight promises`,
          solutionCode: `async function asyncPool(limit, tasks) {
  const results = new Array(tasks.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < tasks.length) {
      const idx = currentIndex++;
      try {
        results[idx] = await tasks[idx]();
      } catch (err) {
        results[idx] = { error: err.message };
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}`,
          expectedOutput: `Processes 30 tasks with max 4 active in-flight promises without exceeding socket limits.`
        }
      ]
    }
  ]
};
