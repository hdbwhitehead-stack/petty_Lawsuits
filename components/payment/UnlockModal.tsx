'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UnlockTierCard from './UnlockTierCard'
import { StickerButton } from '@/components/ui/StickerButton'

type Props = {
  documentId: string
  recipientName: string
  isAuthenticated: boolean
}

export default function UnlockModal({ documentId, recipientName, isAuthenticated }: Props) {
  const router = useRouter()
  const exitDestination = isAuthenticated ? '/dashboard' : '/'

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className="max-w-2xl w-full relative"
        style={{
          background: 'var(--background)',
          border: '2px solid var(--foreground)',
          borderRadius: 20,
          boxShadow: '6px 6px 0 #1A1814',
          padding: 32,
        }}
      >
        {/* Close */}
        <button
          onClick={() => router.push(exitDestination)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--accent-tint)] transition-colors"
          aria-label="Close"
          style={{ border: '2px solid var(--foreground)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isAuthenticated ? (
          /* Sign-up gate */
          <div className="text-center">
            <h2 className="text-2xl font-display font-extrabold mb-3">Your letter is ready</h2>
            <p className="text-[var(--muted)] mb-8 max-w-sm mx-auto">
              Create a free account to unlock your demand letter to{' '}
              <strong className="text-[var(--foreground)]">{recipientName}</strong>.
              Your document is saved and waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <StickerButton as={Link} href={`/signup?documentId=${documentId}`} variant="primary" size="md">
                Create free account
              </StickerButton>
              <StickerButton as={Link} href={`/login?returnTo=/preview/${documentId}`} variant="ghost" size="md">
                Log in
              </StickerButton>
            </div>
            <p className="text-xs text-[var(--muted)] mt-6">
              Free to create an account. Pay only when you unlock.
            </p>
          </div>
        ) : (
          /* Tier cards */
          <>
            <h2 className="text-2xl font-display font-extrabold text-center mb-1">Your letter is ready</h2>
            <p className="text-center text-[var(--muted)] mb-8 text-sm">
              Demand to <strong className="text-[var(--foreground)]">{recipientName}</strong> — unlock to view, edit &amp; download.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

            {/* Testimonial */}
            <div
              className="mt-5 px-5 py-4 rounded-2xl"
              style={{
                background: 'var(--sky-tint)',
                border: '2px solid var(--foreground)',
                boxShadow: '2px 2px 0 #1A1814',
              }}
            >
              <p
                className="text-base text-center"
                style={{ fontFamily: 'var(--font-marker)', color: 'var(--foreground)' }}
              >
                &ldquo;Got my bond back in 11 days. Worth every cent. ✦&rdquo;
              </p>
              <p className="text-xs text-center text-[var(--muted)] mt-1">— Maya, VIC</p>
            </div>

            <div className="flex items-center justify-center gap-4 mt-5">
              <button
                onClick={() => router.back()}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
              >
                Go back and edit
              </button>
              <span style={{ color: 'var(--border)' }}>|</span>
              <button
                onClick={() => router.push(exitDestination)}
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-4 transition-colors"
              >
                Back to My Cases
              </button>
            </div>
          </>
        )}

        <p className="text-xs text-[var(--muted)] text-center mt-5">
          This document was generated using a template tool. It is not legal advice.
        </p>
      </div>
    </div>
  )
}
