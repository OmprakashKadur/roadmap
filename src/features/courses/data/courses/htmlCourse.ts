import { Course } from '../../types/course.types';

export const htmlCourse: Course = {
  id: 'c-html-101',
  slug: 'html-fundamentals',
  title: 'HTML5 Modern Semantics & Web Architecture',
  description: 'Master the foundation of the modern web. Learn semantic tags, accessibility (a11y), forms, SEO metadata, and clean document structure.',
  tier: 'FREE',
  priceInInr: 0,
  level: 'beginner',
  estimatedHours: 2.5,
  modules: [
    {
      id: 'm-html-1',
      title: 'Module 1: Document Structure & Semantic HTML',
      orderIndex: 1,
      lessons: [
        {
          id: 'l-html-1',
          slug: 'html-document-anatomy',
          title: '1. Anatomy of an HTML5 Document & DOM Tree',
          orderIndex: 1,
          isFree: true,
          durationSeconds: 620,
          videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
          markdownContent: `## Anatomy of an HTML5 Document

HTML (HyperText Markup Language) defines the structure and meaning of web content.

### Core Structure Elements
- \`<!DOCTYPE html>\`: Tells modern browsers to render in standard mode.
- \`<html lang="en">\`: Root element defining language for accessibility and search engines.
- \`<head>\`: Contains metadata, charset, viewport configurations, and link imports.
- \`<body>\`: The rendered document tree visible to the end user.

### Why Semantic HTML Matters
Screen readers, web crawlers, and modern browser engines rely on semantic elements like \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, and \`<footer>\` rather than generic nested \`<div>\` soup.`,
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Client Portal</title>
</head>
<body>
  <!-- TODO: Build a semantic header, main, and footer layout -->
  <h1>Welcome to Enterprise Hub</h1>
</body>
</html>`,
          solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enterprise Portal</title>
</head>
<body>
  <header>
    <nav aria-label="Primary">
      <a href="/">Dashboard</a>
      <a href="/reports">Reports</a>
    </nav>
  </header>
  <main>
    <article>
      <h1>Enterprise Health Telemetry</h1>
      <p>All core microservices operating at 99.98% SLA.</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 Enterprise Systems. All rights reserved.</p>
  </footer>
</body>
</html>`,
          expectedOutput: `Valid semantic HTML5 document rendering header navigation, main article container, and footer.`
        },
        {
          id: 'l-html-2',
          slug: 'forms-and-validations',
          title: '2. Accessible Forms, Input Types & Native Validation',
          orderIndex: 2,
          isFree: true,
          durationSeconds: 780,
          videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
          markdownContent: `## Enterprise Form Design & Validation

Forms are the primary interactive input boundary between users and your database.

### Best Practices:
1. Always pair \`<label for="id">\` with matching input IDs.
2. Utilize semantic input types (\`type="email"\`, \`type="number"\`, \`type="tel"\`) for native mobile keyboard layouts.
3. Use HTML5 constraint validation attributes (\`required\`, \`pattern\`, \`min\`, \`max\`).`,
          starterCode: `<form id="login-form">
  <!-- TODO: Add accessible email and password fields with validation -->
  <button type="submit">Submit</button>
</form>`,
          solutionCode: `<form id="login-form" novalidate>
  <div>
    <label for="user-email">Work Email Address</label>
    <input 
      type="email" 
      id="user-email" 
      name="email" 
      required 
      autocomplete="email" 
      placeholder="engineer@enterprise.com"
    />
  </div>
  <div>
    <label for="user-password">Security Password</label>
    <input 
      type="password" 
      id="user-password" 
      name="password" 
      required 
      minlength="8" 
      autocomplete="current-password"
    />
  </div>
  <button type="submit">Authenticate Session</button>
</form>`,
          expectedOutput: `Accessible form inputs with native validation bindings and accessible label linkages.`
        }
      ]
    }
  ]
};
