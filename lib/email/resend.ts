import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    // Use a placeholder key at build time to avoid crashing during Next.js page data collection.
    // Actual sends will fail gracefully if the real key is missing at runtime.
    const key = process.env.RESEND_API_KEY || 're_build_placeholder'
    _resend = new Resend(key)
  }
  return _resend
}

const FROM = 'Petty Lawsuits <noreply@pettylawsuits.com.au>'
const DISCLAIMER =
  'This document was generated using a template tool. It is not legal advice.'

export async function sendDocumentReady(to: string, documentId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://pettylawsuits.com.au'
  const documentUrl = `${appUrl}/document/${documentId}`

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Your document is ready',
    html: `
      <p>Your document has been generated and is ready to view.</p>
      <p><a href="${documentUrl}">View your document</a></p>
      <hr />
      <p style="color: #666; font-size: 0.875rem;">${DISCLAIMER}</p>
    `,
  })
}

export async function sendUnlockFailure(to: string) {
  const supportEmail = 'support@pettylawsuits.com.au'

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'There was a problem unlocking your document',
    html: `
      <p>Your payment was received, but we were unable to unlock your document automatically.</p>
      <p>Please contact us at <a href="mailto:${supportEmail}">${supportEmail}</a> and we will sort it out promptly.</p>
      <hr />
      <p style="color: #666; font-size: 0.875rem;">${DISCLAIMER}</p>
    `,
  })
}
