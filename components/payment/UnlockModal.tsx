'use client'
import { useRouter } from 'next/navigation'
import UnlockTierCard from './UnlockTierCard'

type Props = {
  documentId: string
  recipientName: string
}

export default function UnlockModal({ documentId, recipientName }: Props) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-xl max-w-2xl w-full p-8 relative">
        {/* Close / go back */}
        <button
          onClick={() => router.push('/wizard')}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-colors"
          aria-label="Close and return to wizard"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center mb-2 text-[var(--foreground)]">Your Letter Is Ready</h2>
        <p className="text-center text-[var(--muted)] mb-8">
          Demand letter to <strong className="text-[var(--foreground)]">{recipientName}</strong> has been generated.
          Unlock it to view, edit, and download.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UnlockTierCard
            name="Send the Letter"
            price="$29"
            tierType="send"
            documentId={documentId}
            features={[
              'Full document access',
              'Download as PDF',
              'Email delivery to recipient',
            ]}
          />
          <UnlockTierCard
            name="Go Full Petty"
            price="$49"
            tierType="full_petty"
            documentId={documentId}
            highlight
            features={[
              'Everything in Send the Letter',
              'Download as Word doc',
              'Edit all fields in-browser',
              'Certified mail tracking',
              'Follow-up letter template',
            ]}
          />
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
          >
            Go back and edit
          </button>
          <span className="text-[var(--border)]">|</span>
          <button
            onClick={() => router.push('/wizard')}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
          >
            Start over
          </button>
        </div>

        <p className="text-xs text-[var(--muted)] text-center mt-4">
          This document was generated using a template tool. It is not legal advice.
        </p>
      </div>
    </div>
  )
}
