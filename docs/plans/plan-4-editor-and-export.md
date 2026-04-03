# Plan 4: Editor & Export

**Goal:** Build the in-browser form-field editor and server-side PDF/Word export — so unlocked users can edit their document and download it.

**Architecture:** The editor renders document fields as editable inputs inline with the read-only legal text. Changes auto-save to Supabase. "Restore original" reverts `current_content` to `original_content`. PDF and Word files are generated server-side on demand and stored in Supabase Storage; the frontend receives a signed URL.

**Tech Stack:** `@react-pdf/renderer`, `docx`, Supabase Storage

**Depends on:** Plans 1, 2 & 3

**Deliverable:** An unlocked user can edit their document, restore the original, and download it as PDF or Word.

---

## File structure

```
app/
├── document/
│   └── [documentId]/
│       ├── page.tsx                     # Editor page (checks unlocked, server component)
│       └── download/
│           └── route.ts                 # GET: generate and serve PDF or Word
components/
└── document/
    ├── DocumentEditor.tsx               # Editor shell (manages save state)
    ├── FieldInput.tsx                   # Single editable field rendered inline
    ├── DocumentView.tsx                 # Renders document with editable/read-only sections
    └── NextStepsBlurb.tsx               # State-specific guidance blurb
lib/
└── documents/
    ├── export.ts                        # PDF and Word generation
    └── next-steps.ts                    # State → blurb mapping
```

---

## Tasks

### Task 1: Editor page

- [ ] Create `app/document/[documentId]/page.tsx` as a server component:
  - Fetch document from Supabase
  - If not `unlocked`, redirect to `/preview/[documentId]`
  - Render `DocumentEditor` with the document's template, `current_content`, and state
- [ ] Create `components/document/DocumentEditor.tsx` as a client component:
  - Receives template fields and current field values as props
  - Manages local edit state
  - Auto-saves to Supabase every 30 seconds and on field blur via a PATCH to a new API route `/api/documents/[id]`
  - Exposes a manual "Save" button
  - Exposes a "Restore original" button that calls the same API route with `original_content`
- [ ] Create `app/api/documents/[id]/route.ts`:
  ```ts
  // PATCH: update current_content
  // Called by the editor on auto-save, manual save, and restore original
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add document editor with auto-save"`

---

### Task 2: Inline field rendering

- [ ] Create `components/document/FieldInput.tsx`:
  ```tsx
  type Props = {
    field: DocumentField
    value: string
    onChange: (key: string, value: string) => void
  }

  export function FieldInput({ field, value, onChange }: Props) {
    return (
      <span className="inline-block">
        <input
          type={field.type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={e => onChange(field.key, e.target.value)}
          className="border-b border-blue-400 bg-blue-50 px-1 min-w-[120px] focus:outline-none"
          aria-label={field.label}
        />
      </span>
    )
  }
  ```
- [ ] Create `components/document/DocumentView.tsx` — renders the document as a formatted block with `FieldInput` components inline where the variable fields appear, and read-only styled text for the surrounding legal content
- [ ] Run the dev server and verify editing fields works and values update in real time
- [ ] Commit: `git add -A && git commit -m "feat: add inline field editor component"`

---

### Task 3: Next steps blurb

- [ ] Create `lib/documents/next-steps.ts`:
  ```ts
  // One lawyer-reviewed blurb per state — placeholder text until lawyer provides final copy
  export const NEXT_STEPS: Record<string, string> = {
    NSW: 'If you wish to pursue this matter further, people in this situation sometimes make an application to NCAT (NSW Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through LawAccess NSW: lawaccess.nsw.gov.au',
    VIC: 'If you wish to pursue this matter further, people in this situation sometimes make an application to VCAT (Victorian Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Victoria Legal Aid: legalaid.vic.gov.au',
    QLD: 'If you wish to pursue this matter further, people in this situation sometimes make an application to QCAT (Queensland Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid Queensland: legalaid.qld.gov.au',
    WA: 'If you wish to pursue this matter further, people in this situation sometimes make an application to SAT (State Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid WA: legalaid.wa.gov.au',
    SA: 'If you wish to pursue this matter further, people in this situation sometimes make an application to SACAT (South Australian Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Services Commission SA: lsc.sa.gov.au',
    TAS: 'If you wish to pursue this matter further, people in this situation sometimes make an application to TASCAT. You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid Commission of Tasmania: legalaid.tas.gov.au',
    ACT: 'If you wish to pursue this matter further, people in this situation sometimes make an application to ACAT (ACT Civil and Administrative Tribunal). You should seek independent legal advice if you are unsure about your rights. Free legal help is available through Legal Aid ACT: legalaidact.org.au',
    NT: 'If you wish to pursue this matter further, people in this situation sometimes make an application to the Local Court of the Northern Territory. You should seek independent legal advice if you are unsure about your rights. Free legal help is available through NAAJA or the North Australian Aboriginal Justice Agency.',
  }

  // NOTE: These blurbs must be reviewed and approved by a lawyer before public launch.
  ```
- [ ] Create `components/document/NextStepsBlurb.tsx` — renders the blurb for the document's state with a disclaimer notice above it
- [ ] Add the blurb below the document editor
- [ ] Commit: `git add -A && git commit -m "feat: add next-steps blurb component"`

---

### Task 4: PDF export

- [ ] Install: `npm install @react-pdf/renderer`
- [ ] Create `lib/documents/export.ts` with a `generatePDF` function:
  ```ts
  import { renderToBuffer } from '@react-pdf/renderer'
  import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
  import React from 'react'
  import type { DocumentTemplate } from './templates'

  const styles = StyleSheet.create({
    page: { padding: 60, fontFamily: 'Times-Roman', fontSize: 11, lineHeight: 1.6 },
    title: { fontSize: 14, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontWeight: 'bold', marginTop: 12 },
    value: { marginBottom: 6 },
    disclaimer: { marginTop: 30, fontSize: 9, color: '#666', borderTop: '1 solid #ccc', paddingTop: 10 },
  })

  export async function generatePDF(
    template: DocumentTemplate,
    content: Record<string, string>
  ): Promise<Buffer> {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.title}>{template.label}</Text>
            {template.fields.map(field => (
              <View key={field.key}>
                <Text style={styles.label}>{field.label}:</Text>
                <Text style={styles.value}>{content[field.key] ?? ''}</Text>
              </View>
            ))}
            <Text style={styles.disclaimer}>
              This document was generated using a template tool. It is not legal advice.
              You should seek independent legal advice if you are unsure about your rights or obligations.
            </Text>
          </View>
        </Page>
      </Document>
    )
    return await renderToBuffer(doc)
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add PDF generation"`

---

### Task 5: Word export

- [ ] Install: `npm install docx`
- [ ] Add a `generateWord` function to `lib/documents/export.ts`:
  ```ts
  import { Document as WordDocument, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

  export async function generateWord(
    template: DocumentTemplate,
    content: Record<string, string>
  ): Promise<Buffer> {
    const children = [
      new Paragraph({ text: template.label, heading: HeadingLevel.HEADING_1 }),
      ...template.fields.flatMap(field => [
        new Paragraph({ children: [new TextRun({ text: field.label + ':', bold: true })] }),
        new Paragraph({ text: content[field.key] ?? '' }),
      ]),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [new TextRun({
          text: 'This document was generated using a template tool. It is not legal advice. You should seek independent legal advice if you are unsure about your rights or obligations.',
          italics: true, size: 18,
        })]
      }),
    ]

    const doc = new WordDocument({ sections: [{ children }] })
    return await Packer.toBuffer(doc)
  }
  ```
- [ ] Commit: `git add -A && git commit -m "feat: add Word document generation"`

---

### Task 6: Download API route + Supabase Storage

- [ ] In Supabase dashboard → Storage, create a private bucket called `documents`
- [ ] Create `app/document/[documentId]/download/route.ts`:
  ```ts
  import { NextRequest, NextResponse } from 'next/server'
  import { createClient } from '@/lib/supabase/server'
  import { getTemplate } from '@/lib/documents/templates'
  import { generatePDF, generateWord } from '@/lib/documents/export'

  export async function GET(req: NextRequest, { params }: { params: { documentId: string } }) {
    const format = req.nextUrl.searchParams.get('format') ?? 'pdf' // 'pdf' | 'word'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: doc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.documentId)
      .eq('user_id', user.id)
      .eq('unlocked', true)
      .single()

    if (!doc) return NextResponse.json({ error: 'Document not found or not unlocked' }, { status: 404 })

    const template = getTemplate(doc.category)
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 400 })

    const storagePath = `${user.id}/${params.documentId}.${format === 'word' ? 'docx' : 'pdf'}`

    // Check if already generated
    const { data: existing } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 300)

    if (existing?.signedUrl) {
      return NextResponse.redirect(existing.signedUrl)
    }

    // Generate and store
    const buffer = format === 'word'
      ? await generateWord(template, doc.current_content)
      : await generatePDF(template, doc.current_content)

    await supabase.storage
      .from('documents')
      .upload(storagePath, buffer, {
        contentType: format === 'word'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/pdf',
        upsert: true,
      })

    const { data: signed } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, 300)

    return NextResponse.redirect(signed!.signedUrl)
  }
  ```
- [ ] Add download buttons to the editor page linking to `/document/[id]/download?format=pdf` and `?format=word`
- [ ] Commit: `git add -A && git commit -m "feat: add PDF and Word download routes with Supabase Storage"`

---

### Task 7: End-to-end editor test

- [ ] Complete full flow: wizard → pay → editor appears → edit a field → save → restore original → download PDF → download Word
- [ ] Verify that a non-unlocked document cannot access the editor page (redirects to preview)
- [ ] Verify downloads work and files open correctly
- [ ] Push: `git push origin main`

---

**Plan 4 complete when:** An unlocked user can edit their document, restore the original, and successfully download a PDF and Word file.
