'use client'
import { useState } from 'react'

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

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Checkout failed')
        return
      }

      const { url } = await res.json()
      window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`border rounded-lg p-6 flex flex-col ${highlight ? 'border-black ring-2 ring-black' : ''}`}>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-3xl font-bold mt-2">{price}</p>
      <p className="text-sm text-gray-500 mb-4">one-time payment</p>

      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <span className="text-green-600 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full rounded px-4 py-3 font-medium disabled:opacity-50 ${
          highlight ? 'bg-black text-white' : 'border border-black'
        }`}
      >
        {loading ? 'Redirecting...' : `Choose ${name}`}
      </button>
    </div>
  )
}
