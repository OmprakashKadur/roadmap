import { Course } from '../../types/course.types';

export const etlCourse: Course = {
  id: 'c-etl-1',
  slug: 'enterprise-etl',
  title: 'Enterprise Data Pipelines & Resilient ETL',
  description: 'Build production-grade batch and streaming pipelines. Learn idempotent deduplication, schema evolution, and backfill patterns for enterprise clients.',
  tier: 'HYBRID',
  priceInInr: 1499,
  roadmapSectionId: 'data-eng',
  level: 'intermediate',
  estimatedHours: 4.5,
  modules: [
    {
      id: 'm-etl-1',
      title: 'Module 1: ETL Foundations & Batch Ingestion (Free Preview)',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-etl-1',
          slug: 'batch-pipeline-architecture',
          title: '1. Architecture: The Enterprise Batch Lifecycle',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 740,
          videoUrl: 'https://www.youtube.com/watch?v=qWru-b6m030',
          markdownContent: `## Batch Pipeline Architecture in Enterprise Deployments

In client deployments at Palantir, Scale AI, and Databricks, data pipelines are the bridge between dirty client systems and your platform.

### Core Engineering Rules:
1. **Idempotence**: Running a pipeline twice for the same date must yield identical results without duplicate rows.
2. **Type Safety**: Enforce strict schema validation before storing in parquet or data warehouses.
3. **Audit Trails**: Always emit execution metadata including dropped record counts and elapsed runtimes.`,
          diagramUrl: '/diagrams/etl-architecture.svg',
          starterCode: `def extract_raw_records():
    # Mock raw dirty stream
    return [
        {"id": 1, "client": "Acme", "amount": "100.0"},
        {"id": 2, "client": "Beta", "amount": "bad_num"}
    ]`,
          solutionCode: `def clean_and_load(records):
    cleaned = []
    for r in records:
        try:
            val = float(r["amount"])
            cleaned.append({**r, "amount": val})
        except ValueError:
            continue
    return cleaned`,
          expectedOutput: `[{"id": 1, "client": "Acme", "amount": 100.0}]`,
          taskId: 't-de-1'
        },
        {
          id: 'l-etl-2',
          slug: 'schema-deduplication',
          title: '2. Natural Key Deduplication & Dirty Data Handling',
          orderIndex: 2,
          isFree: true,
          durationSeconds: 880,
          videoUrl: 'https://www.youtube.com/watch?v=qWru-b6m030',
          markdownContent: `## Handling Duplicates in High-Throughput Pipelines

When client upstream sources retry requests, duplicate transmission is guaranteed.

### Deduplication Strategies:
- **Last-Write-Wins**: Compare \`updated_at\` timestamps on conflict.
- **Hash Deduplication**: Hash immutable business fields (\`SHA256(user_id + tx_time)\`).`,
          starterCode: `# Write a natural key deduplication loop`,
          solutionCode: `def deduplicate_events(events):
    store = {}
    for e in events:
        store[e["event_id"]] = e
    return list(store.values())`,
          expectedOutput: `Deduplicated 5 records -> 3 unique records stored.`,
          taskId: 't-de-1'
        }
      ]
    },
    {
      id: 'm-etl-2',
      title: 'Module 2: Advanced Orchestration with Airflow & Prefect (Pro)',
      orderIndex: 2,
      lessons: [
        {
          id: 'l-etl-3',
          slug: 'airflow-dag-design',
          title: '3. Designing Fault-Tolerant DAGs with Automatic Retries',
          orderIndex: 1,
          isFree: false,
          durationSeconds: 960,
          videoUrl: 'https://www.youtube.com/watch?v=qWru-b6m030',
          markdownContent: `## Production Orchestration: DAG Topologies & Exponential Retries

In real-world client engagements, network splits and database locks will cause upstream extracts to fail intermittently.

### DAG Design Patterns:
- Task idempotence: Clear previous batch state before writing partition output.
- Backoff policy: Configure exponential retry delays with jitter.
- SLA Miss alerts: Fire PagerDuty webhooks when execution time exceeds target window.`,
          starterCode: `# Design an Airflow DAG with exponential backoff`,
          solutionCode: `from datetime import datetime, timedelta

default_args = {
    'owner': 'fde-team',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True
}`,
          expectedOutput: `DAG compiled with 3 automated retries and exponential backoff.`,
          taskId: 't-de-1'
        }
      ]
    }
  ]
};
