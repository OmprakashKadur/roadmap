import { Course } from '../../types/course.types';

export const nextjsCourse: Course = {
  id: 'c-next-101',
  slug: 'nextjs-fullstack',
  title: 'Next.js 16 App Router, Server Components & Actions',
  description: 'The production guide to Next.js 16. Build high-speed full-stack apps with React Server Components, Server Actions, Route Handlers, Turbopack, and edge caching.',
  tier: 'PAID',
  priceInInr: 999,
  level: 'advanced',
  estimatedHours: 5.5,
  modules: [
    {
      id: 'm-next-1',
      title: 'Module 1: Server Components & The App Router Lifecycle (Free Preview)',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-next-1',
          slug: 'server-vs-client-components',
          title: '1. Server vs Client Component Boundaries',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 950,
          videoUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
          markdownContent: `## The Next.js 16 Component Model

By default, all components inside the \`app/\` directory are React Server Components (RSC).

### Core Benefits of Server Components:
1. **Zero Client Bundle Size**: Large dependencies (markdown parsers, encryption libraries, database clients) stay on the server.
2. **Direct Backend Access**: Query PostgreSQL or internal microservices directly inside the component without creating REST endpoints.
3. **Automatic Code Splitting**: Client Components are only hydrated where interactive state (\`useState\`, \`useEffect\`) is strictly needed.`,
          starterCode: `// Server Component fetching telemetry data directly
export default async function TelemetryPage() {
  // TODO: Fetch data on server and render
  return <div>Telemetry Page</div>;
}`,
          solutionCode: `import { prisma } from '@/lib/prisma';

export default async function TelemetryPage() {
  const activeOrders = await prisma.order.findMany({
    where: { status: 'COMPLETED' },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-white font-mono">Recent Orders</h1>
      <div className="space-y-2">
        {activeOrders.map(order => (
          <div key={order.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <span>{order.id}</span> • <span>₹{order.amountInInr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
          expectedOutput: `Renders dynamic server component without client bundle overhead.`
        }
      ]
    },
    {
      id: 'm-next-2',
      title: 'Module 2: Server Actions & Zod Schema Validation (Pro)',
      orderIndex: 2,
      lessons: [
        {
          id: 'l-next-2',
          slug: 'server-actions-mutations',
          title: '2. Type-Safe Form Mutations with Server Actions',
          orderIndex: 1,
          isFree: false,
          durationSeconds: 1200,
          videoUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
          markdownContent: `## Server Actions for Full-Stack Form Mutations

Server Actions allow you to mutate backend data directly from form submissions or client event handlers without setting up dedicated API route handlers.

### Key Security Pattern:
Never trust raw form data. Always validate payloads with Zod schemas on the server before database inserts.`,
          starterCode: `'use server';
// Write an authenticated Server Action with Zod validation`,
          solutionCode: `'use server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

const ProfileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string().url().optional()
});

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = ProfileSchema.parse({
    fullName: formData.get("fullName"),
    avatarUrl: formData.get("avatarUrl") || undefined
  });

  return await prisma.profile.update({
    where: { id: user.id },
    data: parsed
  });
}`,
          expectedOutput: `Safely updates authenticated user profile in Supabase database with zero API boilerplate.`
        }
      ]
    }
  ]
};
