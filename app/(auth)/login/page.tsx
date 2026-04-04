'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') ?? '/dashboard'
  const verificationError = searchParams.get('error') === 'verification_failed'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    router.push(returnTo)
  }

  async function handleGoogle() {
    const callbackParams = new URLSearchParams()
    callbackParams.set('next', returnTo)
    const redirectTo = `${location.origin}/auth/callback?${callbackParams.toString()}`

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <div className="max-w-md mx-auto bg-[var(--card)] border border-[var(--border)] rounded-lg p-8">
        {verificationError && (
          <p className="text-sm text-red-600 text-center mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            Email verification failed. Please try again or contact support.
          </p>
        )}
        <h1 className="text-3xl text-center mb-8">Log in</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="text-base font-medium mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-[var(--background)] text-base focus:outline-none focus:border-[var(--accent)] transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-base font-medium mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-3 bg-[var(--background)] text-base focus:outline-none focus:border-[var(--accent)] transition-colors"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[var(--foreground)] text-white rounded-full py-3 text-base font-medium hover:opacity-90 transition-opacity"
          >
            Log in
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[var(--card)] px-3 text-[var(--muted)]">or</span>
          </div>
        </div>
        <button
          onClick={handleGoogle}
          className="w-full border border-[var(--border)] rounded-full py-3 text-base font-medium hover:bg-[var(--accent-light)] transition-colors"
        >
          Continue with Google
        </button>
        <p className="mt-6 text-sm text-center text-[var(--muted)]">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-[var(--accent)] hover:underline">Sign up</a>
        </p>
        <p className="mt-4 text-xs text-center text-[var(--muted)]">
          This service does not provide legal advice.
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
