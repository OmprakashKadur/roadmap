# Product Requirements Document (PRD)
# Project: NextGen FDE & Tech Career Platform (Roadmap + Multi-Modal Video/Article Courses)

**Document Version:** 2.0.0  
**Status:** Approved / In Execution  
**Target Release:** Q4 2026  
**Target Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, TailwindCSS v4, Supabase (Auth, PostgreSQL with RLS, Storage), Razorpay Payment Gateway  
**Architecture Pattern:** Feature-Driven Architecture (`src/features/*`)  

---

## 1. Executive Summary & Product Vision

### 1.1 Vision Statement
To build an enterprise-grade, highly scalable career acceleration platform for high-leverage engineering disciplines (starting with **Forward Deployed Engineering - FDE**).

The platform bridges the gap between high-level roadmaps and tactical execution by coupling a **Dynamic 21-Section Interactive Career Roadmap** with **Multi-Modal Deep-Dive Courses** (HD video, rich text primers, visual architecture diagrams, and hands-on coding workshops).

### 1.2 Core Pillars & Strategic Adjustments
1. **Feature-Driven Architecture**: All code is organized strictly under feature domains (`src/features/auth`, `src/features/roadmap`, `src/features/courses`, `src/features/player`, `src/features/payment`, `src/features/dashboard`).
2. **Granular Access Control**: Courses can be 100% Free, 100% Paid, or Hybrid (where foundational modules/lessons are free, and advanced production modules are locked behind course purchase).
3. **Strict Authentication & Security Boundary**:
   - Guests can explore roadmaps and preview free lessons.
   - **No progress tracking without login**: Attempting to track progress or check off tasks prompts login.
   - **No purchasing without login**: Purchases strictly require an authenticated Supabase session.
   - **Server-Side Paywall Enforcement**: Protected video streaming URLs, downloadable solution source code, and advanced lab materials are guarded at the Next.js API / Server Component layer and validated against Supabase RLS. Client-side inspection cannot bypass paywalls.
4. **Payment Gateway**: **Razorpay** integration with server-side HMAC-SHA256 cryptographic signature verification and webhook reconciliation.
5. **Data & Auth Backend**: **Supabase** (Supabase Auth + Supabase PostgreSQL with Row Level Security + Supabase Storage for assets) paired with **Next.js App Router** as the unified API layer.
6. **No Certificates**: Removed from scope to focus 100% on high-leverage skill acquisition and verified task execution.

---

## 2. User Personas & Access Rules

### 2.1 Personas
* **Guest Explorer (Unauthenticated)**: Can browse the roadmap graph, view course syllabi, and consume free public lessons. Progress is neither recorded nor synced until account creation.
* **Registered Free Learner**: Authenticated via Supabase Auth. Has full roadmap progress tracking, can complete all free lessons and tasks, maintains streaks and notes.
* **Pro Enrolled Learner**: Authenticated user who has completed a Razorpay purchase for one or more paid/hybrid courses. Unlocks full HD video streams, private repos, client ADRs, and advanced workshop solutions.

### 2.2 Permissions Matrix

| Feature / Action | Unauthenticated Guest | Logged-in Free User | Enrolled / Paid User |
| :--- | :---: | :---: | :---: |
| **Browse Visual Roadmap** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Read Free Topic Primers** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Track Progress / Check Off Tasks** | 🔒 Blocked (Prompts Login) | ✅ Yes (Saves to DB) | ✅ Yes (Saves to DB) |
| **Watch Free Lessons** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Access Paid Lessons & Video Streams** | 🔒 Paywall Banner | 🔒 Paywall Banner | ✅ Full Unlocked Access |
| **Initiate Checkout** | 🔒 Blocked (Requires Login) | ✅ Allowed (Razorpay) | ✅ Already Enrolled |
| **Download Source Code & Solution Zips** | ❌ No | ❌ No | ✅ Yes (Signed URL) |
| **Personal Notes & Lesson Bookmarks** | ❌ No | ✅ Yes | ✅ Yes |

---

## 3. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser / Mobile Web)                         │
│   Next.js 16 App Router (React 19 Server & Client Components, TailwindCSS v4)   │
└──────────────────────────┬─────────────────────────────┬────────────────────────┘
                           │                             │
               HTTP / Server Actions            Razorpay Checkout Modal
                           │                             │
                           ▼                             ▼
┌────────────────────────────────────────────────┐  ┌─────────────────────────────┐
│                 NEXT.JS BACKEND                │  │      RAZORPAY GATEWAY       │
│  - App Router Route Handlers (/api/*)          │  │  - Order Creation API       │
│  - Server Actions (Mutations & Auth Handlers)  │◀─┼──- Webhook Signature Check  │
│  - Entitlement & Paywall Middleware Validator  │  │  - Payment Verification     │
└──────────────────────────┬─────────────────────┘  └─────────────────────────────┘
                           │
                 Supabase SSR SDK Client
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               SUPABASE CLOUD / BACKEND                          │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐  │
│  │     Supabase Auth     │ │  Supabase PostgreSQL  │ │   Supabase Storage    │  │
│  │  - Email/Password     │ │  - Users & Profiles   │ │  - Course Thumbnails  │  │
│  │  - OAuth (GitHub/Ggl) │ │  - Courses & Lessons  │ │  - Architecture SVGs  │  │
│  │  - JWT & Sessions     │ │  - Orders & Purchases │ │  - Solution Source    │  │
│  │                       │ │  - RLS Policies       │ │    Archives (Signed)  │  │
│  └───────────────────────┘ └───────────────────────┘ └───────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Feature-Driven Codebase Architecture (`src/features`)

To ensure maximum scalability and maintainability, the codebase adheres strictly to **Feature-Driven Architecture**. Business logic, UI components, hooks, services, and types are modularized by domain.

```
src/
├── app/                                  # Next.js 16 App Router (Routing Skeleton Only)
│   ├── (auth)/                           # Auth route group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (marketing)/
│   │   ├── page.tsx                      # Landing page
│   │   └── pricing/page.tsx
│   ├── (platform)/                       # Authenticated app shell
│   │   ├── layout.tsx                    # Shared top navigation & progress ring
│   │   ├── dashboard/page.tsx            # Learner home
│   │   ├── roadmap/
│   │   │   ├── page.tsx                  # Interactive 21-section roadmap
│   │   │   └── [sectionSlug]/page.tsx
│   │   └── courses/
│   │       ├── page.tsx                  # Course catalog
│   │       └── [courseSlug]/
│   │           ├── page.tsx              # Course syllabus & enrollment
│   │           └── learn/
│   │               └── [lessonSlug]/page.tsx # Multi-modal lesson player
│   └── api/
│       ├── payment/
│       │   ├── create-order/route.ts     # Razorpay order creator
│       │   ├── verify/route.ts           # HMAC-SHA256 payment verification
│       │   └── webhook/route.ts          # Razorpay webhook listener
│       └── progress/route.ts             # Progress save handler
│
├── features/                             # ─── CORE FEATURE DOMAINS ───
│   ├── auth/                             # Authentication Domain
│   │   ├── components/                   # LoginForm, SignupForm, AuthModal, UserMenu
│   │   ├── hooks/                        # useAuth, useSession
│   │   ├── services/                     # authService.ts (Supabase auth client)
│   │   └── types/                        # AuthUser, SessionState
│   │
│   ├── roadmap/                          # Roadmap Domain
│   │   ├── components/                   # RoadmapGraph, SectionCard, TopicCard, TaskDrawer
│   │   ├── hooks/                        # useRoadmapFilter, useRoadmapProgress
│   │   ├── services/                     # roadmapService.ts
│   │   └── types/                        # RoadmapSection, RoadmapTopic, RoadmapTask
│   │
│   ├── courses/                          # Courses Catalog & Syllabus Domain
│   │   ├── components/                   # CourseGrid, CourseCard, SyllabusTree, PriceBadge
│   │   ├── hooks/                        # useCourses, useCourseDetails
│   │   ├── services/                     # courseService.ts
│   │   └── types/                        # Course, Module, Lesson, CourseTier
│   │
│   ├── player/                           # Multi-Modal Lesson Player Domain
│   │   ├── components/                   # VideoPlayer, LessonTabs, CodeSandbox, TaskWorkshop
│   │   ├── hooks/                        # useVideoPlayer, useLessonProgress
│   │   ├── services/                     # playerService.ts
│   │   └── types/                        # PlayerState, TabType, WorkshopSolution
│   │
│   ├── payment/                          # Razorpay Payment & Paywall Domain
│   │   ├── components/                   # PaywallBanner, RazorpayButton, CheckoutModal
│   │   ├── hooks/                        # useRazorpayCheckout, useEntitlement
│   │   ├── services/                     # paymentService.ts, razorpayClient.ts
│   │   └── types/                        # RazorpayOrder, PaymentVerification, Entitlement
│   │
│   ├── dashboard/                        # Learner Dashboard Domain
│   │   ├── components/                   # StreakCounter, RecentLessonsCard, StatsOverview
│   │   ├── hooks/                        # useDashboardMetrics
│   │   └── services/                     # dashboardService.ts
│   │
│   └── shared/                           # Cross-Cutting Reusable Primitives
│       ├── components/                   # Button, Card, Modal, Input, Badge, Skeleton, Tabs
│       ├── hooks/                        # useDebounce, useMediaQuery, useLocalStorage
│       └── utils/                        # formatCurrency, cn (classnames), dateHelpers
│
├── lib/
│   ├── supabase/                         # Supabase Server & Client SDK configuration
│   │   ├── client.ts                     # Browser client (`createBrowserClient`)
│   │   ├── server.ts                     # Server client (`createServerClient` with cookies)
│   │   └── middleware.ts                 # Session refresh middleware
│   └── razorpay/
│       └── server.ts                     # Razorpay backend SDK instance & crypto verify
│
└── types/                                # Global / Ambient Types
    └── database.types.ts                 # Auto-generated Supabase database types
```

---

## 5. Security & Paywall Specification

### 5.1 Free vs. Paid Access Granularity
1. **Course Level (`tier`)**:
   - `FREE`: 100% of modules and lessons are free to all authenticated users.
   - `PAID`: Requires payment to access non-preview lessons.
   - `HYBRID`: Introductory modules (e.g. Module 1) are free; advanced modules require purchase.
2. **Lesson Level (`is_free`)**:
   - Every lesson has an explicit boolean `is_free`.
   - If `course.tier === 'FREE'` OR `lesson.is_free === true`, the lesson is unlocked for any logged-in user.
   - If `course.tier !== 'FREE'` AND `lesson.is_free === false`, the lesson is strictly locked until the user has an active record in `user_course_access`.

### 5.2 Server-Side Security Enforcement
* **No Leaked Media URLs**: Video streaming URLs (Mux / signed streaming manifests) and solution code downloads are **never sent to the client** if the user lacks entitlement.
* **Server Action / API Gate**: When fetching lesson content for `/courses/[courseSlug]/learn/[lessonSlug]`:
  ```typescript
  // Server-side paywall validation
  const session = await getSupabaseSession();
  if (!session) {
    if (!lesson.is_free) throw new UnauthorizedError("Authentication required");
  } else {
    const hasAccess = await checkCourseAccess(session.user.id, course.id);
    if (!lesson.is_free && !hasAccess) {
      // Return redacted preview payload only; NEVER return video stream or solution code
      return {
        ...lesson,
        videoUrl: null,
        solutionCode: null,
        isLocked: true
      };
    }
  }
  ```
* **Row-Level Security (RLS)**:
  - Table `user_course_access` allows users to select only where `auth.uid() = user_id`.
  - Table `lesson_progress` allows inserts/updates only where `auth.uid() = user_id`.
  - Tables `orders` and `payments` are strictly read-only for the owning user and writeable only via Next.js Service Role API key.

---

## 6. Razorpay Payment Workflow

### 6.1 End-to-End Transaction Flow
1. **Purchase Trigger**:
   - Authenticated user clicks "Enroll Now / Buy Course" (₹1,499 / $19).
   - If user is not authenticated, the app intercepts and opens the Auth Modal.
2. **Order Creation (`POST /api/payment/create-order`)**:
   - Next.js Route Handler validates user session.
   - Checks if user already owns the course; if yes, returns error.
   - Calls Razorpay Orders API (`razorpay.orders.create({ amount, currency: "INR", receipt, notes })`).
   - Inserts pending record into `orders` table in Supabase.
   - Returns `order_id`, `amount`, `currency`, and Razorpay public key ID to client.
3. **Razorpay Modal Checkout**:
   - Client loads Razorpay checkout script (`checkout.razorpay.com/v1/checkout.js`).
   - Opens checkout modal with prefilled user email and name.
   - User pays via UPI, Credit/Debit Card, Netbanking, or Wallet.
4. **Server Verification (`POST /api/payment/verify`)**:
   - Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
   - Client sends these tokens to `/api/payment/verify`.
   - Next.js server validates cryptographic signature:
     ```typescript
     const generatedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
       .update(`${orderId}|${paymentId}`)
       .digest("hex");
     
     if (generatedSignature !== razorpay_signature) {
       throw new Error("Invalid signature: Potential fraud attempt");
     }
     ```
   - On valid signature:
     - Updates `orders` status to `COMPLETED`.
     - Inserts entitlement into `user_course_access (user_id, course_id, payment_id)`.
     - Returns success response.
5. **Webhook Fallback (`POST /api/payment/webhook`)**:
   - Listens for `order.paid` and `payment.captured` events from Razorpay.
   - Verifies `X-Razorpay-Signature` against `RAZORPAY_WEBHOOK_SECRET`.
   - Guarantees entitlement is unlocked even if user closed browser before frontend redirect.

---

## 7. Supabase Database Schema (PostgreSQL DDL)

```sql
-- 1. Profiles (Extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PAID', 'HYBRID')),
  price_in_inr INTEGER DEFAULT 0, -- In paise or INR (e.g. 149900 = ₹1,499)
  roadmap_section_id TEXT,        -- Links to section in roadmap (e.g. 'react-next')
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours NUMERIC(4, 1),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Modules
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lessons
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,  -- True for free previews / hybrid tier
  video_url TEXT,                 -- Protected video streaming URL / ID
  duration_seconds INTEGER DEFAULT 0,
  markdown_content TEXT NOT NULL, -- Text guide & diagrams
  starter_code TEXT,              -- Copyable template
  solution_code TEXT,             -- Complete working solution (Protected)
  expected_output TEXT,           -- Terminal log output
  task_id TEXT,                   -- Linked roadmap task ID (e.g. 't-react-1')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

-- 5. User Course Access (Entitlements)
CREATE TABLE public.user_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  razorpay_payment_id TEXT,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- 6. Orders & Transactions
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id),
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  amount_in_inr INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Lesson Progress
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  last_position_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 8. Roadmap Task Progress
CREATE TABLE public.task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,          -- e.g. 't-cs-1', 't-react-1'
  status TEXT DEFAULT 'done' CHECK (status IN ('done', 'in-progress')),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read public profile data and update their own
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Courses & Modules: Published courses are readable by all
CREATE POLICY "Published courses readable" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Modules readable" ON public.modules FOR SELECT USING (true);

-- Lessons: Public metadata readable; content governed via app query
CREATE POLICY "Lessons readable" ON public.lessons FOR SELECT USING (true);

-- User Course Access: Users can see only their own access passes
CREATE POLICY "Users view own access" ON public.user_course_access FOR SELECT USING (auth.uid() = user_id);

-- Orders: Users can see only their own orders
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Progress: Users can select and modify only their own progress
CREATE POLICY "Users manage own lesson progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own task progress" ON public.task_progress FOR ALL USING (auth.uid() = user_id);
```

---

## 8. Multi-Modal Lesson Player Specifications

The lesson player at `/courses/[courseSlug]/learn/[lessonSlug]` is built inside `src/features/player/components/`:

1. **Header Bar**:
   - Back to Syllabus link.
   - Course title and lesson position (e.g., `Module 2 • Lesson 3 of 8`).
   - "Mark as Complete" button (disabled if unauthenticated with tooltip: "Sign in to track progress").
2. **Top Tier: Responsive Media Area**:
   - If lesson has video: Custom HTML5 / Streaming Video Player with speed toggle, playback progress bar, and fullscreen toggle.
   - If locked: Renders `PaywallBanner` with course price, preview timer, and Razorpay "Unlock Now" button.
3. **Bottom Tier: 4 Multi-Modal Tabs**:
   - **Tab 1: 📖 Concept & Guide**: Long-form rich markdown with syntax-highlighted code blocks, copy buttons, and visual architecture diagrams.
   - **Tab 2: 🖼️ Architecture & Diagrams**: Full-width interactive diagrams and data flow diagrams.
   - **Tab 3: 🛠️ Hands-on Workshop**:
     - Client scenario.
     - Starter code & mock input data.
     - Step-by-step instructions.
     - Expandable complete working solution (locked if paid lesson and unpurchased).
     - Expected console / terminal output.
     - Interactive 4-point verification checklist.
   - **Tab 4: 📝 Notes & Reflection**: Private scratchpad stored per user in Supabase.

---

## 9. Phased Implementation Roadmap

### Phase 1: Feature Architecture & Mock Engine (Current Sprint)
- [ ] Establish feature folder layout (`src/features/{auth, roadmap, courses, player, payment, dashboard, shared}`).
- [ ] Port the complete 21-section FDE curriculum and tasks into typed models (`src/features/roadmap/types`, `src/features/courses/types`).
- [ ] Build `/roadmap` visual timeline and slide-over task workshop drawer with local interactive state.
- [ ] Build `/courses` catalog with Free, Paid, and Hybrid filter pills.
- [ ] Build the Multi-Modal Lesson Player (`/courses/[courseSlug]/learn/[lessonSlug]`) with Video, Markdown, Diagrams, and Tasks.
- [ ] Implement client-side Auth Modal & Paywall Banner prototypes.

### Phase 2: Supabase Integration (Auth, Database & Progress)
- [ ] Configure Supabase client in `src/lib/supabase/` (`client.ts`, `server.ts`, `middleware.ts`).
- [ ] Create Supabase migration script with PostgreSQL tables and RLS policies.
- [ ] Implement Auth feature (`LoginForm`, `SignupForm`, session cookies, route protection).
- [ ] Wire up authenticated progress tracking (`lesson_progress`, `task_progress`).

### Phase 3: Razorpay Integration & Server Paywall Enforcement
- [ ] Set up Razorpay client (`src/lib/razorpay/server.ts`).
- [ ] Build Order Creation API (`/api/payment/create-order`) and Signature Verification API (`/api/payment/verify`).
- [ ] Integrate client checkout modal (`src/features/payment/components/RazorpayButton.tsx`).
- [ ] Implement Webhook reconciliation handler (`/api/payment/webhook`).
- [ ] Lock down protected video URLs and solution code behind server-side access validator.

### Phase 4: Learner Dashboard & Production Hardening
- [ ] Build `/dashboard` with active course resumes, task completion ring, and streak tracking.
- [ ] Add Supabase Storage signed URLs for downloadable project starter repos.
- [ ] Perform end-to-end security audit and penetration test on paywall endpoints.
