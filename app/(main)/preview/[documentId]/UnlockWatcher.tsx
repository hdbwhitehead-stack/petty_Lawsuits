'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Stamp } from '@/components/ui/Stamp'

type Props = {
  documentId: string
}

export default function UnlockWatcher({ documentId }: Props) {
  const [timedOut, setTimedOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('documents')
        .select('unlocked')
        .eq('id', documentId)
        .single()

      if (data?.unlocked) {
        clearInterval(interval)
        router.push(`/document/${documentId}`)
      }
    }, 2000)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setTimedOut(true)
    }, 300000)

    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [documentId, router, supabase])

  if (timedOut) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div
          style={{
            background: 'var(--background)',
            border: '2px solid var(--foreground)',
            borderRadius: 20,
            boxShadow: '6px 6px 0 #1A1814',
            padding: 40,
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <h2 className="text-xl font-display font-extrabold mb-3">Something went wrong</h2>
          <p className="text-[var(--muted)] text-sm">
            Email us at <strong>support@pettylawsuits.com.au</strong> and we&apos;ll sort it out.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        style={{
          background: 'var(--background)',
          border: '2px solid var(--foreground)',
          borderRadius: 20,
          boxShadow: '6px 6px 0 #1A1814',
          padding: 48,
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Giant FILED stamp */}
        <div className="flex justify-center mb-6">
          <Stamp size={120} rotate={-8} color="var(--grass)">FILED</Stamp>
        </div>

        {/* +200 XP chip */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-bold"
          style={{
            background: 'var(--lemon)',
            border: '2px solid var(--foreground)',
            borderRadius: '999px',
            boxShadow: '3px 3px 0 #1A1814',
          }}
        >
          ⚡ +200 XP earned
        </div>

        <p
          className="text-2xl block mb-3"
          style={{ fontFamily: 'var(--font-marker)' }}
        >
          officially petty ✦
        </p>

        <p className="text-sm text-[var(--muted)]">
          Confirming your payment and unlocking your document…
        </p>

        {/* Spinner */}
        <div
          className="mt-5 mx-auto animate-spin rounded-full"
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
          }}
        />
      </div>
    </div>
  )
}
