# Cease & Desist Letter Design

**Awaiting lawyer review before launch.**

> Status: design only. Implementation tracked in `docs/superpowers/plans/2026-05-02-plan-6-orchestration.md` Task 5. The next-steps blurb and the system-prompt safety language below are placeholders that must be reviewed and approved by a qualified Australian lawyer before this document type is exposed to public traffic.

---

## When a cease & desist is appropriate

A cease & desist letter is a formal written demand asking another party to stop a specified course of conduct. People in Australia commonly use one when they believe the recipient is:

- making defamatory statements about them
- harassing or threatening them
- using their copyrighted material, trademark, or trading name without permission
- continuing to breach a contract that requires them to stop a specified activity

This product does not provide legal advice. UI copy must consistently frame cease & desist as "a formal written demand to stop specified conduct" and explicitly note that effectiveness depends on the recipient's response and that escalation (injunctions, damages claims) requires independent legal advice. Avoid any language that promises a particular outcome.

## Wizard fields

Cease & desist reuses the existing four-step wizard (Defendant → Claimant → Incident → Evidence) with two relabels and one new optional field. **No new wizard step is added.**

| Step | Existing label | C&D label | Notes |
|---|---|---|---|
| 1 | Who are you making a claim against? | Who do you want to ask to stop? | Reuses all existing fields (defendant_type, names, contact, address). |
| 2 | About you | About you | No change. |
| 3 | What happened? | What conduct do you want stopped? | Reuses incident fields. The incident_description field carries the conduct narrative. |
| 4 | Upload evidence | Upload evidence | No change. Evidence requirements differ — see below. |

Step labels are picked from a per-category lookup so other doc types remain unchanged. If the wizard does not currently support per-category step labels, ship that lookup as part of this task.

New optional field on Step 3 (Incident): `cease_deadline_days` (number input, default 14). Stored alongside other answers.

## Template entry

Add a new entry to `TEMPLATES` in `lib/documents/templates.ts`:

```ts
{
  id: 'cease-and-desist',
  category: 'Cease & Desist',
  label: 'Cease & Desist Letter',
  description: 'Formally demand that someone stop a specified course of conduct.',
  fields: [
    { key: 'sender_name',       label: 'Your full name',                 type: 'text' },
    { key: 'recipient_name',    label: 'Recipient full name',            type: 'text' },
    { key: 'conduct_summary',   label: 'Conduct to cease (one line)',    type: 'text' },
    { key: 'conduct_recital',   label: 'Description of the conduct',     type: 'textarea' },
    { key: 'demand_paragraph',  label: 'The demand (cease and desist)',  type: 'textarea' },
    { key: 'deadline_date',     label: 'Date by which conduct must stop', type: 'date' },
    { key: 'consequences',      label: 'Consequences if not stopped',    type: 'textarea' },
    { key: 'sender_signature',  label: 'Sender signature block',         type: 'text' },
  ],
}
```

The `category` value `'Cease & Desist'` is what gets persisted in `documents.category`. No DDL changes.

## System prompt for cease & desist generation

`lib/claude/prompts.ts` currently builds a single generic prompt for all doc types. Cease & desist needs different framing because (a) it is not filed with a tribunal so jurisdictional thresholds are irrelevant, and (b) the tone is firmer.

Add a category-aware branch in `buildGenerationPrompt`. When `template.category === 'Cease & Desist'`, replace the tribunal/jurisdiction header block with the following body, keeping the user-answers and evidence sections unchanged:

```
You are generating a formal Australian cease & desist letter sent under personal authority (not under a tribunal application). The recipient is being asked to stop a specified course of conduct. Do not reference any tribunal or court as the filing body. The letter is sent privately.

User's situation details:
{answersText}{evidenceContext}

Generate values for each of the following document fields. Return ONLY a valid JSON object with these exact keys.

Required fields:
{fields}

Rules:
- Use formal, professional Australian English. The tone is firm but not threatening.
- Frame demands in terms of stopping the conduct, not seeking damages or filing claims.
- Where the user has provided a deadline (cease_deadline_days), use it; otherwise default to 14 days from today.
- Where the user has not provided enough detail, use a placeholder like [INSERT X] rather than inventing facts.
- The 'consequences' field should mention that the sender reserves the right to take further action (without naming a specific tribunal or claim type) and that they may seek independent legal advice.
- Do not provide legal advice. Do not promise a specific legal outcome.
- All fields must be present in your response.
```

Keep the existing `SYSTEM_PROMPT` in `prompts.ts` unchanged — it already covers "no legal advice" and "Australian English".

## Template / final document structure

The rendered letter (driven by the template fields) follows this order:

1. **Header** — sender name, address, date.
2. **Recipient block** — recipient name, address.
3. **Subject line** — "Cease and Desist: {conduct_summary}".
4. **Recital paragraph** — `conduct_recital`. What the recipient is alleged to be doing, with dates if provided.
5. **Demand paragraph** — `demand_paragraph`. Formal demand to cease and desist by `deadline_date`.
6. **Consequences paragraph** — `consequences`. Reserved-rights language; no specific threat.
7. **Signature block** — `sender_signature`.

The PDF and Word exports already render fields generically — no template-specific rendering code change is needed if the field labels are descriptive enough (verify this in the editor manually).

## Redaction rules for the preview

`lib/documents/redact.ts` is generic over fields and works as-is. The first ~150 words appear in plain text, the rest is masked. For cease & desist this means the recital paragraph is partially visible (good — proves the AI engaged with the user's facts) and the demand and consequences paragraphs are masked behind the unlock paywall.

No changes to `redact.ts`.

## Editor field schema

The editor at `app/(main)/document/[documentId]/page.tsx` reads field schema from `templates.ts`. Once the new `TEMPLATES` entry is added, the editor renders correctly with no further changes. Verify manually.

## Dashboard card treatment

The dashboard already shows `document.category` per card. With the new category `Cease & Desist`, no code change is required. Optional polish: a distinct badge color (the existing styling will use the default — fine for v1).

Status flow is identical to demand letters: `generating → ready` (or `permanently_failed`).

## next-steps.ts blurb

The current `NEXT_STEPS` map is keyed by state and assumes the user might escalate to a state tribunal. Cease & desist does not escalate to NCAT/VCAT in the small-claims sense.

Refactor `lib/documents/next-steps.ts` to accept both state and category:

```ts
export function getNextSteps(state: string, category?: string): string {
  if (category === 'Cease & Desist') return CEASE_AND_DESIST_NEXT_STEPS
  return NEXT_STEPS[state] ?? NEXT_STEPS_FALLBACK
}

const CEASE_AND_DESIST_NEXT_STEPS = `
If the recipient stops the specified conduct by the deadline, no further action is needed. If the conduct continues, people in this situation sometimes seek independent legal advice about further options, which may include applying for an injunction or commencing a civil claim. Free legal help is available through your state legal aid commission.

This is not legal advice. The next steps that apply to your specific situation depend on the type of conduct and your jurisdiction.
`
```

Update all callers of `getNextSteps(state)` to pass `category` if available. The signature change is backwards-compatible (category is optional).

The `NextStepsPanel` (`components/document/NextStepsPanel.tsx` per CLAUDE.md notes) currently shows tribunal court-form info from `lib/documents/court-forms.ts`. For cease & desist documents, hide the court-form section entirely — there is no tribunal filing form. Add a category check at the top of `NextStepsPanel`.

The blurb above is **placeholder copy and must be reviewed by a lawyer before launch.**

## Implementation checklist

The implementer must check off each of these. Failing to do so is a spec-compliance failure.

- [ ] `lib/documents/templates.ts` — new `cease-and-desist` entry added to `TEMPLATES`.
- [ ] `lib/claude/prompts.ts` — `buildGenerationPrompt` branches on `template.category === 'Cease & Desist'` and uses the cease & desist-specific body, dropping the tribunal/jurisdiction header.
- [ ] `lib/documents/next-steps.ts` — `getNextSteps` signature gains optional `category`; cease & desist returns `CEASE_AND_DESIST_NEXT_STEPS`; all callers updated.
- [ ] `components/document/NextStepsPanel.tsx` (or equivalent) — hides the court-forms section when `category === 'Cease & Desist'`.
- [ ] `lib/documents/evidence-requirements.ts` — adds a `cease-and-desist` entry. Suggested items: communication records (required), screenshots/copies of the offending material (required), prior correspondence asking the conduct to stop (optional). All marked as supportive evidence, not formal exhibits.
- [ ] `app/wizard/page.tsx` — wizard step labels switch to the C&D variants when the chosen template is `cease-and-desist`. Add the optional `cease_deadline_days` input on the Incident step (only when the chosen template is C&D).
- [ ] Wherever the user picks a template id (or wherever the default `'debt-recovery'` is hard-coded), ensure `cease-and-desist` is selectable. If no template-picker UI exists yet, add a minimal one upstream of the wizard or document the gap clearly.
- [ ] Manual verification: walk the wizard end-to-end selecting cease-and-desist; confirm the document generates, renders in preview, opens in the editor, and exports to PDF and Word.
- [ ] No migration is written. The `category TEXT` column accepts the new value with no DDL.
- [ ] No changes to `redact.ts`, `export.ts`, or the dashboard card component.

## Out of scope (explicitly)

- New pricing tier for cease & desist. Reuse existing tiers.
- Email-the-letter delivery for cease & desist (existing send-the-letter flow applies if pricing allows).
- Specialised cease & desist subtypes (defamation-only, IP-only). One template covers all subtypes for v1; the AI generates appropriate language from the user's facts.
- Translation of demand language into specific legal causes of action — this is what lawyer review will refine.

## Lawyer review checklist (before launch)

1. Approve the system-prompt body for cease & desist generation.
2. Approve the `CEASE_AND_DESIST_NEXT_STEPS` blurb.
3. Confirm the template field set is sufficient and not misleading.
4. Confirm the "Awaiting lawyer review" disclaimer placement in the UI is adequate (suggested: a banner on the editor page when `category === 'Cease & Desist'` until lawyer sign-off lands).
