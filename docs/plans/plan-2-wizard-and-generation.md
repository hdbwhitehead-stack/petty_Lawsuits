# Plan 2: Wizard & Document Generation

**Goal:** Build the AI-powered wizard flow that takes a user from "I have a problem" to a generated legal document stored in Supabase — covering both the free-text and category-browse entry points.

**Architecture:** A multi-step wizard collects the user's state, situation, and answers to structured questions. The final step calls a Next.js API route that sends the answers to the Claude API, which fills a document template. The generated document is stored in Supabase (as an anonymous row if not yet signed in, or as a user-owned row if logged in). The wizard supports both entry points: free-text description and category browse.

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
    └── generate/
        └── route.ts                     # POST: calls Claude, validates, saves to Supabase
components/
└── wizard/
    ├── WizardShell.tsx                  # Step container and progress indicator
    ├── StateSelector.tsx                # State/territory picker (step 1 — always first)
    ├── EntryPicker.tsx                  # "Describe situation" vs "Browse categories"
    ├── SituationInput.tsx               # Free-text situation description
    ├── CategoryPicker.tsx               # Grid of document categories
    └── QuestionStep.tsx                 # Generic question step (reused per template)
lib/
├── claude/
│   ├── generate.ts                      # Claude API call + placeholder validation
│   └── prompts.ts                       # System prompts and per-category templates
├── documents/
│   └── templates.ts                     # Template definitions: fields, questions per category
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

### Task 2: Document templates

- [ ] Create `lib/documents/templates.ts` defining the fields and wizard questions for each category:
  ```ts
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
    wizardQuestions: { key: string; question: string; type: 'text' | 'select'; options?: string[] }[]
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
      wizardQuestions: [
        { key: 'relationship', question: 'What is your relationship to the debtor?', type: 'select',
          options: ['Individual I lent money to', 'Business I provided services to', 'Former employer', 'Other'] },
        { key: 'prior_attempts', question: 'Have you already asked them to pay?', type: 'select',
          options: ['Yes, verbally', 'Yes, by email or message', 'No'] },
      ]
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
      wizardQuestions: [
        { key: 'issue_type', question: 'What is the main issue?', type: 'select',
          options: ['Product was faulty', 'Service was not as described', 'Service was not completed', 'Other'] },
        { key: 'contacted_business', question: 'Have you already contacted the business?', type: 'select',
          options: ['Yes, they refused to help', 'Yes, they ignored me', 'No'] },
      ]
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
      wizardQuestions: [
        { key: 'deduction_reason', question: 'What reason did the landlord give for keeping the bond?', type: 'text' },
        { key: 'condition_report', question: 'Did you complete an ingoing condition report?', type: 'select',
          options: ['Yes', 'No', 'Not sure'] },
      ]
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

- [ ] Create `lib/claude/prompts.ts`:
  ```ts
  import type { DocumentTemplate } from '@/lib/documents/templates'

  const STATE_TRIBUNAL: Record<string, string> = {
    NSW: 'NCAT (NSW Civil and Administrative Tribunal)',
    VIC: 'VCAT (Victorian Civil and Administrative Tribunal)',
    QLD: 'QCAT (Queensland Civil and Administrative Tribunal)',
    WA: 'SAT (State Administrative Tribunal)',
    SA: 'SACAT (South Australian Civil and Administrative Tribunal)',
    TAS: 'TASCAT (Tasmanian Civil and Administrative Tribunal)',
    ACT: 'ACAT (ACT Civil and Administrative Tribunal)',
    NT: 'NTCAT (Northern Territory Civil and Administrative Tribunal)',
  }

  export function buildGenerationPrompt(
    template: DocumentTemplate,
    state: string,
    wizardAnswers: Record<string, string>
  ): string {
    const tribunal = STATE_TRIBUNAL[state] ?? 'the relevant state tribunal'
    const answersText = Object.entries(wizardAnswers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')

    return `You are generating a formal Australian legal document of type: ${template.label}.

The user is in ${state}, Australia. The relevant tribunal in this state is ${tribunal}.

User's situation details:
${answersText}

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
- [ ] Commit: `git add -A && git commit -m "feat: add Claude prompt builders"`

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
    state: string,
    wizardAnswers: Record<string, string>
  ): Promise<Record<string, string>> {
    const prompt = buildGenerationPrompt(template, state, wizardAnswers)

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
    const { templateId, state, wizardAnswers, anonymousKey } = await req.json()

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
    const { data: doc, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user?.id ?? null,
        anonymous_key: user ? null : anonymousKey,
        state,
        category: template.category,
        status: 'generating',
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
        content = await generateDocument(template, state, wizardAnswers)
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

- [ ] Create `app/wizard/page.tsx` as a client component that manages wizard state (current step, collected answers) and renders the appropriate step component
- [ ] Create `components/wizard/StateSelector.tsx` — a dropdown or button grid for selecting AU state/territory (always step 1)
- [ ] Create `components/wizard/EntryPicker.tsx` — two large buttons: "Describe my situation" and "I know what I need"
- [ ] Create `components/wizard/CategoryPicker.tsx` — a grid of cards, one per document category, that sets the template
- [ ] Create `components/wizard/QuestionStep.tsx` — renders a single wizard question (text input or select) based on the template's `wizardQuestions`
- [ ] On the final wizard step, call `/api/generate` and redirect to `/preview/[documentId]` on success
- [ ] Show a loading state during generation with the message "Generating your document..." and a spinner
- [ ] Show an error state if generation fails with a "Try again" button
- [ ] Commit: `git add -A && git commit -m "feat: add wizard UI"`

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
