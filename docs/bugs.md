# Bug Tracker

Open issues found during testing. Each bug includes the affected area, description, and proposed fix.

---

## Open Bugs

### BUG-003 — Preview/document "X" button navigates to wizard instead of dashboard

**Affected plan:** Plan 4.5 (Auth Flow & Document Management)
**Severity:** Medium — broken navigation flow

**What happens:**
On the "Your Letter Is Ready" screen (preview or document page), clicking the X / close button takes the user back to the wizard (`/wizard`) instead of to their dashboard (`/dashboard`). This is the same navigation issue as BUG-002 but on a different button — the `?from=dashboard` query param fix only applied to the browser back button / link, not the X close button.

**Proposed fix:**
- Find the X / close button on the preview and document pages
- Check for the `from=dashboard` query param (or similar) and route accordingly
- Default destination should be `/dashboard` for logged-in users, `/wizard` for anonymous users

---

### BUG-004 — Google OAuth login blocked with "org_internal" error

**Affected plan:** Plan 1 (Foundation)
**Severity:** High — blocks Google sign-in for all external users

**What happens:**
When a user clicks "Continue with Google" on the login or signup page, Google shows: "Access blocked: Petty Lawsuits can only be used within its organization" (Error 403: org_internal).

**Root cause:**
The Google Cloud OAuth consent screen is set to "Internal" (only allows users within the Google Workspace organisation). It needs to be switched to "External" so any Google account can sign in.

**Fix (manual, not code):**
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Change User type from "Internal" to "External"
3. Submit for verification if required (or add test users during development)

---

## Resolved Bugs

### BUG-001 — Wizard "Start Over" discards user input; drafts show as "Ready" not "Draft"

**Affected plan:** Plan 2 (Wizard & Generation)
**Severity:** Medium — poor UX, data loss
**Status:** RESOLVED (2026-04-06)

**What happened:**
Pressing "Start Over" in the wizard cleared all inputted text with no way to recover it. Documents that had been saved but not yet unlocked/paid displayed "Ready" instead of "Draft" on the My Documents page.

**Fix:** Status label fix shipped in `ba96695`. Save Draft feature built: Save Draft button in wizard (signed-in users only), "Save before starting over?" confirmation dialog, draft API route (`/api/documents/draft`), and draft resume from dashboard via `/wizard?draft={id}`.

---

### BUG-002 — Navigating back from "Your Letter Is Ready" goes to wizard instead of My Documents

**Affected plan:** Plan 4.5 (Auth Flow & Document Management)
**Severity:** Medium — broken navigation flow
**Status:** RESOLVED in `ba96695` (2026-04-06)

**What happened:**
When a user opened a letter from the My Documents page, clicking back navigated to the wizard (`/wizard`) instead of returning to My Documents.

**Fix:** Back navigation from preview/document pages now correctly returns to the dashboard.
