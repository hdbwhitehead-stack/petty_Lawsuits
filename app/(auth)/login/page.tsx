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
          className="w-full border border-[var(--border)] rounded-full py-3 text-base font-medium hover:bg-[var(--accent-light)] transition-colors flex items-center justify-center gap-3"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
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
