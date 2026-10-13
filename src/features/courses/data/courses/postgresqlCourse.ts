import { Course } from '../../types/course.types';

export const postgresqlCourse: Course = {
  id: 'c-pg-101',
  slug: 'postgresql-prisma-mastery',
  title: 'PostgreSQL Relational Design & Prisma ORM',
  description: 'Design robust database schemas. Master relational indexes, foreign keys, transaction isolation, window functions, and Prisma ORM migrations.',
  tier: 'FREE',
  priceInInr: 0,
  level: 'beginner',
  estimatedHours: 3.5,
  modules: [
    {
      id: 'm-pg-1',
      title: 'Module 1: Relational Schema Modeling & Indexes',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-pg-1',
          slug: 'schema-design-and-indexes',
          title: '1. Designing Normal Forms & Strategic B-Tree Indexes',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 820,
          videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
          markdownContent: `## Relational Schema Design & B-Tree Indexes

Relational databases ensure ACID transactions and referential integrity across enterprise tables.

### Key Indexing Rules:
- Primary keys automatically create a unique B-Tree index.
- Foreign keys **do not** automatically create an index in Postgres. Always add an explicit index on foreign key columns used in joins (\`JOIN users ON orders.user_id = users.id\`).
- Use composite indexes \`(status, created_at)\` when filtering by status and sorting by timestamp simultaneously.`,
          starterCode: `-- Write DDL schema for a multi-tenant client organization model`,
          solutionCode: `CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_org_email UNIQUE(organization_id, email)
);

-- Crucial foreign key index for fast member lookup
CREATE INDEX idx_members_org_id ON members(organization_id);`,
          expectedOutput: `Generates normalized relational tables with cascading foreign keys and optimized B-Tree indexes.`
        }
      ]
    }
  ]
};
