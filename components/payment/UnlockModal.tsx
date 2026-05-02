'use client'
import { useRouter } from 'next/navigation'
import UnlockTierCard from './UnlockTierCard'

type Props = {
  documentId: string
  recipientName: string
  isAuthenticated: boolean
}

export default function UnlockModal({ documentId, recipientName, isAuthenticated }: Props) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-xl max-w-2xl w-full p-8 relative">
        {/* Close / go back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-colors"
          aria-label="Close and return to dashboard"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isAuthenticated ? (
          /* Sign-up gate — shown to unauthenticated users */
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3 text-[var(--foreground)]">Your Letter Is Ready</h2>
            <p className="text-[var(--muted)] mb-8 max-w-sm mx-auto">
              Create a free account to unlock your demand letter to{' '}
              <strong className="text-[var(--foreground)]">{recipientName}</strong>.
              Your document is saved and waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`/signup?documentId=${documentId}`}
                className="bg-[var(--foreground)] text-white rounded-full px-8 py-3 text-base font-medium hover:opacity-90 transition-opacity"
              >
                Create free account
              </a>
              <a
                href={`/login?returnTo=/preview/${documentId}`}
                className="border border-[var(--border)] text-[var(--foreground)] rounded-full px-8 py-3 text-base font-medium hover:bg-[var(--accent-light)] transition-colors"
              >
                Log in
              </a>
            </div>
            <p className="text-xs text-[var(--muted)] mt-6">
              Free to create an account. Pay only when you unlock your document.
            </p>
          </div>
        ) : (
          /* Tier cards — shown to authenticated users */
          <>
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
                onClick={() => router.push('/dashboard')}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
              >
                Back to My Documents
              </button>
            </div>
          </>
        )}

        <p className="text-xs text-[var(--muted)] text-center mt-4">
          This document was generated using a template tool. It is not legal advice.
        </p>
      </div>
    </div>
  )
}
