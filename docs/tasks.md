# Engineering Task Breakdown & Implementation Roadmap
# Project: NextGen FDE Platform (Roadmap + Multi-Modal Courses)
# Architecture: Next.js 16 + Supabase (Auth, DB, Storage) + Razorpay + Feature-Driven Architecture

**Document Version:** 1.0.0  
**Status:** In Progress / Ready for Execution  
**Database Connection:** Supabase Transaction Pooler (`DATABASE_URL`) & Session Pooler (`DIRECT_URL`)  
**Auth & Storage:** Supabase Cloud (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)  
**Payment Gateway:** Razorpay (Server Verification + Webhooks)  

---

## Task Overview & Progress Tracker

| Epic / Phase | Scope | Total Tasks | Status |
| :--- | :--- | :---: | :---: |
| **Phase 0** | Infrastructure, Packages, Prisma ORM, Supabase SSR & Folder Skeleton | 4 | ✅ Completed |
| **Phase 1** | Auth Feature: Custom Login, Signup, Auth Modal & Middleware (`src/features/auth`) | 4 | ✅ Completed |
| **Phase 2** | Roadmap Feature: 21 Sections, Dual Progress & Task Drawer (`src/features/roadmap`) | 4 | ✅ Completed |
| **Phase 3** | Courses & Multi-Modal Lesson Player (`src/features/courses`, `src/features/player`) | 5 | ✅ Completed |
| **Phase 4** | Razorpay Payment & Server-Side Paywall Security (`src/features/payment`) | 5 | ✅ Completed |
| **Phase 5** | Learner Dashboard & Bidirectional Progress Sync (`src/features/dashboard`) | 3 | ✅ Completed |
| **Phase 6** | End-to-End Security Audit, Verification & Production Build | 3 | ✅ Completed |
| **TOTAL** | **Full Next.js Production Platform** | **28 Tasks** | **28 / 28 Completed** |

---

## Phase 0: Infrastructure, Database, Supabase & Folder Skeleton

### [TASK-0.1] Package Installation & Dependencies
* **Goal**: Install core production dependencies for Supabase, Prisma ORM, Razorpay, and modern UI icons/utilities.
* **Dependencies to Install**:
  - `@supabase/ssr` & `@supabase/supabase-js` (Modern Supabase Auth & SSR client)
  - `prisma` (as devDependency) & `@prisma/client` (PostgreSQL ORM)
  - `razorpay` (Payment gateway SDK)
  - `lucide-react` (Modern icons for UI)
  - `clsx` & `tailwind-merge` (Classname utilities)
  - `crypto-js` or native Node.js `crypto` for HMAC-SHA256 verification
* **Acceptance Criteria**:
  - `package.json` contains required packages with no version conflicts.
  - Zero peer dependency warnings on React 19 / Next.js 16.

---

### [TASK-0.2] Prisma Schema Setup & Database Migration
* **Goal**: Configure Prisma to connect to Supabase PostgreSQL using `DATABASE_URL` (transaction pooler) and `DIRECT_URL` (session pooler for migrations).
* **Files to Create/Modify**:
  - `prisma/schema.prisma`
* **Schema Models**:
  - `Profile` (id, email, fullName, avatarUrl, role, createdAt)
  - `Course` (id, slug, title, description, thumbnailUrl, tier ['FREE', 'PAID', 'HYBRID'], priceInInr, roadmapSectionId, level, estimatedHours, isPublished)
  - `Module` (id, courseId, title, orderIndex)
  - `Lesson` (id, moduleId, slug, title, orderIndex, isFree, videoUrl, durationSeconds, markdownContent, starterCode, solutionCode, expectedOutput, taskId)
  - `UserCourseAccess` (id, userId, courseId, razorpayPaymentId, grantedAt)
  - `Order` (id, userId, courseId, razorpayOrderId, razorpayPaymentId, amountInInr, status ['PENDING', 'COMPLETED', 'FAILED'])
  - `LessonProgress` (id, userId, lessonId, completed, lastPositionSeconds, updatedAt)
  - `TaskProgress` (id, userId, taskId, status ['done', 'in-progress'], completedAt)
* **Acceptance Criteria**:
  - `npx prisma db push` or `prisma migrate dev` executes successfully against Supabase Postgres.
  - Tables generated with strict foreign key cascades.

---

### [TASK-0.3] Supabase SSR Client & Cookie Management
* **Goal**: Establish server and client Supabase factories adhering to Next.js 16 App Router cookie handling standards.
* **Files to Create**:
  - `src/lib/supabase/client.ts` (`createBrowserClient` for React Client Components)
  - `src/lib/supabase/server.ts` (`createServerClient` with Next.js `cookies()` for Server Components & Route Handlers)
  - `src/lib/supabase/middleware.ts` (Session refresh handler)
  - `src/middleware.ts` (Next.js root middleware to keep Supabase auth tokens fresh across routes)
* **Acceptance Criteria**:
  - Authenticated sessions auto-refresh without user logout on route transitions.
  - Server components can securely read the current user profile.

---

### [TASK-0.4] Feature Folder Architecture Skeleton Setup
* **Goal**: Build the clean modular directory structure where all domain logic lives inside `src/features/*`.
* **Directories to Initialize**:
  - `src/features/auth/{components, hooks, services, types}`
  - `src/features/roadmap/{components, hooks, services, types}`
  - `src/features/courses/{components, hooks, services, types}`
  - `src/features/player/{components, hooks, services, types}`
  - `src/features/payment/{components, hooks, services, types}`
  - `src/features/dashboard/{components, hooks, services, types}`
  - `src/features/shared/{components, hooks, utils}`
* **Acceptance Criteria**:
  - Clean barrel exports (`index.ts`) in each feature folder.
  - Zero cross-boundary spaghetti imports.

---

## Phase 1: Feature Domain — Authentication (`src/features/auth`)

### [TASK-1.1] Auth Types & Supabase Auth Service
* **Goal**: Encapsulate all Supabase authentication calls (sign up, sign in, sign out, reset password, get session) in a clean typed service.
* **Files to Create**:
  - `src/features/auth/types/auth.types.ts`
  - `src/features/auth/services/authService.ts`
* **Methods**:
  - `signUpWithEmail(email, password, fullName)`
  - `signInWithEmail(email, password)`
  - `signInWithOAuth(provider: 'github' | 'google')`
  - `signOut()`
  - `getCurrentUser()`
* **Acceptance Criteria**:
  - All errors return user-friendly messages (e.g. "Email already in use", "Invalid credentials").

---

### [TASK-1.2] Custom Login & Signup UI Pages
* **Goal**: Create high-conversion, dark-mode authentication pages with responsive validation.
* **Files to Create**:
  - `src/features/auth/components/LoginForm.tsx`
  - `src/features/auth/components/SignupForm.tsx`
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/signup/page.tsx`
* **Features**:
  - Form validation with clear error displays.
  - Social login buttons (GitHub, Google).
  - Post-login redirect preservation (`?redirect=/courses/fde-foundations/learn/intro`).
* **Acceptance Criteria**:
  - Creating a user writes to Supabase `auth.users` and creates a corresponding record in `profiles`.

---

### [TASK-1.3] Interactive Auth Modal & Guest Interceptor
* **Goal**: Build an unobtrusive slide-over/modal auth prompt triggered whenever an unauthenticated visitor attempts an action requiring login (tracking progress, checking off tasks, or buying a course).
* **Files to Create**:
  - `src/features/auth/components/AuthModal.tsx`
  - `src/features/auth/hooks/useAuthModal.ts` (Global modal state store)
  - `src/features/auth/components/UserNav.tsx` (User avatar dropdown in topnav)
* **Acceptance Criteria**:
  - Unauthenticated users clicking "Mark as Complete" or "Buy Course" see the Auth Modal instantly without losing their scroll position.
  - After logging in, the modal closes and resumes the pending action.

---

### [TASK-1.4] Authentication Route Protection & Session State
* **Goal**: Provide a lightweight `useAuth` hook and server guard helper.
* **Files to Create**:
  - `src/features/auth/hooks/useAuth.ts`
  - `src/features/auth/services/authGuard.ts` (Server component redirect helper)
* **Acceptance Criteria**:
  - Navigating to `/dashboard` while logged out immediately redirects to `/login`.
  - Public routes (`/`, `/roadmap`, `/courses`) remain accessible to guests.

---

## Phase 2: Feature Domain — Interactive Roadmap Hub (`src/features/roadmap`)

### [TASK-2.1] 21-Section Curriculum Data Model & Migration
* **Goal**: Port the complete, tested 21-section FDE curriculum and task dataset from the HTML prototype into typed TypeScript data models and database seeders.
* **Files to Create**:
  - `src/features/roadmap/types/roadmap.types.ts`
  - `src/features/roadmap/data/roadmapData.ts` (The 21 sections, 95+ topics, and 64+ practical tasks)
* **Acceptance Criteria**:
  - Full TypeScript types for `RoadmapSection`, `RoadmapTopic`, `RoadmapTask`.
  - All task IDs (`t-cs-1`, `t-cli-1`, `t-git-1`, `t-py-1`, `t-react-1`, `t-db-1`, etc.) match across courses and roadmap.

---

### [TASK-2.2] Visual Roadmap Page (`/roadmap`) & Section Cards
* **Goal**: Build the interactive roadmap page in Next.js 16 featuring section timeline cards, topic badges, and filter controls.
* **Files to Create**:
  - `src/features/roadmap/components/RoadmapTimeline.tsx`
  - `src/features/roadmap/components/RoadmapSectionCard.tsx`
  - `src/features/roadmap/components/RoadmapFilterBar.tsx`
  - `src/features/roadmap/components/ReadinessRing.tsx` (SVG progress ring)
  - `src/app/(platform)/roadmap/page.tsx`
* **Features**:
  - Toggles: `All (Topics + Tasks)`, `📚 Topics Only`, `🛠️ Tasks Only`.
  - Level filters: `All`, `Beginner`, `Essential`, `Advanced`.
  - Live fuzzy search bar.
* **Acceptance Criteria**:
  - Renders all 21 sections smoothly with zero layout shift.
  - Clicking any topic opens the Topic Deep-Dive Drawer; clicking a task opens the Task Drawer.

---

### [TASK-2.3] Deep-Dive Slide-Over Task Workshop Drawer
* **Goal**: Port the interactive task drawer featuring copyable starter code, step guides, complete solutions, and checklists.
* **Files to Create**:
  - `src/features/roadmap/components/TaskDrawer.tsx`
  - `src/features/roadmap/components/TopicDrawer.tsx`
  - `src/features/roadmap/hooks/useTaskDrawer.ts`
* **Features**:
  - Scenario & Objective display.
  - Syntax-highlighted code block with 1-click **Copy Code** button.
  - Expandable accordion for complete working solution.
  - Expected terminal output display.
  - Direct deep link button: `"Start Interactive Course Lesson ↗"`.
* **Acceptance Criteria**:
  - Drawer slides in smoothly from the right, supports `Esc` key and backdrop click to close.

---

### [TASK-2.4] Dual Progress Tracking Engine with Auth Check
* **Goal**: Handle state persistence for completed topics and completed tasks.
* **Files to Create**:
  - `src/features/roadmap/hooks/useRoadmapProgress.ts`
  - `src/features/roadmap/services/roadmapProgressService.ts`
* **Logic**:
  - If **unauthenticated**: Intercept clicks on status toggles and display `AuthModal` ("Sign in to track your progress").
  - If **authenticated**: Optimistically update UI state and persist to Supabase `task_progress` table.
* **Acceptance Criteria**:
  - Unauthenticated users cannot save progress.
  - Authenticated progress survives browser refresh and syncs across devices.

---

## Phase 3: Feature Domain — Courses & Multi-Modal Lesson Player (`src/features/courses` & `src/features/player`)

### [TASK-3.1] Course Catalog (`/courses`) with Free / Paid / Hybrid Filters
* **Goal**: Build the course directory showcasing courses with price badges, duration, level, and enrollment status.
* **Files to Create**:
  - `src/features/courses/types/course.types.ts`
  - `src/features/courses/components/CourseGrid.tsx`
  - `src/features/courses/components/CourseCard.tsx`
  - `src/features/courses/components/CourseFilterPills.tsx` (All, Free, Paid, Hybrid)
  - `src/app/(platform)/courses/page.tsx`
* **Acceptance Criteria**:
  - Cards prominently display badge: `100% Free`, `Paid (₹1,499)`, or `Hybrid (Module 1 Free)`.
  - Shows module count, video lesson count, and hands-on lab count.

---

### [TASK-3.2] Course Syllabus & Detail Page (`/courses/[courseSlug]`)
* **Goal**: Comprehensive landing and syllabus page showing what is included, free preview tags, instructor info, and enrollment button.
* **Files to Create**:
  - `src/features/courses/components/CourseHero.tsx`
  - `src/features/courses/components/SyllabusAccordion.tsx`
  - `src/app/(platform)/courses/[courseSlug]/page.tsx`
* **Features**:
  - Free lessons marked with green `Free Preview` badge.
  - Paid lessons marked with lock icon `🔒 Pro`.
  - Dynamic CTA button:
    * If already owned: `"Continue Learning ↗"`
    * If free course: `"Start Free Course ↗"`
    * If paid/unowned: `"Unlock Course (₹1,499)"`
* **Acceptance Criteria**:
  - Clean server-rendered page optimized for SEO and readability.

---

### [TASK-3.3] Multi-Modal Lesson Player Shell (`/courses/[slug]/learn/[lessonSlug]`)
* **Goal**: Build the theater-mode lesson player layout with sticky collapsible sidebar syllabus, top media tier, and bottom multi-modal workspace.
* **Files to Create**:
  - `src/features/player/components/PlayerShell.tsx`
  - `src/features/player/components/PlayerSidebar.tsx`
  - `src/features/player/components/PlayerHeader.tsx`
  - `src/app/(platform)/courses/[courseSlug]/learn/[lessonSlug]/page.tsx`
* **Acceptance Criteria**:
  - Responsive on desktop and mobile.
  - Left/right keyboard shortcuts (`Cmd+Left` / `Cmd+Right`) to navigate between lessons.

---

### [TASK-3.4] Four Multi-Modal Content Tabs
* **Goal**: Build the 4 tabs inside each lesson:
  - **Tab 1: 📖 Concept & Guide**: Formatted markdown article, code blocks, syntax highlighting, copy buttons.
  - **Tab 2: 🖼️ Architecture & Diagrams**: High-resolution SVG/PNG system architecture schematics with zoom modal.
  - **Tab 3: 🛠️ Hands-on Workshop**:
    * Enterprise client problem scenario.
    * Copy-pasteable starter template with mock dataset.
    * Step-by-step milestones.
    * Expandable, commented complete working solution.
    * Expected terminal output.
    * 4-point verification checklist.
  - **Tab 4: 📝 Private Notes**: User personal markdown notebook stored in Supabase.
* **Files to Create**:
  - `src/features/player/components/tabs/ConceptGuideTab.tsx`
  - `src/features/player/components/tabs/ArchitectureDiagramTab.tsx`
  - `src/features/player/components/tabs/TaskWorkshopTab.tsx`
  - `src/features/player/components/tabs/UserNotesTab.tsx`
  - `src/features/player/components/LessonTabNavigation.tsx`
* **Acceptance Criteria**:
  - Switching tabs is instant (zero page reload).
  - Workshop checklist checkmarks persist to user account.

---

### [TASK-3.5] Video Streaming Player Component (`src/features/player`)
* **Goal**: Implement high-performance video player for lessons that include video walkthroughs.
* **Files to Create**:
  - `src/features/player/components/VideoPlayer.tsx`
  - `src/features/player/hooks/useVideoPlayer.ts`
* **Features**:
  - Speed selector: `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`.
  - Autoplay next lesson toggle.
  - Progress tracking: automatically updates `lastPositionSeconds` in Supabase `lesson_progress` on pause / 10s intervals.
* **Acceptance Criteria**:
  - Smooth playback with custom styled controls matching the dark theme.

---

## Phase 4: Feature Domain — Granular Paywall & Razorpay Integration (`src/features/payment`)

### [TASK-4.1] Server-Side Entitlement & Paywall Security Gate
* **Goal**: Ensure that unentitled users can NEVER access protected video URLs, downloadable solution zip archives, or advanced solution code via network inspection.
* **Files to Create**:
  - `src/features/payment/services/entitlementService.ts`
  - `src/features/payment/components/PaywallBanner.tsx`
* **Logic**:
  ```typescript
  // Server Component verification
  const session = await getSupabaseSession();
  const isEnrolled = session ? await checkUserCourseAccess(session.user.id, course.id) : false;
  
  if (!lesson.isFree && !isEnrolled) {
    // Redact protected content before sending to client
    return renderPaywallOverlay(lesson.title, course.priceInInr);
  }
  ```
* **Acceptance Criteria**:
  - Inspecting DevTools Network tab reveals zero video streaming URLs or full solution files for locked lessons.

---

### [TASK-4.2] Razorpay Backend Client & Order Creation API
* **Goal**: Implement server-side order generation with Razorpay Orders API.
* **Files to Create**:
  - `src/lib/razorpay/server.ts` (Razorpay instance with key & secret)
  - `src/app/api/payment/create-order/route.ts`
* **Flow**:
  - 1. Authenticate user session. If guest, return `401 Unauthorized`.
  - 2. Verify course exists and is not already owned.
  - 3. Call `razorpay.orders.create({ amount: course.priceInInr * 100, currency: "INR", receipt: ... })`.
  - 4. Insert pending record into Supabase `orders` table.
  - 5. Return `orderId`, `amount`, `currency`, and `keyId` to client.
* **Acceptance Criteria**:
  - Returns valid Razorpay Order ID. Rejects unauthenticated requests with HTTP 401.

---

### [TASK-4.3] Client Razorpay Modal Checkout Component
* **Goal**: Dynamically load Razorpay SDK on the client and launch the native checkout modal.
* **Files to Create**:
  - `src/features/payment/components/RazorpayCheckoutButton.tsx`
  - `src/features/payment/hooks/useRazorpayCheckout.ts`
* **Flow**:
  - Loads script `https://checkout.razorpay.com/v1/checkout.js`.
  - Passes customer name, email, order ID, and theme colors (`#6366f1`).
  - Handles `handler` callback with payment tokens.
* **Acceptance Criteria**:
  - Opens Razorpay modal cleanly on desktop and mobile. Handles user modal dismissal gracefully.

---

### [TASK-4.4] Payment Verification API (`/api/payment/verify`)
* **Goal**: Validate Razorpay cryptographic signature using HMAC-SHA256 and grant course entitlement in Supabase.
* **Files to Create**:
  - `src/app/api/payment/verify/route.ts`
* **Signature Verification Algorithm**:
  ```typescript
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  ```
* **Actions on Valid Signature**:
  - Update `orders` status to `COMPLETED`.
  - Insert row into `user_course_access (user_id, course_id, razorpay_payment_id)`.
  - Return HTTP 200 with `{ success: true, courseSlug }`.
* **Acceptance Criteria**:
  - Spoofed or altered signatures immediately return `400 Bad Request`.
  - Valid payment grants immediate access and redirects user to lesson 1 of the course.

---

### [TASK-4.5] Razorpay Webhook Handler (`/api/payment/webhook`)
* **Goal**: Handle edge cases where user closes browser tab before client verification runs.
* **Files to Create**:
  - `src/app/api/payment/webhook/route.ts`
* **Events to Handle**:
  - `payment.captured`
  - `order.paid`
* **Acceptance Criteria**:
  - Validates `x-razorpay-signature` against `RAZORPAY_WEBHOOK_SECRET`.
  - Idempotently guarantees access is granted in Supabase.

---

## Phase 5: Feature Domain — Learner Dashboard (`src/features/dashboard`)

### [TASK-5.1] Learner Home (`/dashboard`) & Resume Learning Card
* **Goal**: Central hub for authenticated users showing active courses, last watched lesson with timestamp, and quick resumption.
* **Files to Create**:
  - `src/features/dashboard/components/ResumeLearningCard.tsx`
  - `src/features/dashboard/components/EnrolledCoursesList.tsx`
  - `src/app/(platform)/dashboard/page.tsx`
* **Acceptance Criteria**:
  - Clicking "Continue" jumps directly to the exact video timestamp or section where the user stopped.

---

### [TASK-5.2] Readiness Score & Streak Counter
* **Goal**: Display gamified progress metrics: daily streak counter and overall FDE Readiness percentage ring.
* **Files to Create**:
  - `src/features/dashboard/components/StreakWidget.tsx`
  - `src/features/dashboard/components/ReadinessScoreWidget.tsx`
* **Acceptance Criteria**:
  - Accurately computes `(Topics Done + Tasks Done) / Total Items * 100%`.

---

### [TASK-5.3] Bidirectional Roadmap <-> Course Progress Synchronization
* **Goal**: Completing a lesson in any course automatically flips the corresponding node and task on the Roadmap to `Done`.
* **Files to Create**:
  - `src/features/player/services/syncProgressService.ts`
* **Logic**:
  - When lesson completed:
    1. Mark `lesson_progress.completed = true`.
    2. If lesson has linked `task_id` (e.g. `t-react-1`), set `task_progress.status = 'done'`.
    3. Update user streak timestamp.
* **Acceptance Criteria**:
  - Returning to `/roadmap` shows the task card marked as completed with green checkmark.

---

## Phase 6: Quality, Security Audit & Production Verification

### [TASK-6.1] Paywall Security & Penetration Testing
* **Goal**: Rigorously test that unauthenticated or unpaid requests cannot access paid content:
  - Test 1: Fetching `/api/courses/[id]/lessons/[lockedId]` without token returns 401.
  - Test 2: Spoofed Razorpay signature in `/api/payment/verify` is rejected.
  - Test 3: Unauthenticated user cannot write to `lesson_progress` or `task_progress`.
* **Acceptance Criteria**:
  - All automated security assertions pass.

---

### [TASK-6.2] Next.js 16 Production Build & Lint Audit
* **Goal**: Validate that the entire TypeScript codebase builds cleanly with zero errors.
* **Commands to Run**:
  - `npm run lint`
  - `npx prisma validate`
  - `npm run build`
* **Acceptance Criteria**:
  - `next build` produces optimized static/dynamic routes with 0 errors.

---

## Environment Variable Checklist (`.env`)

```ini
# Supabase Cloud
NEXT_PUBLIC_SUPABASE_URL=https://dmdgrchmtupwjbqckugl.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ayyznwSmdKmejnP-nzp_Uw_QCTdi_za

# PostgreSQL Pooler Connections
DATABASE_URL="postgresql://postgres.dmdgrchmtupwjbqckugl:...@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.dmdgrchmtupwjbqckugl:...@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

# Razorpay Payment Gateway (To be added)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
```
