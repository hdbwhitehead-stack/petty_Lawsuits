# Plan 4.5: Auth Flow & Document Management Fixes

**Goal:** Fix the broken authentication flow and document management architecture that currently prevents users from completing the wizard → sign-up → payment funnel.

**Status:** Required before Plan 5 (Email & Polish). Several of these issues are revenue-blocking — users who complete the wizard cannot currently pay because the sign-up gate doesn't exist and the checkout returns a silent 401.

**Depends on:** Plans 1, 2 & 3

---

## Diagnosis: What's Broken

### 1. No sign-up gate between preview and payment (revenue-blocking)

**Spec says:** "Sign-up gate fires here — prompted to create a free account before payment."

**What actually happens:** The `UnlockModal` appears immediately on the preview page and clicking a tier calls `/api/checkout` directly. The checkout API returns `401 Not authenticated` for unauthenticated users. `UnlockTierCard.tsx` handles this with `alert(data.error || 'Checkout failed')` — the user gets a raw browser alert saying "Not authenticated" with zero guidance on what to do next. There is no sign-up gate anywhere in the codebase.

---

### 2. No Supabase auth callback route (auth-breaking)

After email/password signup, Supabase sends a verification email. When the user clicks the link, Supabase redirects to `/auth/callback?code=...` to exchange the code for a session. **This route does not exist.** Email verification currently 404s. No user who signs up via email can ever log in.

---

### 3. Anonymous document is never claimed after signup (funnel-breaking)

The `anonymous_key` is correctly stored on documents generated without auth. After signup the user is sent to `/verify`. After verifying (which currently 404s), there is no code anywhere that:
- Reads the `anonymous_key` from `localStorage`
- Claims the document by setting its `user_id`
- Redirects the user back to their document

`clearAnonKey()` in `lib/anonymous.ts` exists but is never called.

---

### 4. Post-login redirect always goes to `/dashboard`, losing document context

- Login page: `router.push('/dashboard')` on success — hard-coded
- Google OAuth: `redirectTo: ${location.origin}/dashboard` — hard-coded
- Middleware redirects unauthenticated users to `/login` but passes no `?returnTo=` parameter

Result: A user who does the wizard → hits the preview paywall → is prompted to sign in → signs in → lands on the empty dashboard with no idea their document is waiting.

---

### 5. Header has no auth state

The header is always static — it shows "Get Started" regardless of whether the user is logged in. There is no:
- Login link
- "My Documents" / dashboard link
- User avatar or account menu
- Logout option

Logged-in users have no navigation path back to their documents other than typing `/dashboard` manually.

---

### 6. Preview page has no ownership check

The preview page query is:
```ts
supabase.from('documents').select('*').eq('id', params.documentId).single()
```
There is no `.eq('user_id', user.id)` filter. Any document can be viewed by anyone who knows (or guesses) the UUID — including other people's documents.

---

### 7. No "resume your document" mechanism

The spec says: "If they close the browser before verifying, the UUID persists in `localStorage` — on next visit the app detects it, prompts login/verification, and resumes the payment flow."

Nothing on the homepage, login page, or any other route checks for a pending `anonymous_key` in `localStorage` and prompts the user to resume. An anonymous document is silently abandoned the moment the user closes the tab.

---

### 8. Dashboard shows unhelpful document titles

The dashboard lists documents with only `category` and `state` (e.g., "Debt & Money · NSW"). There's no indication of who the claim is against or what it's about, making it hard for a returning user to identify their document.

---

## File Structure

```
app/
├── auth/
│   └── callback/
│       └── route.ts               # NEW: Supabase auth code exchange + document claim
├── (auth)/
│   ├── login/
│   │   └── page.tsx               # FIX: returnTo param, resume banner
│   └── signup/
│       └── page.tsx               # FIX: preserve documentId before redirecting to verify
├── (main)/
│   ├── preview/
│   │   └── [documentId]/
│   │       └── page.tsx           # FIX: ownership check, auth gate on unlock
│   └── dashboard/
│       └── page.tsx               # FIX: show recipient name in document list
components/
├── layout/
│   └── Header.tsx                 # FIX: show auth state (login/dashboard/logout)
└── payment/
    └── UnlockModal.tsx            # FIX: check auth before showing checkout, show sign-up prompt
lib/
└── anonymous.ts                   # FIX: add claimAnonDocument() helper
```

---

## Tasks

### Task 1: Supabase auth callback route

This is the most critical fix — without it, email verification is broken entirely.

- [ ] Create `app/auth/callback/route.ts`:
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'

  export async function GET(req: NextRequest) {
    const { searchParams, origin } = new URL(req.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        // Redirect to the intended destination (e.g. the preview page)
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    // Fallback on error
    return NextResponse.redirect(`${origin}/login?error=verification_failed`)
  }
  ```

- [ ] In Supabase dashboard → Auth → URL Configuration, set the **Site URL** to `https://petty-lawsuits.vercel.app` and add `https://petty-lawsuits.vercel.app/auth/callback` to the **Redirect URLs** list. Also add `http://localhost:3000/auth/callback` for local dev.

- [ ] Test: sign up with email, click verification link, confirm you are redirected to `/dashboard` (or `/preview/[id]` once the next task is done) rather than 404ing.

- [ ] Commit: `git commit -m "feat: add Supabase auth callback route for email verification"`

---

### Task 2: Anonymous document claim

- [ ] Add a `claimAnonDocument` helper to `lib/anonymous.ts`:
  ```ts
  export async function claimAnonDocument(supabase: SupabaseClient, userId: string): Promise<string | null> {
    if (typeof window === 'undefined') return null
    const key = localStorage.getItem(KEY)
    if (!key) return null

    const { data } = await supabase
      .from('documents')
      .update({ user_id: userId, anonymous_key: null })
      .eq('anonymous_key', key)
      .is('user_id', null)
      .select('id')
      .single()

    if (data?.id) {
      clearAnonKey()
      return data.id
    }
    return null
  }
  ```

- [ ] Update `app/auth/callback/route.ts` to claim the anonymous document after successful code exchange. Because this runs server-side, the `anonymous_key` must be passed as a query parameter from the signup page rather than read from `localStorage`. Update the callback to:
  - Accept `?anon_key=...` in the URL (passed by the signup page, explained in Task 3)
  - If present, run the claim query against the documents table
  - Redirect to `/preview/[documentId]` if a document was claimed, otherwise to `?next=` param or `/dashboard`

- [ ] Commit: `git commit -m "feat: implement anonymous document claim on email verification"`

---

### Task 3: Sign-up gate on the preview page

The spec says the sign-up gate fires **after** the wizard is complete but **before** payment. The current implementation has no such gate.

- [ ] Modify `app/(main)/preview/[documentId]/page.tsx`:
  - Fetch the authenticated user from Supabase
  - Pass `isAuthenticated: boolean` as a prop to `UnlockModal`

- [ ] Modify `components/payment/UnlockModal.tsx` to:
  - Accept an `isAuthenticated: boolean` prop
  - If `!isAuthenticated`, show a sign-up/login prompt **instead of** the tier cards:
    - Heading: "Almost there — create a free account to unlock your letter"
    - Two CTAs: "Create account" (→ `/signup?documentId=[id]`) and "Log in" (→ `/login?returnTo=/preview/[id]`)
    - Brief reassurance: "Your document is saved. You can return any time."
  - If `isAuthenticated`, show the tier cards as today

- [ ] Update `app/(auth)/signup/page.tsx` to:
  - Read `?documentId=` from the URL params
  - Store it in a hidden field or state
  - After successful signup, redirect to `/verify?documentId=[id]&anon_key=[key]` so the callback can claim the document

- [ ] Update `app/auth/callback/route.ts` (from Task 1) to:
  - Accept `?documentId=` and `?anon_key=` params passed through the verification email's `?next=` URL
  - After exchanging the code, claim the anonymous document using the `anon_key`
  - Redirect to `/preview/[documentId]` (so the user lands right back at the paywall, now authenticated)

  **How to pass these through the verification link:** When calling `supabase.auth.signUp()`, pass `emailRedirectTo` with the full callback URL including params:
  ```ts
  const redirectTo = `${origin}/auth/callback?next=/preview/${documentId}&anon_key=${anonKey}`
  await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } })
  ```

- [ ] Commit: `git commit -m "feat: add sign-up gate on preview page and document claim flow"`

---

### Task 4: `returnTo` support for login

- [ ] Update middleware to append `?returnTo=<encoded path>` when redirecting to login:
  ```ts
  if (isProtected && !user) {
    const returnTo = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(new URL(`/login?returnTo=${returnTo}`, request.url))
  }
  ```

- [ ] Update `app/(auth)/login/page.tsx` to:
  - Read `?returnTo=` from URL search params
  - After successful email/password login, `router.push(returnTo || '/dashboard')`
  - For Google OAuth, pass `returnTo` through the OAuth `redirectTo`:
    ```ts
    const callbackUrl = returnTo
      ? `${origin}/auth/callback?next=${encodeURIComponent(returnTo)}`
      : `${origin}/dashboard`
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callbackUrl } })
    ```

- [ ] Commit: `git commit -m "feat: add returnTo redirect support for login flow"`

---

### Task 5: Header auth state

- [ ] Convert `components/layout/Header.tsx` from a pure client component to a pattern that reads auth state. Options:
  - **Option A (recommended):** Keep Header client-side, add a `useEffect` that calls `supabase.auth.getUser()` on mount and sets a `user` state. Show "Log in" / "Dashboard" / logout link based on that state.
  - **Option B:** Move auth state into the parent server layout and pass it down as props.

  Option A is simpler and avoids refactoring the layout:
  ```tsx
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])
  ```

- [ ] Update the desktop nav to show:
  - When **not** logged in: existing links + "Log in" (link to `/login`) + "Get Started" button
  - When **logged in**: existing links + "My Documents" (link to `/dashboard`) + account dropdown or "Log out" text link

- [ ] Add a `handleLogout` function that calls `supabase.auth.signOut()` and redirects to `/`

- [ ] Update the mobile menu to match

- [ ] Commit: `git commit -m "feat: add auth state to header (login/dashboard/logout)"`

---

### Task 6: Preview page ownership check

- [ ] Update `app/(main)/preview/[documentId]/page.tsx`:
  - Fetch the current user
  - If the user is authenticated, add `.or('user_id.eq.' + user.id + ',user_id.is.null')` to the document query (to allow both owned docs and as-yet-unclaimed anonymous docs)
  - If the document belongs to a different user, show a "Document not found" page (don't leak document content to non-owners)

  Note: Anonymous docs (with no `user_id`) should still be viewable by anyone who has the UUID — this is intentional, as the UUID is the access token before sign-up.

- [ ] Commit: `git commit -m "fix: add ownership check to preview page"`

---

### Task 7: Dashboard document titles

- [ ] Update the `documents` query in `app/(main)/dashboard/page.tsx` to also select `current_content`:
  ```ts
  .select('id, state, category, status, unlocked, created_at, current_content')
  ```

- [ ] In the document card, extract a recipient name from `current_content` (same logic as the preview page):
  ```ts
  const content = doc.current_content as Record<string, string> ?? {}
  const recipient = content.debtor_name ?? content.business_name ?? content.landlord_name ?? content.employer_name ?? null
  ```

- [ ] Show it in the card: e.g., **"Demand Letter to [Recipient]"** as the primary title, with category and state as secondary text

- [ ] Commit: `git commit -m "fix: show recipient name in dashboard document list"`

---

### Task 8: Resume banner for returning anonymous users

The spec says: "on next visit the app detects it, prompts login/verification, and resumes the payment flow."

- [ ] Create a client component `components/layout/ResumeBanner.tsx` that:
  - On mount, checks `localStorage` for the `petty_anon_doc_key`
  - If found, calls a lightweight API route `GET /api/documents/anon-status?key=[key]` that returns the document's `id` and `status` (no sensitive content)
  - If the document exists and `status === 'ready'`, shows a dismissible banner:
    > "You have an unfinished document. [Continue to document →]" which links to `/preview/[documentId]`

- [ ] Add `ResumeBanner` to the main layout (`app/(main)/layout.tsx`) so it appears on the homepage and other marketing pages

- [ ] Create `GET /api/documents/anon-status/route.ts`:
  ```ts
  // Returns { id, status } for an anonymous document by key
  // Returns 404 if not found
  // Never returns document content
  ```

- [ ] Commit: `git commit -m "feat: add resume banner for returning anonymous users"`

---

### Task 9: End-to-end funnel test

- [ ] **Anonymous → email signup flow:** Complete wizard (not logged in) → land on preview with sign-up gate → sign up → receive email → click verification link → land back on preview (authenticated) → tier cards visible → confirm checkout works
- [ ] **Anonymous → Google login flow:** Complete wizard → preview sign-up gate → "Log in" → Google OAuth → land back on preview → document claimed → checkout works
- [ ] **Returning user flow:** Close browser after wizard → return to site → see resume banner → click → land on preview → sign in → document is there
- [ ] **Logged-in user flow:** Already logged in → complete wizard → land on preview with tier cards immediately (no sign-up gate) → pay → unlock
- [ ] **Header state:** Verify login/dashboard/logout show correctly when logged in vs. out
- [ ] Push: `git push origin main`

---

## Summary of changes by file

| File | Change |
|---|---|
| `app/auth/callback/route.ts` | **NEW** — Supabase code exchange, document claim, redirect logic |
| `app/(auth)/login/page.tsx` | Add `returnTo` redirect, resume banner detection |
| `app/(auth)/signup/page.tsx` | Pass `documentId` + `anonKey` into verification email redirect |
| `app/(main)/preview/[documentId]/page.tsx` | Pass auth state to modal, add ownership filter |
| `app/(main)/dashboard/page.tsx` | Add recipient name to document cards |
| `app/api/documents/anon-status/route.ts` | **NEW** — anonymous document status lookup |
| `components/layout/Header.tsx` | Add auth state, login/dashboard/logout links |
| `components/layout/ResumeBanner.tsx` | **NEW** — returning anonymous user prompt |
| `components/payment/UnlockModal.tsx` | Show sign-up prompt when unauthenticated |
| `lib/anonymous.ts` | Add `claimAnonDocument()` helper |
| `middleware.ts` | Append `?returnTo=` on protected route redirect |

---

**Plan 4.5 complete when:** A user can complete the full funnel from wizard → sign-up → email verification → land back on preview → pay; and returning anonymous users are prompted to resume their document on next visit.
