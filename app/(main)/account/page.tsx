'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Subscription {
  status: string
  current_period_end: string | null
  stripe_customer_id: string | null
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [billingLoading, setBillingLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?returnTo=/account')
        return
      }
      setUser(user)

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, current_period_end, stripe_customer_id')
        .eq('user_id', user.id)
        .maybeSingle()

      setSubscription(sub ?? null)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleManageBilling() {
    setBillingLoading(true)
    setError('')
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Could not open billing portal. Please try again.')
        setBillingLoading(false)
        return
      }
      const { url } = await res.json()
      window.location.href = url
    } catch {
      setError('Could not open billing portal. Please try again.')
      setBillingLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    setError('')
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Could not delete account. Please try again.')
        setDeleteLoading(false)
        return
      }
      router.push('/?deleted=1')
    } catch {
      setError('Could not delete account. Please try again.')
      setDeleteLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
        <p className="text-[var(--muted)]">Loading…</p>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <h1 className="text-3xl md:text-4xl mb-2">Account</h1>
      <p className="text-base text-[var(--muted)] mb-10">
        Manage your account settings and subscription.
      </p>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Email */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-base font-medium mb-4">Account details</h2>
          <div>
            <label className="text-sm text-[var(--muted)] block mb-1">Email address</label>
            <p className="text-base text-[var(--foreground)]">{user?.email}</p>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
          <h2 className="text-base font-medium mb-4">Subscription</h2>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-[var(--accent-light)] text-[var(--muted)] border-[var(--border)]'
                  }`}
                >
                  {isActive ? 'Active' : 'No active plan'}
                </span>
              </div>
              {isActive && subscription?.current_period_end && (
                <p className="text-sm text-[var(--muted)] mt-1">
                  Renews {formatDate(subscription.current_period_end)}
                </p>
              )}
              {!isActive && (
                <p className="text-sm text-[var(--muted)] mt-1">
                  You are on the free plan. Unlock documents individually or upgrade for unlimited access.
                </p>
              )}
            </div>
            {subscription?.stripe_customer_id && (
              <button
                onClick={handleManageBilling}
                disabled={billingLoading}
                className="text-base font-medium bg-[var(--foreground)] text-white rounded-full px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {billingLoading ? 'Opening…' : 'Manage billing'}
              </button>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-[var(--card)] border border-red-200 rounded-lg p-6">
          <h2 className="text-base font-medium mb-1 text-red-700">Danger zone</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Permanently deletes your account, all documents, and all data. This cannot be undone.
          </p>

          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="text-base font-medium text-red-600 border border-red-300 rounded-full px-6 py-2.5 hover:bg-red-50 transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-700 mb-3">
                Are you sure? This will permanently delete your account and all your documents.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="text-base font-medium bg-red-600 text-white rounded-full px-6 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting…' : 'Yes, delete everything'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleteLoading}
                  className="text-base font-medium border border-[var(--border)] rounded-full px-6 py-2.5 hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
