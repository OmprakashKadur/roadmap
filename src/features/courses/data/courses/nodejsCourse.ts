import { Course } from '../../types/course.types';

export const nodejsCourse: Course = {
  id: 'c-node-101',
  slug: 'nodejs-backend-architecture',
  title: 'Node.js, Express & Microservice Backend Design',
  description: 'Design production backend services. Master HTTP request lifecycles, streaming I/O, middleware pipelines, error propagation, and REST API standards.',
  tier: 'HYBRID',
  priceInInr: 799,
  level: 'intermediate',
  estimatedHours: 4.0,
  modules: [
    {
      id: 'm-node-1',
      title: 'Module 1: HTTP Servers & Middleware Pipelines (Free Preview)',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-node-1',
          slug: 'node-middleware-patterns',
          title: '1. Composable Middleware, Logging & Global Error Handlers',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 880,
          videoUrl: 'https://www.youtube.com/watch?v=f2EqECiTBL8',
          markdownContent: `## Express / Node.js Middleware Architecture

Middleware functions are functions that have access to the request object (\`req\`), response object (\`res\`), and the \`next\` function in the application's request-response cycle.

### Core Patterns:
1. **Request Interception**: Parse authorization tokens and attach verified identities to \`req.user\`.
2. **Correlation ID Tracking**: Inject \`x-request-id\` header to trace requests across microservices.
3. **Global Error Catching**: Always register an error middleware with 4 arguments: \`(err, req, res, next)\`.`,
          starterCode: `const express = require('express');
const app = express();

// TODO: Build a request logging middleware and custom error handler`,
          solutionCode: `const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Correlation ID & Logger Middleware
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('X-Request-ID', reqId);
  const start = Date.now();
  res.on('finish', () => {
    console.log(\`[\${req.method}] \${req.originalUrl} - \${res.statusCode} (\${Date.now() - start}ms) [ID: \${reqId}]\`);
  });
  next();
});

// Centralized Error Handler (4 args)
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      requestId: req.id
    }
  });
});`,
          expectedOutput: `Emits structured request logs with unique correlation IDs and catches unhandled runtime exceptions.`
        }
      ]
    }
  ]
};
