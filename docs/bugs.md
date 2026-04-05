# Bug Tracker

Open issues found during testing. Each bug includes the affected area, description, and proposed fix.

---

## Open Bugs

### BUG-001 — Wizard "Start Over" discards user input; drafts show as "Ready" not "Draft"

**Affected plan:** Plan 2 (Wizard & Generation)
**Severity:** Medium — poor UX, data loss

**What happens:**
Pressing "Start Over" in the wizard clears all inputted text with no way to recover it. There is currently no concept of a saved draft — if a user loses their session or restarts, everything is gone.

Additionally, documents that have been saved but not yet unlocked/paid display a status of "Ready" in the My Documents page when they should display "Draft" (since the letter hasn't been finalised or paid for).

**Proposed fix:**
- Add a **Save Draft** button to the wizard, visible only to signed-in users. This persists the current wizard form state (defendant, claimant, incident, evidence fields) to Supabase against the user's account with a `draft` status.
- When a signed-in user presses "Start Over", prompt them first: *"Save as draft before starting over?"*
- On the My Documents page, documents in an incomplete/unpaid state should display status `Draft`, not `Ready`.
- Draft documents should be resumable — clicking a draft in My Documents should reload the wizard pre-filled with the saved data.

**Note:** This feature should be gated to signed-in users only. Guests who haven't created an account cannot save drafts.

---

### BUG-002 — Navigating back from "Your Letter Is Ready" goes to wizard instead of My Documents

**Affected plan:** Plan 4.5 (Auth Flow & Document Management)
**Severity:** Medium — broken navigation flow

**What happens:**
When a user opens a letter from the My Documents page and lands on the "Your Letter Is Ready" screen, clicking the back/exit button (or using browser back) navigates to the wizard (`/wizard`) instead of returning to My Documents (`/dashboard` or `/documents`).

**Expected behaviour:**
Exiting or navigating back from the letter-ready screen should always return the user to My Documents when they arrived there from My Documents.

**Proposed fix:**
- Pass a `?from=documents` query parameter (or similar) when navigating to the letter-ready screen from My Documents.
- On the letter-ready page, check the `from` param and set the back/exit destination accordingly: if `from=documents`, go to `/dashboard`; otherwise default to `/wizard`.
- Alternatively, use Next.js router history or a `returnTo` pattern consistent with the existing auth redirect logic in Plan 4.5.

---

## Resolved Bugs

*(None yet)*
