import type { DocumentTemplate } from './templates'

// ---------------------------------------------------------------------------
// PDF generation using @react-pdf/renderer
// ---------------------------------------------------------------------------

export async function generatePDF(
  template: DocumentTemplate,
  content: Record<string, string>
): Promise<Buffer> {
  // Dynamic import to avoid issues with SSR/Edge runtime
  const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')
  const React = await import('react')

  const styles = StyleSheet.create({
    page: {
      padding: 60,
      paddingBottom: 80,
      fontFamily: 'Times-Roman',
      fontSize: 11,
      lineHeight: 1.6,
    },
    // Title block at top of letter
    titleBlock: {
      marginBottom: 28,
      paddingBottom: 14,
      borderBottom: '1.5 solid #333333',
    },
    title: { fontSize: 15, fontWeight: 'bold', textAlign: 'center', letterSpacing: 0.5 },
    dateLine: { fontSize: 10, color: '#555555', textAlign: 'right', marginTop: 8 },
    // Structured fields (name, date, amount — short values)
    fieldGroup: { marginTop: 16 },
    fieldRow: {
      flexDirection: 'row',
      marginBottom: 6,
      paddingBottom: 4,
      borderBottom: '0.5 solid #eeeeee',
    },
    fieldLabel: {
      width: '35%',
      fontWeight: 'bold',
      fontSize: 10,
      color: '#444444',
      textTransform: 'uppercase',
    },
    fieldValue: { width: '65%', fontSize: 11 },
    // Textarea fields (long-form content — rendered as paragraphs)
    textBlock: { marginTop: 20, marginBottom: 8 },
    textLabel: {
      fontWeight: 'bold',
      fontSize: 10,
      color: '#444444',
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    textParagraph: { fontSize: 11, lineHeight: 1.7, textAlign: 'justify' },
    // Signature area
    signatureBlock: { marginTop: 40 },
    signatureLine: {
      width: 200,
      borderBottom: '1 solid #333333',
      marginBottom: 4,
      marginTop: 30,
    },
    signatureLabel: { fontSize: 9, color: '#555555' },
    // Footer disclaimer
    disclaimer: {
      marginTop: 'auto',
      fontSize: 7.5,
      color: '#999999',
      borderTop: '0.5 solid #cccccc',
      paddingTop: 8,
      lineHeight: 1.4,
    },
  })

  // Separate fields into short (row layout) and long (paragraph layout)
  const shortFields = template.fields.filter(f => f.type !== 'textarea')
  const longFields = template.fields.filter(f => f.type === 'textarea')

  // Find a likely signer name from content
  const signerKey = template.fields.find(f =>
    /your.*name|complainant.*name|creditor.*name|tenant.*name/i.test(f.label)
  )?.key
  const signerName = signerKey ? content[signerKey] ?? '' : ''

  const today = new Date().toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Title block
      React.createElement(
        View,
        { style: styles.titleBlock },
        React.createElement(Text, { style: styles.title }, template.label),
        React.createElement(Text, { style: styles.dateLine }, today),
      ),

      // Short fields as label–value rows
      shortFields.length > 0 && React.createElement(
        View,
        { style: styles.fieldGroup },
        ...shortFields.map(field =>
          React.createElement(
            View,
            { key: field.key, style: styles.fieldRow },
            React.createElement(Text, { style: styles.fieldLabel }, field.label),
            React.createElement(Text, { style: styles.fieldValue }, content[field.key] ?? ''),
          )
        ),
      ),

      // Long-form fields as paragraphs
      ...longFields.map(field =>
        React.createElement(
          View,
          { key: field.key, style: styles.textBlock },
          React.createElement(Text, { style: styles.textLabel }, field.label),
          // Split on double-newlines so multi-paragraph content renders properly
          ...(content[field.key] ?? '').split(/\n\n+/).map((para, i) =>
            React.createElement(Text, { key: i, style: styles.textParagraph }, para.replace(/\n/g, ' '))
          ),
        )
      ),

      // Signature block
      React.createElement(
        View,
        { style: styles.signatureBlock },
        React.createElement(View, { style: styles.signatureLine }),
        React.createElement(Text, { style: styles.signatureLabel }, signerName || 'Signature'),
        React.createElement(Text, { style: styles.signatureLabel }, `Date: ${today}`),
      ),

      // Disclaimer
      React.createElement(
        Text,
        { style: styles.disclaimer },
        'This document was generated using a template tool. It is not legal advice. You should seek independent legal advice if you are unsure about your rights or obligations.'
      ),
    )
  )

  const instance = pdf(doc)
  // toBuffer() returns a ReadableStream in types but a Buffer in Node.js runtime
  const result = await instance.toBuffer() as unknown as Buffer
  return Buffer.isBuffer(result) ? result : Buffer.from(result as unknown as ArrayBuffer)
}

// ---------------------------------------------------------------------------
// Word generation using docx
// ---------------------------------------------------------------------------

export async function generateWord(
  template: DocumentTemplate,
  content: Record<string, string>
): Promise<Buffer> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, TabStopPosition, TabStopType, BorderStyle } = await import('docx')

  const shortFields = template.fields.filter(f => f.type !== 'textarea')
  const longFields = template.fields.filter(f => f.type === 'textarea')

  const signerKey = template.fields.find(f =>
    /your.*name|complainant.*name|creditor.*name|tenant.*name/i.test(f.label)
  )?.key
  const signerName = signerKey ? content[signerKey] ?? '' : ''

  const today = new Date().toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const children: InstanceType<typeof Paragraph>[] = [
    // Title
    new Paragraph({ text: template.label, heading: HeadingLevel.HEADING_1 }),
    // Date right-aligned
    new Paragraph({
      children: [new TextRun({ text: today, size: 20, color: '555555' })],
      alignment: 'right' as const,
      spacing: { after: 300 },
    }),

    // Short fields as tabbed label–value pairs
    ...shortFields.flatMap(field => [
      new Paragraph({
        children: [
          new TextRun({ text: field.label + ':', bold: true, size: 20 }),
          new TextRun({ text: '\t' }),
          new TextRun({ text: content[field.key] ?? '', size: 22 }),
        ],
        tabStops: [{ type: TabStopType.LEFT, position: TabStopPosition.MAX * 0.35 }],
        spacing: { after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' } },
      }),
    ]),

    // Spacer before long-form content
    new Paragraph({ text: '', spacing: { after: 200 } }),

    // Long-form fields as paragraphs
    ...longFields.flatMap(field => [
      new Paragraph({
        children: [new TextRun({ text: field.label, bold: true, size: 20, allCaps: true })],
        spacing: { before: 240, after: 80 },
      }),
      ...(content[field.key] ?? '').split(/\n\n+/).map(para =>
        new Paragraph({
          children: [new TextRun({ text: para.replace(/\n/g, ' '), size: 22 })],
          spacing: { after: 120 },
        })
      ),
    ]),

    // Signature block
    new Paragraph({ text: '', spacing: { before: 600 } }),
    new Paragraph({
      children: [new TextRun({ text: '____________________________', size: 22 })],
    }),
    new Paragraph({
      children: [new TextRun({ text: signerName || 'Signature', size: 18, color: '555555' })],
    }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${today}`, size: 18, color: '555555' })],
      spacing: { after: 400 },
    }),

    // Disclaimer
    new Paragraph({
      children: [
        new TextRun({
          text: 'This document was generated using a template tool. It is not legal advice. You should seek independent legal advice if you are unsure about your rights or obligations.',
          italics: true,
          size: 16,
          color: '999999',
        }),
      ],
      spacing: { before: 400 },
      border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    }),
  ]

  const doc = new Document({ sections: [{ children }] })
  return await Packer.toBuffer(doc)
}
