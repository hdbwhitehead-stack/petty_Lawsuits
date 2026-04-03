# Plan 2: Wizard & Document Generation

**Goal:** Build the AI-powered wizard flow that takes a user from "I have a problem" to a generated legal document stored in Supabase — covering both the free-text and category-browse entry points.

**Architecture:** A four-step wizard guides the user through Defendant → Claimant → Incident → Evidence. Jurisdiction is inferred from the location (city, state) entered in the Incident step — there is no separate state picker. Claude enhances the user's free-text description live during step 3. On step 4, evidence files are uploaded to Supabase Storage. Clicking "Generate Demand Letter" calls a Next.js API route that sends wizard answers + evidence context to the Claude API, which fills a document template. The generated document is stored in Supabase (as an anonymous row if not yet signed in, or as a user-owned row if logged in).

**Tech Stack:** Claude API (`claude-sonnet-4-6`), Supabase, Next.js API routes, `localStorage` (anonymous key)

**Depends on:** Plan 1 (auth, DB schema, Supabase client)

**Deliverable:** A working wizard that generates a real document and stores it in Supabase. The document is not yet viewable or purchasable — that comes in Plan 3.

---

## File structure

```
app/
├── wizard/
│   └── page.tsx                         # Wizard shell (client component, manages steps)
└── api/
    ├── generate/
    │   └── route.ts                     # POST: calls Claude, validates, saves to Supabase
    └── enhance/
        └── route.ts                     # POST: live Claude narrative enhancement (step 3)
components/
└── wizard/
    ├── WizardShell.tsx                  # Step container, progress sidebar, % completion
    ├── ProgressSidebar.tsx              # Left sidebar showing step names, % progress, participant names as entered
    ├── DefendantStep.tsx                # Step 1: Business/Individual toggle, defendant details
    ├── ClaimantStep.tsx                 # Step 2: Claimant details + social proof ticker
    ├── IncidentStep.tsx                 # Step 3: Description, claim type, date, location, amount, court widget
    ├── CourtWidget.tsx                  # Auto-expands below amount field; determines correct tribunal from location + amount
    ├── NarrativeEnhancer.tsx            # Calls /api/enhance live as user types; shows enhanced version below input
    └── EvidenceStep.tsx                 # Step 4: Drag-and-drop upload + requirements checklist
lib/
├── claude/
│   ├── generate.ts                      # Claude API call + placeholder validation
│   ├── enhance.ts                       # Live narrative enhancement prompt
│   └── prompts.ts                       # System prompts and per-category templates
├── documents/
│   ├── templates.ts                     # Template definitions: fields, questions per category
│   ├── evidence-requirements.ts         # Per-claim-type evidence checklist definitions
│   └── jurisdiction.ts                  # Parse state from location string; map to tribunal name
└── anonymous.ts                         # localStorage UUID helpers
```

---

## Tasks

### Task 1: Anonymous document key

- [ ] Create `lib/anonymous.ts`:
  ```ts
  const KEY = 'petty_anon_doc_key'

  export function getOrCreateAnonKey(): string {
    if (typeof window === 'undefined') return ''
    let key = localStorage.getItem(KEY)
    if (!key) {
      key = crypto.randomUUID()
      localStorage.setItem(KEY, key)
    }
    return key
  }

  export function clearAnonKey() {
    localStorage.removeItem(KEY)
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add anonymous document key helper"`

---

### Task 2: Document templates and jurisdiction helpers

- [ ] Create `lib/documents/jurisdiction.ts` that parses a location string (e.g. "Sydney, NSW") to extract the state code, and maps state codes to tribunal names:
  ```ts
  export const STATE_TRIBUNAL: Record<string, string> = {
    NSW: 'NCAT (NSW Civil and Administrative Tribunal)',
    VIC: 'VCAT (Victorian Civil and Administrative Tribunal)',
    QLD: 'QCAT (Queensland Civil and Administrative Tribunal)',
    WA:  'SAT (State Administrative Tribunal)',
    SA:  'SACAT (South Australian Civil and Administrative Tribunal)',
    TAS: 'TASCAT (Tasmanian Civil and Administrative Tribunal)',
    ACT: 'ACAT (ACT Civil and Administrative Tribunal)',
    NT:  'Local Court of the Northern Territory',
  }

  export function parseStateFromLocation(location: string): string | null {
    const matches = location.toUpperCase().match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\b/)
    return matches ? matches[1] : null
  }
  ```
- [ ] Create `lib/documents/evidence-requirements.ts` defining the per-claim-type checklist:
  ```ts
  export type EvidenceItem = { key: string; label: string; required: boolean }

  export const EVIDENCE_REQUIREMENTS: Record<string, EvidenceItem[]> = {
    'consumer-complaint': [
      { key: 'purchase_receipt', label: 'Purchase Receipt', required: true },
      { key: 'communication_records', label: 'Communication Records', required: true },
      { key: 'product_service_docs', label: 'Product/Service Documentation', required: false },
    ],
    'bond-dispute': [
      { key: 'lease_agreement', label: 'Lease Agreement', required: true },
      { key: 'condition_report', label: 'Ingoing Condition Report', required: false },
      { key: 'correspondence', label: 'Correspondence with Landlord/Agent', required: true },
    ],
    'debt-recovery': [
      { key: 'invoice_or_agreement', label: 'Invoice or Written Agreement', required: true },
      { key: 'communication_records', label: 'Communication Records', required: true },
    ],
    // Add further categories following the same pattern
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add jurisdiction helpers and evidence requirements"`

- [ ] Create `lib/documents/templates.ts` defining the fields for each document category:
  ```ts
  // Templates define the output fields Claude must fill — wizard questions are now
  // collected via the fixed four-step flow (Defendant / Claimant / Incident / Evidence),
  // not per-template question lists.

  export type DocumentField = {
    key: string
    label: string
    type: 'text' | 'date' | 'amount' | 'textarea'
  }

  export type DocumentTemplate = {
    id: string
    category: string
    label: string
    description: string
    fields: DocumentField[]
  }

  export const TEMPLATES: DocumentTemplate[] = [
    {
      id: 'debt-recovery',
      category: 'Debt & Money',
      label: 'Debt Recovery Demand Letter',
      description: 'Formally demand repayment of money owed to you.',
      fields: [
        { key: 'creditor_name', label: 'Your full name', type: 'text' },
        { key: 'debtor_name', label: 'Debtor full name', type: 'text' },
        { key: 'amount_owed', label: 'Amount owed (AUD)', type: 'amount' },
        { key: 'due_date', label: 'Original due date', type: 'date' },
        { key: 'payment_deadline', label: 'Deadline to pay', type: 'date' },
        { key: 'payment_details', label: 'Your bank/payment details', type: 'text' },
      ],
    },
    {
      id: 'consumer-complaint',
      category: 'Consumer',
      label: 'Faulty Goods / Services Complaint',
      description: 'Demand a refund or remedy for faulty goods or poor service.',
      fields: [
        { key: 'complainant_name', label: 'Your full name', type: 'text' },
        { key: 'business_name', label: 'Business name', type: 'text' },
        { key: 'product_service', label: 'Product or service purchased', type: 'text' },
        { key: 'purchase_date', label: 'Date of purchase', type: 'date' },
        { key: 'amount_paid', label: 'Amount paid (AUD)', type: 'amount' },
        { key: 'remedy_sought', label: 'What remedy do you want? (refund, repair, replacement)', type: 'text' },
      ],
    },
    {
      id: 'bond-dispute',
      category: 'Tenancy',
      label: 'Bond Dispute Letter',
      description: 'Dispute an unfair bond deduction by your landlord or property manager.',
      fields: [
        { key: 'tenant_name', label: 'Your full name', type: 'text' },
        { key: 'landlord_name', label: 'Landlord / agent name', type: 'text' },
        { key: 'property_address', label: 'Rental property address', type: 'text' },
        { key: 'bond_amount', label: 'Total bond paid (AUD)', type: 'amount' },
        { key: 'disputed_amount', label: 'Amount being withheld (AUD)', type: 'amount' },
        { key: 'vacated_date', label: 'Date you vacated', type: 'date' },
      ],
    },
    // Additional templates (Neighbour Disputes, Employment, Contracts, Court filings)
    // follow the same structure — expand as the product grows
  ]

  export function getTemplate(id: string): DocumentTemplate | undefined {
    return TEMPLATES.find(t => t.id === id)
  }

  export const CATEGORIES = [...new Set(TEMPLATES.map(t => t.category))]
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add document template definitions"`

---

### Task 3: Claude prompts

- [ ] Create `lib/claude/prompts.ts`. Note: state is now derived from the `location` string via `parseStateFromLocation()` in `lib/documents/jurisdiction.ts` — it is no longer passed as a separate wizard answer:
  ```ts
  import type { DocumentTemplate } from '@/lib/documents/templates'
  import { STATE_TRIBUNAL, parseStateFromLocation } from '@/lib/documents/jurisdiction'

  export function buildGenerationPrompt(
    template: DocumentTemplate,
    wizardAnswers: Record<string, string>,
    evidenceFilenames: string[]
  ): string {
    const location = wizardAnswers.location ?? ''
    const state = parseStateFromLocation(location) ?? 'Unknown'
    const tribunal = STATE_TRIBUNAL[state] ?? 'the relevant state tribunal'

    const answersText = Object.entries(wizardAnswers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')

    const evidenceContext = evidenceFilenames.length > 0
      ? `\nThe user has attached the following evidence files: ${evidenceFilenames.join(', ')}`
      : ''

    return `You are generating a formal Australian legal document of type: ${template.label}.

The user is located at: ${location}. The relevant tribunal in this jurisdiction is ${tribunal}.

User's situation details:
${answersText}${evidenceContext}

Generate values for each of the following document fields. Return ONLY a valid JSON object with these exact keys. Do not include any explanation, preamble, or markdown formatting — just the JSON object.

Required fields:
${template.fields.map(f => `"${f.key}": "${f.label}"`).join('\n')}

Rules:
- Use formal, professional Australian English
- Do not invent facts not provided by the user
- Where information is missing, use a placeholder like [INSERT X]
- All fields must be present in your response`
  }

  export const SYSTEM_PROMPT = `You are a document drafting assistant for an Australian legal document generation service. You produce structured field values for legal document templates. You do not provide legal advice. You produce formal, accurate document content based only on the information provided.`
  ```

- [ ] Create `lib/claude/enhance.ts` for the live narrative enhancement feature (called from `IncidentStep` as the user types):
  ```ts
  import Anthropic from '@anthropic-ai/sdk'

  const client = new Anthropic()

  export async function enhanceNarrative(rawDescription: string): Promise<string> {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: `You are helping a person write a formal incident description for an Australian legal demand letter.
Rewrite their description in clear, formal, professional language suitable for a legal document.
Preserve all facts exactly — do not add, remove, or invent any details.
Return only the rewritten description, no preamble.`,
      messages: [{ role: 'user', content: rawDescription }],
    })
    return (message.content[0] as { type: string; text: string }).text.trim()
  }
  ```
- [ ] Create `app/api/enhance/route.ts` — a POST endpoint that accepts `{ description: string }` and returns `{ enhanced: string }`. Apply a short debounce note: this route is called client-side with a 1-second debounce to avoid excessive API calls.
- [ ] Commit: `git add -A && git commit -m "feat: add Claude prompt builders and narrative enhancer"`

---

### Task 4: Claude generation API route

- [ ] Add `ANTHROPIC_API_KEY` to `.env.local`
- [ ] Install Anthropic SDK: `npm install @anthropic-ai/sdk`
- [ ] Create `lib/claude/generate.ts`:
  ```ts
  import Anthropic from '@anthropic-ai/sdk'
  import { buildGenerationPrompt, SYSTEM_PROMPT } from './prompts'
  import type { DocumentTemplate } from '@/lib/documents/templates'

  const client = new Anthropic()

  export async function generateDocument(
    template: DocumentTemplate,
    wizardAnswers: Record<string, string>,
    evidenceFilenames: string[]
  ): Promise<Record<string, string>> {
    const prompt = buildGenerationPrompt(template, wizardAnswers, evidenceFilenames)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (message.content[0] as { type: string; text: string }).text.trim()
    let parsed: Record<string, string>

    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error('Claude returned malformed JSON')
    }

    // Validate all required fields are present
    const missing = template.fields
      .map(f => f.key)
      .filter(key => !parsed[key] || parsed[key].trim() === '')

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`)
    }

    return parsed
  }
  ```
- [ ] Create `app/api/generate/route.ts`:
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'
  import { generateDocument } from '@/lib/claude/generate'
  import { getTemplate } from '@/lib/documents/templates'

  export async function POST(req: NextRequest) {
    // wizardAnswers includes all four steps merged: defendant, claimant, incident fields
    // location field within wizardAnswers is used to infer state/jurisdiction
    // evidenceFilenames is an array of filenames already uploaded to Supabase Storage
    const { templateId, wizardAnswers, evidenceFilenames, anonymousKey } = await req.json()

    const template = getTemplate(templateId)
    if (!template) {
      return NextResponse.json({ error: 'Unknown template' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Rate limit: 10 generation attempts per user per 24h
    if (user) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('generation_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', since)

      if ((count ?? 0) >= 10) {
        return NextResponse.json(
          { error: 'Generation limit reached. Try again tomorrow.' },
          { status: 429 }
        )
      }
    }

    // Create document row in pending state
    // state is derived server-side from wizardAnswers.location
    const { data: doc, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user?.id ?? null,
        anonymous_key: user ? null : anonymousKey,
        category: template.category,
        status: 'generating',
        evidence_files: evidenceFilenames ?? [],
      })
      .select()
      .single()

    if (insertError || !doc) {
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
    }

    // Generate with Claude
    let content: Record<string, string>
    let attempts = 0

    while (attempts < 3) {
      try {
        content = await generateDocument(template, wizardAnswers, evidenceFilenames ?? [])
        break
      } catch (err) {
        attempts++
        if (attempts >= 3) {
          await supabase
            .from('documents')
            .update({ status: 'permanently_failed' })
            .eq('id', doc.id)

          return NextResponse.json(
            { error: 'Document generation failed. Please contact support.' },
            { status: 500 }
          )
        }
      }
    }

    // Save generated content
    await supabase
      .from('documents')
      .update({
        status: 'ready',
        original_content: content!,
        current_content: content!,
      })
      .eq('id', doc.id)

    // Record attempt for rate limiting
    if (user) {
      await supabase
        .from('generation_attempts')
        .insert({ user_id: user.id })
    }

    return NextResponse.json({ documentId: doc.id })
  }
  ```
- [ ] Test manually: run the dev server, use a tool like [Hoppscotch](https://hoppscotch.io) to POST to `/api/generate` with a sample payload
- [ ] Commit: `git add -A && git commit -m "feat: add document generation API route"`

---

### Task 5: Wizard UI

- [ ] Create `app/wizard/page.tsx` as a client component that manages wizard state (current step index, collected answers for all four steps) and renders the appropriate step component
- [ ] Create `components/wizard/ProgressSidebar.tsx` — a persistent left sidebar showing:
  - Current step name and percentage completion (calculate as `(stepIndex / 4) * 100`)
  - Defendant name (once entered in step 1)
  - Claimant name (once entered in step 2)
  - Claim amount (once entered in step 3)
- [ ] Create `components/wizard/DefendantStep.tsx` — step 1:
  - Business / Individual toggle at the top
  - Fields: First Name, Last Name, Email (optional), Phone (optional), Street Address, City, State, ZIP
  - CTA: "Lock In The Defendant →"
- [ ] Create `components/wizard/ClaimantStep.tsx` — step 2:
  - "Are you filing as: Individual / Business" toggle
  - Fields: First Name, Last Name, Email, Phone, Street Address, City, State, ZIP
  - Social proof ticker at the bottom: "The petty is spreading in [City] — demand sent" (static placeholder text for MVP; can be made live later)
  - CTA: "Continue →"
- [ ] Create `components/wizard/IncidentStep.tsx` — step 3:
  - Large textarea for incident description (placeholder: "Describe the incident…")
  - `NarrativeEnhancer.tsx` component below: calls `/api/enhance` with 1-second debounce; shows enhanced version beneath the raw input once available
  - "What type of claim is this?" — select dropdown mapped to document categories
  - "When and where did this happen?" — date picker + location text field (City, State)
  - "How much are you claiming?" — AUD amount input
  - `CourtWidget.tsx` — appears below amount field once state + amount are both entered; displays determined court/tribunal name and filing threshold note
  - Validation checklist at bottom of step (incomplete fields highlighted)
  - CTA: "Add Your Evidence →"
- [ ] Create `components/wizard/CourtWidget.tsx` — calls `parseStateFromLocation()` and maps to tribunal; shows a card like "Filing in: NCAT (NSW) — small claims up to $100,000"
- [ ] Create `components/wizard/EvidenceStep.tsx` — step 4:
  - Drag-and-drop upload zone (accepts PDF, PNG, JPG, HEIC, DOCX; max 10MB/file, max 10 files)
  - File list showing uploaded files with remove button
  - Requirements checklist (from `EVIDENCE_REQUIREMENTS` for selected claim type): each item shows Pending / Uploaded status
  - "Generate Demand Letter" CTA — disabled until checklist is satisfied or user checks "I've attached what I have"
- [ ] On clicking "Generate Demand Letter": upload evidence files to Supabase Storage, then call `/api/generate`, then show a loading state ("Generating your document…" with spinner)
- [ ] On success: navigate to `/preview/[documentId]`
- [ ] On error: show "Try again" button
- [ ] Commit: `git add -A && git commit -m "feat: add four-step wizard UI"`

---

### Task 6: Verify end-to-end flow

- [ ] Run the dev server
- [ ] Complete the wizard as an anonymous user (no login) — verify a document row is created in Supabase with `anonymous_key` set and `status: ready`
- [ ] Complete the wizard as a logged-in user — verify the document row has `user_id` set
- [ ] Check that a 10-attempt rate limit works by setting `count` temporarily in the DB
- [ ] Commit any fixes: `git add -A && git commit -m "fix: wizard flow corrections"`
- [ ] Push: `git push origin main`

---

**Plan 2 complete when:** A user can complete the wizard and a generated document with real Claude-produced field values appears in the Supabase `documents` table.
