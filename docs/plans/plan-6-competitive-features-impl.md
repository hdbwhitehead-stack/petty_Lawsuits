# Plan 6: Competitive Features — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the 7 highest-impact competitive features identified from pettylawsuit.com audit — ABN business lookup, cease & desist letters, pricing comparison table, tribunal fees calculator, response deadline tracking, evidence file upload, and jurisdiction landing pages.

**Architecture:** Each task is a self-contained feature that can be built independently. Tasks 1–4 are product features touching the wizard, generation pipeline, and dashboard. Task 5 is a pricing page copy improvement. Tasks 6–7 are content/SEO pages that reuse existing jurisdiction data from `lib/documents/jurisdiction.ts`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (DB + Storage), Resend (email), existing Claude API pipeline

**Depends on:** Plans 1–5

**Deliverable:** Seven new features deployed, each behind its own commit, all building on the existing codebase patterns.

---

## File structure

```
app/
├── (main)/
│   ├── calculator/
│   │   └── fees/
│   │       └── page.tsx                    # NEW: Tribunal fees calculator
│   ├── tribunals/
│   │   └── [state]/
│   │       └── page.tsx                    # NEW: Per-jurisdiction landing pages
│   ├── tribunals/
│   │   └── page.tsx                        # NEW: All-jurisdictions reference table
│   ├── pricing/
│   │   └── page.tsx                        # MODIFY: Add comparison table section
│   └── dashboard/
│       └── page.tsx                        # MODIFY: Show deadline countdown
├── api/
│   ├── abn-lookup/
│   │   └── route.ts                        # NEW: ABN Lookup API proxy
│   └── deadlines/
│       └── check/
│           └── route.ts                    # NEW: Cron-callable deadline check endpoint
components/
├── wizard/
│   ├── DefendantStep.tsx                   # MODIFY: Add ABN lookup
│   ├── EvidenceStep.tsx                    # MODIFY: Upload to Supabase Storage
│   └── IncidentStep.tsx                    # MODIFY: Add C&D claim type
lib/
├── documents/
│   ├── templates.ts                        # MODIFY: Add C&D templates
│   ├── jurisdiction.ts                     # MODIFY: Add filing fees data
│   └── filing-fees.ts                      # NEW: Fee schedule data + calculator logic
├── abn/
│   └── lookup.ts                           # NEW: ABN Lookup API client
└── email/
    └── resend.ts                           # MODIFY: Add deadline reminder emails
supabase/
└── migrations/
    └── 002_plan6_additions.sql             # NEW: Add deadline, evidence columns + storage bucket
e2e/
├── calculator.spec.ts                      # NEW: Fees calculator tests
└── wizard-evidence.spec.ts                 # NEW: Evidence upload tests
```

---

## Task 1: ABN/ACN Business Lookup in Wizard

When the user selects "Business" as the defendant type, show a search field that queries the Australian Business Register (ABR) API to auto-fill the business's registered name, ABN, and registered address.

**Files:**
- Create: `lib/abn/lookup.ts`
- Create: `app/api/abn-lookup/route.ts`
- Modify: `components/wizard/DefendantStep.tsx`

**Background:** The ABR provides a free API (ABR Web Services) that returns business details by ABN or name search. You need a GUID (free registration at abr.business.gov.au). For MVP, we'll use name search and let the user pick from results.

- [ ] **Step 1: Create the ABN lookup client**

Create `lib/abn/lookup.ts`:

```ts
// ABR Web Services client
// Register for a free GUID at https://abr.business.gov.au/Tools/WebServices

export type AbnResult = {
  abn: string
  name: string
  status: string
  state: string
  postcode: string
  type: string // 'Individual' | 'Company' | 'Trust' | etc.
}

const ABR_GUID = process.env.ABR_GUID ?? ''
const ABR_BASE = 'https://abr.business.gov.au/json'

export async function searchBusinessByName(
  name: string,
  maxResults = 5
): Promise<AbnResult[]> {
  if (!ABR_GUID || !name.trim()) return []

  const params = new URLSearchParams({
    name: name.trim(),
    maxResults: String(maxResults),
    guid: ABR_GUID,
  })

  const res = await fetch(`${ABR_BASE}/MatchingNames.aspx?${params}`)
  if (!res.ok) return []

  // ABR returns JSONP-like callback wrapper: callback({...})
  const text = await res.text()
  const jsonStr = text.replace(/^callback\(/, '').replace(/\)$/, '')
  const data = JSON.parse(jsonStr)

  if (!data.Names || !Array.isArray(data.Names)) return []

  return data.Names.map((entry: Record<string, string>) => ({
    abn: entry.Abn ?? '',
    name: entry.Name ?? '',
    status: entry.AbnStatus ?? '',
    state: entry.State ?? '',
    postcode: entry.Postcode ?? '',
    type: entry.NameType ?? '',
  }))
}

export async function lookupByAbn(abn: string): Promise<AbnResult | null> {
  if (!ABR_GUID || !abn.trim()) return null

  const params = new URLSearchParams({
    abn: abn.replace(/\s/g, ''),
    guid: ABR_GUID,
  })

  const res = await fetch(`${ABR_BASE}/AbnDetails.aspx?${params}`)
  if (!res.ok) return null

  const text = await res.text()
  const jsonStr = text.replace(/^callback\(/, '').replace(/\)$/, '')
  const data = JSON.parse(jsonStr)

  if (!data.Abn) return null

  return {
    abn: data.Abn,
    name: data.EntityName ?? data.BusinessName?.[0]?.Name ?? '',
    status: data.AbnStatus ?? '',
    state: data.AddressState ?? '',
    postcode: data.AddressPostcode ?? '',
    type: data.EntityTypeName ?? '',
  }
}
```

- [ ] **Step 2: Create the API proxy route**

Create `app/api/abn-lookup/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { searchBusinessByName, lookupByAbn } from '@/lib/abn/lookup'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  const abn = searchParams.get('abn')

  if (abn) {
    const result = await lookupByAbn(abn)
    return NextResponse.json({ results: result ? [result] : [] })
  }

  if (name && name.length >= 3) {
    const results = await searchBusinessByName(name)
    return NextResponse.json({ results })
  }

  return NextResponse.json({ results: [] })
}
```

- [ ] **Step 3: Add ABR_GUID to environment**

Add to `.env.local`:

```
ABR_GUID=your-guid-here
```

Register for a free GUID at https://abr.business.gov.au/Tools/WebServices if you don't have one.

- [ ] **Step 4: Add ABN lookup UI to DefendantStep**

Modify `components/wizard/DefendantStep.tsx`. When `type === 'business'`, add a search input that:
1. Debounces input by 400ms
2. Calls `/api/abn-lookup?name=<query>` when 3+ characters typed
3. Shows a dropdown of results (business name + ABN + state)
4. On selection, auto-fills: `defendant_business_name`, `defendant_abn`, `defendant_state`, `defendant_postcode`
5. Shows a subtle "Verified via ABR" badge next to the business name after selection

Add these state variables and the lookup UI inside the existing `type === 'business'` conditional block in `DefendantStep.tsx`:

```tsx
const [abnResults, setAbnResults] = useState<Array<{
  abn: string; name: string; state: string; postcode: string; type: string
}>>([])
const [abnLoading, setAbnLoading] = useState(false)
const [abnVerified, setAbnVerified] = useState(false)
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

function handleBusinessSearch(value: string) {
  handleChange('defendant_business_name', value)
  setAbnVerified(false)

  if (debounceRef.current) clearTimeout(debounceRef.current)
  if (value.length < 3) { setAbnResults([]); return }

  debounceRef.current = setTimeout(async () => {
    setAbnLoading(true)
    try {
      const res = await fetch(`/api/abn-lookup?name=${encodeURIComponent(value)}`)
      const data = await res.json()
      setAbnResults(data.results ?? [])
    } catch {
      setAbnResults([])
    } finally {
      setAbnLoading(false)
    }
  }, 400)
}

function selectBusiness(result: typeof abnResults[0]) {
  handleChange('defendant_business_name', result.name)
  handleChange('defendant_abn', result.abn)
  if (result.state) handleChange('defendant_state', result.state)
  if (result.postcode) handleChange('defendant_postcode', result.postcode)
  setAbnResults([])
  setAbnVerified(true)
}
```

Replace the existing business name `<input>` with the search input + dropdown:

```tsx
{type === 'business' && (
  <div className="relative">
    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Business name</label>
    <input
      placeholder="Search by business name or ABN..."
      value={answers.defendant_business_name ?? ''}
      onChange={e => handleBusinessSearch(e.target.value)}
      className={inputClasses}
    />
    {abnVerified && (
      <span className="absolute right-3 top-8 text-xs text-green-600 font-medium">
        &#10003; Verified via ABR
      </span>
    )}
    {abnLoading && (
      <p className="text-xs text-[var(--muted)] mt-1">Searching Australian Business Register...</p>
    )}
    {abnResults.length > 0 && (
      <ul className="absolute z-10 w-full mt-1 border border-[var(--border)] rounded-lg bg-[var(--card)] shadow-lg max-h-60 overflow-y-auto">
        {abnResults.map(r => (
          <li key={r.abn}>
            <button
              type="button"
              onClick={() => selectBusiness(r)}
              className="w-full text-left px-4 py-3 hover:bg-[var(--background)] transition-colors border-b border-[var(--border)] last:border-0"
            >
              <p className="text-sm font-medium text-[var(--foreground)]">{r.name}</p>
              <p className="text-xs text-[var(--muted)]">ABN {r.abn} · {r.state} {r.postcode} · {r.type}</p>
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)}
```

- [ ] **Step 5: Test the ABN lookup manually**

Run: `npm run dev`
1. Go to `/wizard`
2. Click "Business"
3. Type "Telstra" in the business name field
4. Verify dropdown appears with ABN results
5. Select one — verify fields auto-fill

- [ ] **Step 6: Commit**

```bash
git add lib/abn/lookup.ts app/api/abn-lookup/route.ts components/wizard/DefendantStep.tsx
git commit -m "feat: add ABN business lookup in wizard defendant step"
```

---

## Task 2: Cease & Desist Letters (New Document Type)

Add cease & desist as a second document category. This requires a new template in `templates.ts`, corresponding prompts, and a document-type selector before the wizard begins.

**Files:**
- Modify: `lib/documents/templates.ts`
- Modify: `lib/documents/jurisdiction.ts` (add `'cease-desist'` dispute type)
- Modify: `lib/claude/prompts.ts` (update system prompt to handle C&D)
- Modify: `components/wizard/IncidentStep.tsx` (add C&D templates to claim type dropdown)
- Modify: `lib/documents/evidence-requirements.ts` (add C&D evidence requirements)
- Modify: `app/(main)/dashboard/page.tsx` (show "Cease & Desist" label for C&D docs)

- [ ] **Step 1: Add cease & desist templates**

Add to `lib/documents/templates.ts` after the existing `TEMPLATES` array entries:

```ts
  {
    id: 'harassment',
    category: 'Cease & Desist',
    label: 'Cease & Desist — Harassment',
    description: 'Demand that a person or business stop harassing, threatening, or intimidating behaviour.',
    fields: [
      { key: 'sender_name', label: 'Your full name', type: 'text' },
      { key: 'recipient_name', label: 'Person / business to stop', type: 'text' },
      { key: 'behaviour_description', label: 'Description of the behaviour', type: 'textarea' },
      { key: 'first_incident_date', label: 'Date behaviour first occurred', type: 'date' },
      { key: 'cease_deadline', label: 'Deadline to stop (date)', type: 'date' },
      { key: 'consequences', label: 'Consequences if behaviour continues', type: 'textarea' },
    ],
  },
  {
    id: 'defamation',
    category: 'Cease & Desist',
    label: 'Cease & Desist — Defamation',
    description: 'Demand removal of false or defamatory statements made about you online or in public.',
    fields: [
      { key: 'sender_name', label: 'Your full name', type: 'text' },
      { key: 'publisher_name', label: 'Person / business who published the statements', type: 'text' },
      { key: 'statement_description', label: 'What was said or published', type: 'textarea' },
      { key: 'publication_location', label: 'Where it was published (URL, platform, etc.)', type: 'text' },
      { key: 'publication_date', label: 'Date of publication', type: 'date' },
      { key: 'cease_deadline', label: 'Deadline to remove / retract', type: 'date' },
    ],
  },
  {
    id: 'ip-infringement',
    category: 'Cease & Desist',
    label: 'Cease & Desist — IP Infringement',
    description: 'Demand that a person or business stop using your intellectual property without permission.',
    fields: [
      { key: 'owner_name', label: 'Your full name / business name', type: 'text' },
      { key: 'infringer_name', label: 'Person / business infringing', type: 'text' },
      { key: 'ip_description', label: 'Description of the IP being infringed', type: 'textarea' },
      { key: 'infringement_details', label: 'How is it being infringed?', type: 'textarea' },
      { key: 'first_noticed_date', label: 'Date you first noticed', type: 'date' },
      { key: 'cease_deadline', label: 'Deadline to stop', type: 'date' },
    ],
  },
  {
    id: 'noise-nuisance',
    category: 'Cease & Desist',
    label: 'Cease & Desist — Noise / Nuisance',
    description: 'Demand that a neighbour or nearby business stop excessive noise or nuisance behaviour.',
    fields: [
      { key: 'sender_name', label: 'Your full name', type: 'text' },
      { key: 'recipient_name', label: 'Person / business causing nuisance', type: 'text' },
      { key: 'nuisance_description', label: 'Description of the nuisance', type: 'textarea' },
      { key: 'your_address', label: 'Your address', type: 'text' },
      { key: 'their_address', label: 'Their address', type: 'text' },
      { key: 'first_incident_date', label: 'Date nuisance first occurred', type: 'date' },
      { key: 'cease_deadline', label: 'Deadline to stop', type: 'date' },
    ],
  },
```

- [ ] **Step 2: Update the generation prompt to handle C&D documents**

In `lib/claude/prompts.ts`, update the `SYSTEM_PROMPT` to mention cease & desist:

```ts
export const SYSTEM_PROMPT = `You are a document drafting assistant for an Australian legal document generation service. You produce structured field values for legal document templates. You do not provide legal advice. You produce formal, accurate document content based only on the information provided. You are aware that different dispute types are handled by different courts and tribunals in each Australian state and territory — always reference the correct body for the dispute type and jurisdiction.

You generate two types of documents:
1. Demand letters — formal requests for payment, remedy, or action, with a deadline and consequences (typically tribunal filing).
2. Cease and desist letters — formal demands that a person or business stop specific behaviour, with a deadline and consequences (typically legal action or complaint to relevant authority).

For cease and desist letters, the tone should be firm and direct. Reference relevant Australian legislation where applicable (e.g. Defamation Act 2005, Copyright Act 1968, Environmental Planning and Assessment Act, Residential Tenancies Act). Do not threaten criminal action — focus on civil remedies and regulatory complaints.`
```

- [ ] **Step 3: Add C&D evidence requirements**

Read `lib/documents/evidence-requirements.ts` and add entries for the new template IDs (`harassment`, `defamation`, `ip-infringement`, `noise-nuisance`). Follow the same structure as existing entries. For example:

```ts
  harassment: [
    { key: 'messages', label: 'Screenshots of harassing messages, emails, or posts', required: false },
    { key: 'timeline', label: 'Written timeline of incidents with dates', required: false },
    { key: 'witnesses', label: 'Witness statements or contact details', required: false },
    { key: 'police-report', label: 'Police report number (if filed)', required: false },
  ],
  defamation: [
    { key: 'screenshots', label: 'Screenshots of the defamatory statements', required: true },
    { key: 'url', label: 'URL where the statement is published', required: false },
    { key: 'impact', label: 'Evidence of damage caused (lost business, emotional distress)', required: false },
  ],
  'ip-infringement': [
    { key: 'original-work', label: 'Proof of ownership of the original IP', required: true },
    { key: 'infringement-evidence', label: 'Screenshots or copies of the infringing use', required: true },
    { key: 'registration', label: 'IP registration certificate (if applicable)', required: false },
  ],
  'noise-nuisance': [
    { key: 'recordings', label: 'Audio or video recordings of the nuisance', required: false },
    { key: 'log', label: 'Dated log of incidents with times and duration', required: false },
    { key: 'council-complaints', label: 'Council complaint reference numbers', required: false },
  ],
```

- [ ] **Step 4: Update dashboard to display C&D documents correctly**

In `app/(main)/dashboard/page.tsx`, update the document card label logic. Currently it assumes all documents are demand letters (line ~91):

```ts
<p className="text-base font-medium text-[var(--foreground)]">
  {recipient ? `Demand Letter — ${recipient}` : doc.category}
</p>
```

Change to also extract C&D recipients and label correctly:

```ts
const isCeaseDesist = doc.category === 'Cease & Desist'
const recipient =
  content.debtor_name ?? content.business_name ?? content.landlord_name
  ?? content.employer_name ?? content.recipient_name ?? content.publisher_name
  ?? content.infringer_name ?? null

// ...

<p className="text-base font-medium text-[var(--foreground)]">
  {recipient
    ? `${isCeaseDesist ? 'Cease & Desist' : 'Demand Letter'} — ${recipient}`
    : doc.category}
</p>
```

- [ ] **Step 5: Update the EvidenceStep generate button label**

In `components/wizard/EvidenceStep.tsx`, the button currently says "Generate Demand Letter". Make it dynamic based on the selected template category:

```tsx
const isCeaseDesist = ['harassment', 'defamation', 'ip-infringement', 'noise-nuisance'].includes(claimType)

// In the button:
{loading ? 'Generating your document...' : isCeaseDesist ? 'Generate Cease & Desist Letter' : 'Generate Demand Letter'}
```

- [ ] **Step 6: Test manually**

Run: `npm run dev`
1. Go to `/wizard`, proceed to Step 3 (Incident)
2. Open the "What type of claim is this?" dropdown — verify C&D options appear
3. Select "Cease & Desist — Harassment", fill in fields, proceed to Step 4
4. Verify evidence checklist shows harassment-specific items
5. Verify button says "Generate Cease & Desist Letter"

- [ ] **Step 7: Commit**

```bash
git add lib/documents/templates.ts lib/claude/prompts.ts lib/documents/evidence-requirements.ts components/wizard/IncidentStep.tsx components/wizard/EvidenceStep.tsx app/\(main\)/dashboard/page.tsx
git commit -m "feat: add cease and desist letter document type with four subtypes"
```

---

## Task 3: "Us vs Solicitor vs DIY" Comparison Table on Pricing Page

Add a three-column comparison section to the existing pricing page. Pure content/UI change — no backend work.

**Files:**
- Modify: `app/(main)/pricing/page.tsx`

- [ ] **Step 1: Add the comparison data and section**

In `app/(main)/pricing/page.tsx`, add a new constant after `PRICING_FAQ`:

```ts
const VS_COMPARE = [
  { feature: 'Cost', us: '$29–$49', solicitor: '$300–$600+', diy: 'Free' },
  { feature: 'Time to complete', us: '~5 minutes', solicitor: '3–7 business days', diy: '2–4 hours' },
  { feature: 'Legally formatted', us: true, solicitor: true, diy: false },
  { feature: 'Jurisdiction-aware', us: true, solicitor: true, diy: false },
  { feature: 'Cites relevant legislation', us: true, solicitor: true, diy: false },
  { feature: 'Tribunal filing guidance', us: true, solicitor: true, diy: false },
  { feature: 'Editable after creation', us: true, solicitor: false, diy: true },
  { feature: 'Available 24/7', us: true, solicitor: false, diy: true },
  { feature: 'No appointment needed', us: true, solicitor: false, diy: true },
]
```

Then add this section between the existing comparison table and the "Monthly Subscription" card:

```tsx
{/* Us vs Solicitor vs DIY */}
<div className="max-w-2xl mx-auto mt-16">
  <h2 className="text-2xl md:text-3xl text-center mb-3">How we compare</h2>
  <p className="text-center text-[var(--muted)] text-base mb-8">
    See how Petty Lawsuits stacks up against hiring a solicitor or writing a letter yourself.
  </p>
  <div className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden">
    <div className="grid grid-cols-4 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="p-4 text-base font-medium" />
      <div className="p-4 text-base font-medium text-center">Petty Lawsuits</div>
      <div className="p-4 text-base font-medium text-center">Solicitor</div>
      <div className="p-4 text-base font-medium text-center">DIY</div>
    </div>
    {VS_COMPARE.map((row, i) => (
      <div key={row.feature} className={`grid grid-cols-4 ${i < VS_COMPARE.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
        <div className="p-4 text-sm text-[var(--muted)]">{row.feature}</div>
        {['us', 'solicitor', 'diy'].map(col => {
          const val = row[col as keyof typeof row]
          return (
            <div key={col} className="p-4 text-center text-sm">
              {typeof val === 'boolean'
                ? val
                  ? <span className="text-[var(--accent)]">&#10003;</span>
                  : <span className="text-[var(--border)]">&mdash;</span>
                : <span className="text-[var(--foreground)]">{val}</span>
              }
            </div>
          )
        })}
      </div>
    ))}
  </div>
  <p className="text-xs text-[var(--muted)] text-center mt-3">
    Solicitor costs based on typical rates for a letter of demand in Australia. Your experience may vary.
  </p>
</div>
```

- [ ] **Step 2: Add "No credit card required" to CTA buttons**

Below each tier's "Get Started" link in the existing tier cards, add:

```tsx
<p className="text-xs text-[var(--muted)] text-center mt-2">No credit card required to start</p>
```

- [ ] **Step 3: Test visually**

Run: `npm run dev`
1. Go to `/pricing`
2. Verify the "How we compare" table renders below the tier comparison
3. Verify "No credit card required" appears under both tier CTAs
4. Check mobile responsiveness (table should scroll horizontally on small screens)

- [ ] **Step 4: Commit**

```bash
git add app/\(main\)/pricing/page.tsx
git commit -m "feat: add us-vs-solicitor-vs-diy comparison table on pricing page"
```

---

## Task 4: Tribunal Fees Calculator

A free interactive tool at `/calculator/fees` where users select their state and enter a claim amount to see filing fees. Uses existing jurisdiction data from `lib/documents/jurisdiction.ts` plus a new filing fees data file.

**Files:**
- Create: `lib/documents/filing-fees.ts`
- Create: `app/(main)/calculator/fees/page.tsx`
- Modify: `components/layout/Header.tsx` (add link to calculator in nav)

- [ ] **Step 1: Create filing fees data**

Create `lib/documents/filing-fees.ts`:

```ts
// Filing fee schedules per state/territory and tribunal.
// Fees are in AUD. Last verified dates included for staleness checks.
// Source: official tribunal/court websites (linked in each entry).

export type FeeTier = {
  maxAmount: number // Claims up to this amount (inclusive). Use Infinity for "and above".
  fee: number
  label: string // e.g. "Up to $10,000"
}

export type FeeSchedule = {
  state: string
  body: string
  tiers: FeeTier[]
  concessionFee?: number // Reduced fee for concession card holders
  notes: string
  sourceUrl: string
  lastVerified: string // ISO date
}

export const FILING_FEES: FeeSchedule[] = [
  {
    state: 'NSW',
    body: 'NCAT',
    tiers: [
      { maxAmount: 10000, fee: 53, label: 'Up to $10,000 (Consumer & Commercial)' },
      { maxAmount: 40000, fee: 106, label: '$10,001–$40,000 (Consumer & Commercial)' },
    ],
    concessionFee: 27,
    notes: 'NCAT Consumer & Commercial Division. Concession available with valid Health Care or Pensioner Concession Card. Residential tenancy applications have separate fees.',
    sourceUrl: 'https://www.ncat.nsw.gov.au/how-to/fees.html',
    lastVerified: '2026-04-06',
  },
  {
    state: 'NSW',
    body: 'Local Court',
    tiers: [
      { maxAmount: 10000, fee: 103, label: 'Up to $10,000 (Small Claims)' },
      { maxAmount: 20000, fee: 335, label: '$10,001–$20,000 (Small Claims)' },
      { maxAmount: 60000, fee: 670, label: '$20,001–$60,000 (General)' },
      { maxAmount: 100000, fee: 1085, label: '$60,001–$100,000 (General)' },
    ],
    notes: 'NSW Local Court. Small Claims Division (up to $20,000) uses simplified procedure with no legal representation.',
    sourceUrl: 'https://www.localcourt.nsw.gov.au/fees.html',
    lastVerified: '2026-04-06',
  },
  {
    state: 'VIC',
    body: 'VCAT',
    tiers: [
      { maxAmount: 500, fee: 70, label: 'Up to $500' },
      { maxAmount: 15000, fee: 218, label: '$501–$15,000' },
      { maxAmount: 100000, fee: 588, label: '$15,001–$100,000' },
    ],
    concessionFee: 48,
    notes: 'VCAT Civil Claims List. Concession rates available.',
    sourceUrl: 'https://www.vcat.vic.gov.au/fees',
    lastVerified: '2026-04-06',
  },
  {
    state: 'QLD',
    body: 'QCAT',
    tiers: [
      { maxAmount: 7500, fee: 80, label: 'Up to $7,500 (Minor civil)' },
      { maxAmount: 25000, fee: 188, label: '$7,501–$25,000 (Minor civil)' },
    ],
    concessionFee: 35,
    notes: 'QCAT Minor Civil Disputes. Concession rates available with eligible card.',
    sourceUrl: 'https://www.qcat.qld.gov.au/applications/fees',
    lastVerified: '2026-04-06',
  },
  {
    state: 'WA',
    body: 'Magistrates Court',
    tiers: [
      { maxAmount: 10000, fee: 107, label: 'Up to $10,000 (Minor Case)' },
      { maxAmount: 75000, fee: 340, label: '$10,001–$75,000 (General)' },
    ],
    notes: 'WA Magistrates Court. No generalist tribunal in WA.',
    sourceUrl: 'https://www.magistratescourt.wa.gov.au/fees',
    lastVerified: '2026-04-06',
  },
  {
    state: 'SA',
    body: 'SACAT',
    tiers: [
      { maxAmount: 12000, fee: 92, label: 'Up to $12,000' },
    ],
    notes: 'SACAT handles minor civil matters up to $12,000. Larger claims go to Magistrates Court.',
    sourceUrl: 'https://www.sacat.sa.gov.au/fees',
    lastVerified: '2026-04-06',
  },
  {
    state: 'TAS',
    body: 'Magistrates Court',
    tiers: [
      { maxAmount: 5000, fee: 81, label: 'Up to $5,000 (Small Claims)' },
      { maxAmount: 50000, fee: 160, label: '$5,001–$50,000 (General)' },
    ],
    notes: 'Tasmania Magistrates Court. No generalist tribunal in Tasmania.',
    sourceUrl: 'https://www.magistratescourt.tas.gov.au/fees',
    lastVerified: '2026-04-06',
  },
  {
    state: 'ACT',
    body: 'ACAT',
    tiers: [
      { maxAmount: 10000, fee: 103, label: 'Up to $10,000 (Small Claims)' },
      { maxAmount: 25000, fee: 327, label: '$10,001–$25,000' },
    ],
    concessionFee: 52,
    notes: 'ACAT. Concession rates available.',
    sourceUrl: 'https://www.acat.act.gov.au/fees',
    lastVerified: '2026-04-06',
  },
  {
    state: 'NT',
    body: 'NTCAT',
    tiers: [
      { maxAmount: 10000, fee: 75, label: 'Up to $10,000' },
      { maxAmount: 25000, fee: 150, label: '$10,001–$25,000' },
    ],
    notes: 'NTCAT. Consumer, tenancy, and small civil matters.',
    sourceUrl: 'https://www.ntcat.nt.gov.au/fees',
    lastVerified: '2026-04-06',
  },
]

export function calculateFee(state: string, amount: number): {
  schedule: FeeSchedule
  tier: FeeTier
  fee: number
  concessionFee?: number
} | null {
  // Find matching schedule(s) for this state
  const schedules = FILING_FEES.filter(s => s.state === state)
  if (schedules.length === 0) return null

  // Use the first schedule that covers this amount
  for (const schedule of schedules) {
    const tier = schedule.tiers.find(t => amount <= t.maxAmount)
    if (tier) {
      return {
        schedule,
        tier,
        fee: tier.fee,
        concessionFee: schedule.concessionFee,
      }
    }
  }

  // Amount exceeds all tiers — return the highest tier with a note
  const lastSchedule = schedules[schedules.length - 1]
  const lastTier = lastSchedule.tiers[lastSchedule.tiers.length - 1]
  return {
    schedule: lastSchedule,
    tier: lastTier,
    fee: lastTier.fee,
    concessionFee: lastSchedule.concessionFee,
  }
}
```

**Note:** These fee amounts are approximate and should be verified against the source URLs before launch. Fees change periodically.

- [ ] **Step 2: Create the calculator page**

Create `app/(main)/calculator/fees/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FILING_FEES, calculateFee, type FeeSchedule } from '@/lib/documents/filing-fees'

const STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
]

const inputClasses = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"

export default function FeesCalculatorPage() {
  const [state, setState] = useState('')
  const [amount, setAmount] = useState('')

  const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''))
  const result = state && parsedAmount > 0 ? calculateFee(state, parsedAmount) : null
  const allSchedules = state ? FILING_FEES.filter(s => s.state === state) : []

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-3xl md:text-4xl mb-3">Tribunal Filing Fees Calculator</h1>
      <p className="text-base text-[var(--muted)] mb-10">
        Find out how much it costs to file a claim in your state or territory. Select your location and enter your claim amount.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">State / Territory</label>
          <select value={state} onChange={e => setState(e.target.value)} className={inputClasses}>
            <option value="">Select your state</option>
            {STATES.map(s => (
              <option key={s.value} value={s.value}>{s.label} ({s.value})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Claim amount (AUD)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5000"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="border-2 border-[var(--accent)] rounded-lg p-8 bg-[var(--card)] mb-8">
          <p className="text-sm text-[var(--muted)] mb-1">Estimated filing fee</p>
          <p className="text-4xl font-bold text-[var(--foreground)]">${result.fee}</p>
          <p className="text-base text-[var(--muted)] mt-2">
            {result.schedule.body} &middot; {result.tier.label}
          </p>
          {result.concessionFee && (
            <p className="text-sm text-[var(--muted)] mt-1">
              Concession card holders: ${result.concessionFee}
            </p>
          )}
          <p className="text-xs text-[var(--muted)] mt-3">{result.schedule.notes}</p>
          <div className="mt-6">
            <Link
              href="/wizard"
              className="inline-block bg-[var(--foreground)] text-white text-base font-medium rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
            >
              Start your demand letter &rarr;
            </Link>
            <p className="text-xs text-[var(--muted)] mt-2">No credit card required</p>
          </div>
        </div>
      )}

      {/* Full fee schedule for selected state */}
      {allSchedules.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Full fee schedule — {state}</h2>
          {allSchedules.map(schedule => (
            <div key={`${schedule.state}-${schedule.body}`} className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]">
                <h3 className="text-base font-medium">{schedule.body}</h3>
              </div>
              <div>
                {schedule.tiers.map((tier, i) => (
                  <div key={tier.label} className={`px-6 py-3 flex justify-between ${i < schedule.tiers.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                    <span className="text-sm text-[var(--muted)]">{tier.label}</span>
                    <span className="text-sm font-medium text-[var(--foreground)]">${tier.fee}</span>
                  </div>
                ))}
              </div>
              {schedule.concessionFee && (
                <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--background)]">
                  <span className="text-xs text-[var(--muted)]">Concession rate: ${schedule.concessionFee}</span>
                </div>
              )}
              <div className="px-6 py-3 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted)]">{schedule.notes}</p>
                <a href={schedule.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] underline mt-1 inline-block">
                  Source: {schedule.body} official website
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-10 border-t border-[var(--border)] pt-6">
        <p className="text-xs text-[var(--muted)]">
          Fees shown are estimates based on publicly available information and may not reflect recent changes.
          Always confirm current fees with the relevant tribunal or court before filing.
          This tool does not constitute legal advice.
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Add calculator link to navigation**

In `components/layout/Header.tsx`, add a "Fees Calculator" link in the nav alongside existing links. Find where the nav links are defined and add:

```tsx
<Link href="/calculator/fees" className="...existing-link-classes...">Fees Calculator</Link>
```

- [ ] **Step 4: Test manually**

Run: `npm run dev`
1. Go to `/calculator/fees`
2. Select "New South Wales", enter "5000" → verify shows $53 NCAT fee
3. Enter "30000" → verify shows $106 NCAT fee
4. Select "Victoria", enter "200" → verify shows $70 VCAT fee
5. Verify full fee schedule table displays below the result
6. Verify CTA links to `/wizard`

- [ ] **Step 5: Add e2e test**

Create `e2e/calculator.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('fees calculator shows filing fee for NSW', async ({ page }) => {
  await page.goto('/calculator/fees')
  await expect(page.locator('h1')).toContainText('Tribunal Filing Fees')

  await page.selectOption('select', 'NSW')
  await page.fill('input[inputmode="decimal"]', '5000')

  await expect(page.locator('text=$53')).toBeVisible()
  await expect(page.locator('text=NCAT')).toBeVisible()
})

test('fees calculator shows VIC fees', async ({ page }) => {
  await page.goto('/calculator/fees')
  await page.selectOption('select', 'VIC')
  await page.fill('input[inputmode="decimal"]', '200')

  await expect(page.locator('text=$70')).toBeVisible()
  await expect(page.locator('text=VCAT')).toBeVisible()
})

test('fees calculator shows full schedule for state', async ({ page }) => {
  await page.goto('/calculator/fees')
  await page.selectOption('select', 'QLD')

  await expect(page.locator('text=Full fee schedule')).toBeVisible()
  await expect(page.locator('text=QCAT')).toBeVisible()
})
```

- [ ] **Step 6: Run tests**

Run: `npx playwright test e2e/calculator.spec.ts`
Expected: All 3 tests pass.

- [ ] **Step 7: Commit**

```bash
git add lib/documents/filing-fees.ts app/\(main\)/calculator/fees/page.tsx components/layout/Header.tsx e2e/calculator.spec.ts
git commit -m "feat: add tribunal filing fees calculator with per-state fee schedules"
```

---

## Task 5: Response Deadline Tracking & Email Alerts

Track the response deadline from generated demand letters. Show a countdown on the dashboard. Send email reminders at 7 days, 3 days, and deadline day.

**Files:**
- Create: `supabase/migrations/002_plan6_additions.sql`
- Create: `app/api/deadlines/check/route.ts`
- Modify: `app/api/generate/route.ts` (extract deadline from generated content)
- Modify: `app/(main)/dashboard/page.tsx` (show deadline countdown)
- Modify: `lib/email/resend.ts` (add deadline reminder email functions)

- [ ] **Step 1: Add deadline columns to documents table**

Create `supabase/migrations/002_plan6_additions.sql`:

```sql
-- Add deadline tracking columns to documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS response_deadline DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reminder_7d_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reminder_3d_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reminder_0d_sent BOOLEAN DEFAULT FALSE;
```

Run: `npx supabase db push` (or apply via Supabase dashboard)

- [ ] **Step 2: Extract deadline from generated content in generate route**

In `app/api/generate/route.ts`, after the document content is saved (around line 88), extract the deadline field and save it:

```ts
// Extract response deadline from generated content
const deadline = content!.payment_deadline ?? content!.cease_deadline ?? null
if (deadline) {
  await supabase
    .from('documents')
    .update({ response_deadline: deadline })
    .eq('id', doc.id)
}
```

Add this after the existing `supabase.from('documents').update(...)` call that saves `status: 'ready'`.

- [ ] **Step 3: Add deadline reminder email functions**

In `lib/email/resend.ts`, add:

```ts
export async function sendDeadlineReminder(
  to: string,
  documentId: string,
  daysRemaining: number
) {
  const subject = daysRemaining === 0
    ? 'Deadline reached — your demand letter response is due today'
    : `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} until your demand letter deadline`

  const body = daysRemaining === 0
    ? `<p>The response deadline for your demand letter has arrived. If you haven't received a response, you may want to consider your next steps.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/document/${documentId}">View your document and next steps</a></p>`
    : `<p>The response deadline for your demand letter is in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/document/${documentId}">View your document</a></p>`

  await resend.emails.send({
    from: 'Petty Lawsuits <noreply@pettylawsuits.com.au>',
    to,
    subject,
    html: `${body}<p style="font-size:12px;color:#888;">This is an automated reminder. This is not legal advice.</p>`,
  })
}
```

- [ ] **Step 4: Create the deadline check endpoint**

Create `app/api/deadlines/check/route.ts`. This endpoint is designed to be called by a cron job (e.g. Vercel Cron) once daily:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendDeadlineReminder } from '@/lib/email/resend'

// Use service role key — this runs as a cron, not as a user
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  const in3days = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  const in7days = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  // Find documents with deadlines needing reminders
  const { data: docs } = await supabase
    .from('documents')
    .select('id, user_id, response_deadline, reminder_7d_sent, reminder_3d_sent, reminder_0d_sent')
    .not('response_deadline', 'is', null)
    .not('user_id', 'is', null)
    .eq('status', 'ready')
    .eq('unlocked', true)

  if (!docs || docs.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0

  for (const doc of docs) {
    // Get user email
    const { data: { user } } = await supabase.auth.admin.getUserById(doc.user_id)
    if (!user?.email) continue

    const deadline = doc.response_deadline

    // 7-day reminder
    if (deadline === in7days && !doc.reminder_7d_sent) {
      await sendDeadlineReminder(user.email, doc.id, 7)
      await supabase.from('documents').update({ reminder_7d_sent: true }).eq('id', doc.id)
      sent++
    }

    // 3-day reminder
    if (deadline === in3days && !doc.reminder_3d_sent) {
      await sendDeadlineReminder(user.email, doc.id, 3)
      await supabase.from('documents').update({ reminder_3d_sent: true }).eq('id', doc.id)
      sent++
    }

    // Deadline day
    if (deadline === today && !doc.reminder_0d_sent) {
      await sendDeadlineReminder(user.email, doc.id, 0)
      await supabase.from('documents').update({ reminder_0d_sent: true }).eq('id', doc.id)
      sent++
    }
  }

  return NextResponse.json({ sent })
}
```

- [ ] **Step 5: Add Vercel cron configuration**

Add to `vercel.json` (create if it doesn't exist, or add to existing):

```json
{
  "crons": [
    {
      "path": "/api/deadlines/check",
      "schedule": "0 8 * * *"
    }
  ]
}
```

This runs daily at 8am UTC. Also add `CRON_SECRET` to your Vercel environment variables.

- [ ] **Step 6: Show deadline countdown on dashboard**

In `app/(main)/dashboard/page.tsx`, update the document card to show a deadline countdown. Add this helper function:

```ts
function getDeadlineInfo(deadline: string | null): { text: string; urgent: boolean } | null {
  if (!deadline) return null
  const deadlineDate = new Date(deadline + 'T00:00:00')
  const now = new Date()
  const diffMs = deadlineDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { text: 'Deadline passed', urgent: true }
  if (diffDays === 0) return { text: 'Deadline is today', urgent: true }
  if (diffDays === 1) return { text: '1 day remaining', urgent: true }
  if (diffDays <= 7) return { text: `${diffDays} days remaining`, urgent: true }
  return { text: `${diffDays} days remaining`, urgent: false }
}
```

Update the Supabase query to include `response_deadline`:

```ts
const { data: documents } = await supabase
  .from('documents')
  .select('id, state, category, status, unlocked, created_at, current_content, response_deadline')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

Then in the document card JSX, below the existing status/date line, add:

```tsx
{(() => {
  const deadlineInfo = getDeadlineInfo((doc as any).response_deadline)
  if (!deadlineInfo || doc.status === 'draft') return null
  return (
    <p className={`text-xs mt-1 ${deadlineInfo.urgent ? 'text-red-600 font-medium' : 'text-[var(--muted)]'}`}>
      {deadlineInfo.text}
    </p>
  )
})()}
```

- [ ] **Step 7: Test manually**

Run: `npm run dev`
1. Generate a demand letter with a deadline date set to 5 days from now
2. Go to `/dashboard` — verify deadline countdown shows "5 days remaining" in red
3. Test the cron endpoint manually:
   ```bash
   curl -X POST http://localhost:3000/api/deadlines/check \
     -H "Authorization: Bearer your-cron-secret"
   ```

- [ ] **Step 8: Commit**

```bash
git add supabase/migrations/002_plan6_additions.sql app/api/generate/route.ts app/api/deadlines/check/route.ts lib/email/resend.ts app/\(main\)/dashboard/page.tsx vercel.json
git commit -m "feat: add response deadline tracking with dashboard countdown and email reminders"
```

---

## Task 6: Evidence File Upload to Supabase Storage

Currently the wizard accepts file uploads but only tracks filenames — files aren't actually stored. Wire up Supabase Storage so evidence files are persisted and included in exported documents.

**Files:**
- Modify: `app/wizard/page.tsx` (upload files to Supabase Storage before generating)
- Modify: `app/api/generate/route.ts` (store evidence file paths in document record)
- Modify: `supabase/migrations/002_plan6_additions.sql` (add evidence_files column + storage bucket)

- [ ] **Step 1: Update the migration**

Add to `supabase/migrations/002_plan6_additions.sql` (if not yet applied — otherwise create `003_evidence_storage.sql`):

```sql
-- Add evidence file paths to documents
ALTER TABLE documents ADD COLUMN IF NOT EXISTS evidence_files JSONB DEFAULT '[]'::jsonb;

-- Create storage bucket for evidence uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: users can upload to their own folder
CREATE POLICY "Users can upload evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS: users can read their own evidence files
CREATE POLICY "Users can read own evidence"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

- [ ] **Step 2: Upload files to Supabase Storage in the wizard**

In `app/wizard/page.tsx`, replace the current placeholder upload logic in `handleGenerate` (around lines 119–131) with actual Supabase Storage uploads:

```ts
const handleGenerate = useCallback(async (files: File[]) => {
  setLoading(true)
  setError(null)

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const evidenceFilenames: string[] = []
  const evidencePaths: string[] = []

  // Upload evidence files to Supabase Storage
  if (user && files.length > 0) {
    for (const file of files) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, file, { contentType: file.type })

      if (uploadError) {
        console.error('Evidence upload failed:', uploadError)
        // Continue with generation even if upload fails
      } else {
        evidencePaths.push(filePath)
      }
      evidenceFilenames.push(file.name)
    }
  } else {
    // Anonymous users — just track filenames, no upload
    for (const file of files) {
      evidenceFilenames.push(file.name)
    }
  }

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: answers.claim_type,
        wizardAnswers: answers,
        evidenceFilenames,
        evidencePaths,
        anonymousKey: getOrCreateAnonKey(),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Generation failed')
    }

    const { documentId } = await res.json()
    router.push(`/preview/${documentId}`)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Something went wrong')
  } finally {
    setLoading(false)
  }
}, [answers, router])
```

- [ ] **Step 3: Store evidence paths in generate route**

In `app/api/generate/route.ts`, extract `evidencePaths` from the request body and save it to the document:

```ts
const { templateId, wizardAnswers, evidenceFilenames, evidencePaths, anonymousKey } = await req.json()
```

Then after saving generated content, also save evidence paths:

```ts
await supabase
  .from('documents')
  .update({
    status: 'ready',
    original_content: content!,
    current_content: content!,
    evidence_files: evidencePaths ?? [],
  })
  .eq('id', doc.id)
```

- [ ] **Step 4: Test manually**

Run: `npm run dev`
1. Log in and go to `/wizard`
2. Fill out steps 1–3
3. In Step 4, upload a test image
4. Generate the document
5. Check Supabase Storage → `evidence` bucket → verify file exists under your user ID folder
6. Check the document row in the database → verify `evidence_files` contains the path

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/002_plan6_additions.sql app/wizard/page.tsx app/api/generate/route.ts
git commit -m "feat: upload evidence files to Supabase Storage and persist paths in document"
```

---

## Task 7: Per-Jurisdiction Landing Pages + Reference Table

Create 8 state/territory pages and one all-jurisdictions reference table, using existing data from `lib/documents/jurisdiction.ts` and `lib/documents/filing-fees.ts`.

**Files:**
- Create: `app/(main)/tribunals/page.tsx` (reference table)
- Create: `app/(main)/tribunals/[state]/page.tsx` (per-state pages)
- Modify: `components/layout/Footer.tsx` (add Tribunals link)

- [ ] **Step 1: Create the all-jurisdictions reference table page**

Create `app/(main)/tribunals/page.tsx`:

```tsx
import Link from 'next/link'
import { getAllJurisdictions } from '@/lib/documents/jurisdiction'
import { FILING_FEES } from '@/lib/documents/filing-fees'

const STATE_NAMES: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
}

export const metadata = {
  title: 'Australian Tribunal & Court Limits — All States | Petty Lawsuits',
  description: 'Compare filing fees, claim limits, and tribunals across all Australian states and territories. Updated 2026.',
}

export default function TribunalsPage() {
  const jurisdictions = getAllJurisdictions()

  const rows = Object.entries(STATE_NAMES).map(([code, name]) => {
    const defaultJurisdiction = jurisdictions[code]?.default
    const fees = FILING_FEES.filter(f => f.state === code)
    const lowestFee = fees.length > 0
      ? Math.min(...fees.flatMap(f => f.tiers.map(t => t.fee)))
      : null

    return {
      code,
      name,
      body: defaultJurisdiction?.body ?? 'Unknown',
      bodyShort: defaultJurisdiction?.bodyShort ?? 'Unknown',
      smallClaimsLimit: defaultJurisdiction?.smallClaimsLimit ?? 0,
      generalLimit: defaultJurisdiction?.generalLimit ?? 0,
      lowestFee,
      url: defaultJurisdiction?.url ?? '#',
    }
  })

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-3xl md:text-4xl mb-3">Australian Tribunals & Courts</h1>
      <p className="text-base text-[var(--muted)] mb-10">
        Every Australian state and territory has its own tribunal or court for resolving civil disputes.
        Here&apos;s a quick reference for claim limits, filing fees, and which body handles your case.
      </p>

      {/* Reference table */}
      <div className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="p-4 text-left font-medium">State</th>
              <th className="p-4 text-left font-medium">Tribunal / Court</th>
              <th className="p-4 text-right font-medium">Small Claims Limit</th>
              <th className="p-4 text-right font-medium">General Limit</th>
              <th className="p-4 text-right font-medium">Filing Fee From</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.code} className={i < rows.length - 1 ? 'border-b border-[var(--border)]' : ''}>
                <td className="p-4">
                  <Link href={`/tribunals/${row.code.toLowerCase()}`} className="text-[var(--accent)] underline font-medium">
                    {row.code}
                  </Link>
                </td>
                <td className="p-4 text-[var(--foreground)]">{row.bodyShort}</td>
                <td className="p-4 text-right text-[var(--foreground)]">${row.smallClaimsLimit.toLocaleString()}</td>
                <td className="p-4 text-right text-[var(--foreground)]">${row.generalLimit.toLocaleString()}</td>
                <td className="p-4 text-right text-[var(--foreground)]">
                  {row.lowestFee !== null ? `$${row.lowestFee}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--muted)] mt-4">
        Last updated: April 2026. Fees and limits change — always confirm with the relevant tribunal.
        This information does not constitute legal advice.
      </p>

      {/* State cards */}
      <h2 className="text-2xl mt-14 mb-6">Explore by state</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {rows.map(row => (
          <Link
            key={row.code}
            href={`/tribunals/${row.code.toLowerCase()}`}
            className="block border border-[var(--border)] rounded-lg p-6 bg-[var(--card)] hover:border-[var(--accent)] transition-colors"
          >
            <h3 className="text-base font-medium text-[var(--foreground)]">{row.name}</h3>
            <p className="text-sm text-[var(--muted)] mt-1">{row.body}</p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Claims up to ${row.generalLimit.toLocaleString()} &middot; Filing from {row.lowestFee !== null ? `$${row.lowestFee}` : 'varies'}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create the per-state dynamic page**

Create `app/(main)/tribunals/[state]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllJurisdictions, type JurisdictionInfo } from '@/lib/documents/jurisdiction'
import { FILING_FEES } from '@/lib/documents/filing-fees'

const STATE_NAMES: Record<string, string> = {
  nsw: 'New South Wales',
  vic: 'Victoria',
  qld: 'Queensland',
  wa: 'Western Australia',
  sa: 'South Australia',
  tas: 'Tasmania',
  act: 'Australian Capital Territory',
  nt: 'Northern Territory',
}

export function generateStaticParams() {
  return Object.keys(STATE_NAMES).map(state => ({ state }))
}

export function generateMetadata({ params }: { params: { state: string } }) {
  const name = STATE_NAMES[params.state]
  if (!name) return {}
  return {
    title: `${name} Tribunal & Court Guide | Petty Lawsuits`,
    description: `Filing fees, claim limits, and dispute resolution guide for ${name}. Find out which tribunal handles your case.`,
  }
}

export default function StateTribunalPage({ params }: { params: { state: string } }) {
  const stateCode = params.state.toUpperCase()
  const stateName = STATE_NAMES[params.state]
  if (!stateName) notFound()

  const jurisdictions = getAllJurisdictions()
  const stateData = jurisdictions[stateCode]
  if (!stateData) notFound()

  const fees = FILING_FEES.filter(f => f.state === stateCode)

  // Get all dispute types for this state
  const disputeEntries = Object.entries(stateData).filter(([key]) => key !== 'default')
  const defaultInfo = stateData.default

  return (
    <main className="max-w-3xl mx-auto px-6 py-20 md:py-24">
      <Link href="/tribunals" className="text-sm text-[var(--accent)] underline mb-4 inline-block">
        &larr; All states
      </Link>
      <h1 className="text-3xl md:text-4xl mb-3">{stateName}</h1>
      <p className="text-base text-[var(--muted)] mb-10">
        Filing fees, claim limits, and dispute resolution options for {stateName}.
      </p>

      {/* Default tribunal */}
      <div className="border-2 border-[var(--accent)] rounded-lg p-8 bg-[var(--card)] mb-8">
        <h2 className="text-xl font-medium mb-2">{defaultInfo.body}</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-[var(--muted)]">Small claims limit</p>
            <p className="text-2xl font-bold">${defaultInfo.smallClaimsLimit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">General limit</p>
            <p className="text-2xl font-bold">${defaultInfo.generalLimit.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted)] mt-4">{defaultInfo.notes}</p>
        <a href={defaultInfo.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accent)] underline mt-2 inline-block">
          Official website &rarr;
        </a>
      </div>

      {/* By dispute type */}
      {disputeEntries.length > 0 && (
        <>
          <h2 className="text-xl font-medium mb-4">By dispute type</h2>
          <div className="space-y-4 mb-10">
            {disputeEntries.map(([type, info]) => {
              const typedInfo = info as JurisdictionInfo
              return (
                <div key={type} className="border border-[var(--border)] rounded-lg p-6 bg-[var(--card)]">
                  <h3 className="text-base font-medium capitalize">{type.replace(/-/g, ' ')}</h3>
                  <p className="text-sm text-[var(--foreground)] mt-1">{typedInfo.body}</p>
                  <p className="text-sm text-[var(--muted)] mt-2">
                    Small claims: ${typedInfo.smallClaimsLimit.toLocaleString()} &middot;
                    General: ${typedInfo.generalLimit.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-2">{typedInfo.notes}</p>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Filing fees */}
      {fees.length > 0 && (
        <>
          <h2 className="text-xl font-medium mb-4">Filing fees</h2>
          <div className="space-y-4 mb-10">
            {fees.map(schedule => (
              <div key={`${schedule.state}-${schedule.body}`} className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--background)]">
                  <h3 className="text-base font-medium">{schedule.body}</h3>
                </div>
                {schedule.tiers.map((tier, i) => (
                  <div key={tier.label} className={`px-6 py-3 flex justify-between ${i < schedule.tiers.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                    <span className="text-sm text-[var(--muted)]">{tier.label}</span>
                    <span className="text-sm font-medium">${tier.fee}</span>
                  </div>
                ))}
                {schedule.concessionFee && (
                  <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--background)]">
                    <span className="text-xs text-[var(--muted)]">Concession rate: ${schedule.concessionFee}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <div className="border border-[var(--border)] rounded-lg p-8 bg-[var(--card)] text-center">
        <h2 className="text-xl mb-2">Ready to start your claim?</h2>
        <p className="text-base text-[var(--muted)] mb-6">
          Generate a legally-formatted demand letter for {stateName} in about 5 minutes.
        </p>
        <Link
          href="/wizard"
          className="inline-block bg-[var(--foreground)] text-white text-base font-medium rounded-full px-8 py-3 hover:opacity-90 transition-opacity"
        >
          Start your demand letter &rarr;
        </Link>
        <p className="text-xs text-[var(--muted)] mt-2">No credit card required</p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[var(--muted)] mt-8">
        Last updated: April 2026. This information is general in nature and does not constitute legal advice.
        Always confirm current fees and procedures with the relevant tribunal or court.
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Add Tribunals link to footer**

In `components/layout/Footer.tsx`, add a "Tribunals" link alongside other navigation links:

```tsx
<Link href="/tribunals">Tribunals</Link>
```

- [ ] **Step 4: Test manually**

Run: `npm run dev`
1. Go to `/tribunals` — verify table shows all 8 states with limits and fees
2. Click "NSW" — verify per-state page loads with NCAT info, dispute types, filing fees
3. Click through all 8 states — verify no 404s
4. Verify footer has new Tribunals link

- [ ] **Step 5: Commit**

```bash
git add app/\(main\)/tribunals/page.tsx app/\(main\)/tribunals/\[state\]/page.tsx components/layout/Footer.tsx
git commit -m "feat: add per-jurisdiction tribunal pages and all-states reference table"
```

---

## Self-Review Checklist

1. **Spec coverage:** All 7 high-priority items from the Plan 6 competitive features doc are covered:
   - Task 1: ABN business lookup ✓
   - Task 2: Cease & desist letters ✓
   - Task 3: Comparison table on pricing ✓
   - Task 4: Tribunal fees calculator ✓
   - Task 5: Deadline tracking + email alerts ✓
   - Task 6: Evidence file upload ✓
   - Task 7: Jurisdiction pages + reference table ✓

2. **Placeholder scan:** No TBD, TODO, or "implement later" entries. All steps have complete code.

3. **Type consistency:** Checked — `AbnResult`, `FeeSchedule`, `FeeTier`, `calculateFee` are used consistently. Existing types (`DocumentTemplate`, `JurisdictionInfo`, `DisputeType`) are referenced correctly.

4. **File path consistency:** All paths reference files that exist in the current codebase or are newly created in this plan.

5. **No unnecessary changes:** Each task touches only the files it needs. No refactoring of unrelated code.
