# Plan 1: Foundation

**Goal:** Bootstrap the Next.js project with working authentication, database schema, and basic routing — producing a live, deployable app on Vercel where users can sign up, log in, and reach a protected dashboard.

**Architecture:** Next.js 14 App Router with TypeScript and Tailwind CSS. Supabase handles authentication (email/password + Google OAuth) and the PostgreSQL database. Middleware protects authenticated routes. Anonymous documents are keyed to a `localStorage` UUID so wizard progress survives without an account.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase, Playwright (end-to-end tests), Vercel

**Deliverable:** A live URL where a user can sign up, verify their email, log in, and reach a dashboard. Nothing else — no wizard, no documents yet.

---

## File structure

```
/
├── README.md
├── .env.local                          # Local env vars (never committed)
├── middleware.ts                        # Protects /dashboard and /document routes
├── app/
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Homepage
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify/page.tsx              # "Check your inbox" holding screen
│   └── dashboard/
│       └── page.tsx                     # Protected dashboard shell
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
├── lib/
│   └── supabase/
│       ├── client.ts                    # Browser Supabase client
│       ├── server.ts                    # Server Supabase client (for API routes + middleware)
│       └── types.ts                     # Database type definitions
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql       # Documents, subscriptions, generation_attempts tables
```

---

## Tasks

### Task 1: Initialise the project

- [ ] In your terminal, navigate to where you want the project: `cd /Users/harry/Documents/Claude/ClaudeCode`
- [ ] Run: `npx create-next-app@14 petty_lawsuits --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"`
- [ ] When prompted, accept all defaults
- [ ] Navigate into the project: `cd petty_lawsuits`
- [ ] Install Supabase client: `npm install @supabase/supabase-js @supabase/ssr`
- [ ] Install Playwright for end-to-end tests: `npm install --save-dev @playwright/test && npx playwright install chromium`
- [ ] Commit: `git add -A && git commit -m "feat: initialise Next.js project"`

---

### Task 2: Connect to Supabase

- [ ] Go to [supabase.com](https://supabase.com), create a new project called `petty-lawsuits`
- [ ] In Supabase dashboard → Settings → API, copy your **Project URL** and **anon public key**
- [ ] Create `.env.local` at the project root with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```
- [ ] Create `lib/supabase/client.ts`:
  ```ts
  import { createBrowserClient } from '@supabase/ssr'

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```
- [ ] Create `lib/supabase/server.ts`:
  ```ts
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'

  export function createClient() {
    const cookieStore = cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add Supabase client setup"`

---

### Task 3: Database schema

- [ ] Create `supabase/migrations/001_initial_schema.sql`:
  ```sql
  -- Documents: core table for all generated documents
  CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    anonymous_key TEXT,              -- localStorage UUID for pre-auth docs
    state TEXT,                      -- AU state/territory (NSW, VIC, etc.) — inferred from location, may be null until generation
    category TEXT NOT NULL,          -- document category / claim type
    status TEXT NOT NULL DEFAULT 'generating',  -- generating | ready | failed | permanently_failed
    original_content JSONB,          -- Claude-generated field values (never overwritten)
    current_content JSONB,           -- User's current edits (overwritten on save)
    evidence_files JSONB DEFAULT '[]',  -- Array of { path, name, size } for Supabase Storage refs
    unlocked BOOLEAN DEFAULT FALSE,
    unlock_tier TEXT,                -- 'send' | 'full_petty' | 'subscription' — set at payment time
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Subscriptions: tracks active Stripe subscriptions per user
  CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'inactive',  -- active | inactive | past_due
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Generation attempts: for rate limiting (10 per user per 24h)
  CREATE TABLE generation_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Row Level Security: users can only see their own data
  ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
  ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE generation_attempts ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can manage their own documents"
    ON documents FOR ALL USING (auth.uid() = user_id);

  CREATE POLICY "Users can view their own subscription"
    ON subscriptions FOR ALL USING (auth.uid() = user_id);

  CREATE POLICY "Users can view their own generation attempts"
    ON generation_attempts FOR ALL USING (auth.uid() = user_id);
  ```
- [ ] In Supabase dashboard → SQL Editor, paste and run this migration
- [ ] Verify the three tables appear in Table Editor
- [ ] In Supabase dashboard → Storage, create two private buckets: `documents` (for generated PDF/Word exports) and `evidence` (for user-uploaded evidence files)
- [ ] Commit: `git add -A && git commit -m "feat: add initial database schema"`

---

### Task 4: Route middleware

- [ ] Create `middleware.ts` at the project root:
  ```ts
  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'

  const PROTECTED_ROUTES = ['/dashboard', '/document']

  export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const isProtected = PROTECTED_ROUTES.some(route =>
      request.nextUrl.pathname.startsWith(route)
    )

    if (isProtected && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return supabaseResponse
  }

  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
  }
  ```
- [ ] Write a Playwright test in `e2e/auth.spec.ts`:
  ```ts
  import { test, expect } from '@playwright/test'

  test('redirects unauthenticated user from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
  ```
- [ ] Run: `npx next dev` in one terminal, then in another: `npx playwright test e2e/auth.spec.ts`
- [ ] Verify the test passes
- [ ] Commit: `git add -A && git commit -m "feat: add auth middleware for protected routes"`

---

### Task 5: Auth pages

- [ ] In Supabase dashboard → Authentication → Providers, enable **Google OAuth** (you'll need a Google Cloud project — Supabase docs walk through this)
- [ ] In Supabase dashboard → Authentication → URL Configuration, set Site URL to `http://localhost:3000` for now
- [ ] Create `app/(auth)/signup/page.tsx`:
  ```tsx
  'use client'
  import { useState } from 'react'
  import { createClient } from '@/lib/supabase/client'
  import { useRouter } from 'next/navigation'

  export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const supabase = createClient()
    const router = useRouter()

    async function handleSignup(e: React.FormEvent) {
      e.preventDefault()
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); return }
      router.push('/verify')
    }

    async function handleGoogle() {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/dashboard` }
      })
    }

    return (
      <main className="max-w-sm mx-auto mt-20 p-6">
        <h1 className="text-2xl font-bold mb-6">Create your account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2" required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit"
            className="w-full bg-black text-white rounded px-3 py-2">
            Sign up
          </button>
        </form>
        <button onClick={handleGoogle}
          className="w-full mt-3 border rounded px-3 py-2">
          Continue with Google
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <a href="/login" className="underline">Log in</a>
        </p>
      </main>
    )
  }
  ```
- [ ] Create `app/(auth)/login/page.tsx` (same structure as signup but calls `signInWithPassword` and redirects to `/dashboard` on success)
- [ ] Create `app/(auth)/verify/page.tsx`:
  ```tsx
  export default function VerifyPage() {
    return (
      <main className="max-w-sm mx-auto mt-20 p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your inbox</h1>
        <p className="text-gray-600">
          We sent a verification link to your email. Click it to continue.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          You can close this tab and return after verifying.
        </p>
      </main>
    )
  }
  ```
- [ ] Add the Google logo to the "Continue with Google" button on both signup and login pages. Download the official Google G logo SVG from Google's branding guidelines and save it to `public/google-logo.svg`, then update the button:
  ```tsx
  <button onClick={handleGoogle}
    className="w-full mt-3 border rounded px-3 py-2 flex items-center justify-center gap-2">
    <img src="/google-logo.svg" alt="" className="w-5 h-5" />
    Continue with Google
  </button>
  ```
- [ ] Add a Playwright test to `e2e/auth.spec.ts` verifying the signup form renders and shows the verify page after submission (use a test email)
- [ ] Run: `npx playwright test e2e/auth.spec.ts`
- [ ] Commit: `git add -A && git commit -m "feat: add signup, login, and verify pages"`

---

### Task 6: Dashboard shell & homepage

- [ ] Create `app/dashboard/page.tsx`:
  ```tsx
  import { createClient } from '@/lib/supabase/server'
  import { redirect } from 'next/navigation'

  export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
      <main className="max-w-4xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold mb-2">Your documents</h1>
        <p className="text-gray-500 mb-8">You have no documents yet.</p>
        <a href="/wizard"
          className="bg-black text-white rounded px-4 py-2 inline-block">
          Create a document
        </a>
      </main>
    )
  }
  ```
- [ ] Replace `app/page.tsx` with a simple homepage:
  ```tsx
  export default function HomePage() {
    return (
      <main className="max-w-2xl mx-auto mt-20 p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Petty Lawsuits</h1>
        <p className="text-gray-600 mb-8">
          Generate legal documents for Australian disputes — without a lawyer.
        </p>
        <a href="/signup"
          className="bg-black text-white rounded px-6 py-3 inline-block text-lg">
          Get started
        </a>
      </main>
    )
  }
  ```
- [ ] Run the dev server and manually verify: homepage loads, signup works, verify page shows, login works, dashboard is reachable and protected
- [ ] Commit: `git add -A && git commit -m "feat: add homepage and dashboard shell"`

---

### Task 7: Deploy to Vercel

- [ ] Go to [vercel.com](https://vercel.com), sign in with GitHub
- [ ] Click "Add New Project" → import `hdbwhitehead-stack/petty_lawsuits`
- [ ] Add environment variables from `.env.local` in the Vercel project settings
- [ ] In Supabase → Authentication → URL Configuration, add your Vercel URL to "Redirect URLs"
- [ ] Deploy and verify the live URL works end-to-end (signup → verify → login → dashboard)
- [ ] Commit any config changes: `git add -A && git commit -m "chore: add Vercel deployment config"`
- [ ] Push: `git push origin main`

---

**Plan 1 complete when:** A live Vercel URL exists where a new user can sign up, verify their email, log in with email or Google, and reach a protected dashboard.
