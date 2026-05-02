'use client'
import { useState } from 'react'
import { StickerButton } from '@/components/ui/StickerButton'
import { StickerCard } from '@/components/ui/StickerCard'

type Props = {
  name: string
  price: string
  features: string[]
  tierType: 'send' | 'full_petty'
  documentId: string
  highlight?: boolean
}

export default function UnlockTierCard({ name, price, features, tierType, documentId, highlight }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, type: tierType }),
      })

      const text = await res.text()
      let data: { url?: string; error?: string } = {}
      try { data = JSON.parse(text) } catch { /* non-JSON */ }

      if (!res.ok) {
        console.error('Checkout failed', { status: res.status, body: text })
        alert(data.error || `Checkout failed (HTTP ${res.status}). Check the browser console.`)
        return
      }

      if (!data.url) {
        console.error('Checkout succeeded but returned no URL', text)
        alert('Checkout response missing a redirect URL — Stripe env vars likely not set.')
        return
      }

      window.location.href = data.url
    } catch (err) {
      console.error('Checkout request threw', err)
      alert('Could not reach checkout. Check the browser console.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {highlight && (
        <div
          className="absolute -top-3 left-1/2 z-10 px-3 py-1 text-xs font-bold uppercase tracking-widest"
          style={{
            background: 'var(--lemon)',
            border: '2px solid var(--foreground)',
            borderRadius: 4,
            boxShadow: '2px 2px 0 #1A1814',
            transform: 'translateX(-50%) rotate(-1deg)',
            whiteSpace: 'nowrap',
          }}
        >
          BEST VALUE
        </div>
      )}
      <StickerCard
        color={highlight ? 'var(--accent-tint)' : '#fff'}
        shadow={highlight ? 'sticker-lg' : 'sticker'}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        padding={24}
      >
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="font-display font-extrabold text-4xl mt-2">{price}</p>
        <p className="text-sm text-[var(--muted)] mb-5">one-time payment</p>

        <ul className="space-y-2 mb-6 flex-1">
          {features.map((f, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span style={{ color: 'var(--grass)', marginTop: 1 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        <StickerButton
          onClick={handleCheckout}
          disabled={loading}
          variant={highlight ? 'primary' : 'ink'}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? 'Redirecting…' : `Unlock & send it`}
        </StickerButton>
      </StickerCard>
    </div>
  )
}
