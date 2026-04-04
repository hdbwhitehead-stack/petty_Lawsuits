'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getAnonKey } from '@/lib/anonymous'
import { useRouter } from 'next/navigation'

function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const documentId = searchParams.get('documentId')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const anonKey = getAnonKey()

    // Build the callback URL so Supabase sends the user back to their document
    const callbackParams = new URLSearchParams()
    if (documentId) callbackParams.set('next', `/preview/${documentId}`)
    if (anonKey) callbackParams.set('anon_key', anonKey)
    const emailRedirectTo = `${location.origin}/auth/callback?${callbackParams.toString()}`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    })
    if (error) { setError(error.message); return }
    router.push('/verify')
  }

  async function handleGoogle() {
    const anonKey = getAnonKey()
    const callbackParams = new URLSearchParams()
    if (documentId) callbackParams.set('next', `/preview/${documentId}`)
    if (anonKey) callbackParams.set('anon_key', anonKey)
    const redirectTo = `${location.origin}/auth/callback?${callbackParams.toString()}`

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 md:py-24">
      <div className="max-w-md mx-auto bg-[var(--card)] border border-[var(--border)] rounded-lg p-8">
        {documentId && (
          <p className="text-sm text-center text-[var(--muted)] mb-6 bg-[var(--accent-tint)] border border-[var(--border)] rounded-lg px-4 py-3">
            Create a free account to unlock your document.{' '}
            <span className="text-[var(--foreground)]">It&apos;s saved and waiting for you.</span>
          </p>
        )}
        <h1 className="text-3xl text-center mb-8">Create your account</h1>
        <form onSubmit={handleSignup} className="space-y-5">
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
              placeholder="Choose a password"
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
            Sign up
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
          Already have an account?{' '}
          <a
            href={documentId ? `/login?returnTo=/preview/${documentId}` : '/login'}
            className="text-[var(--accent)] hover:underline"
          >
            Log in
          </a>
        </p>
        <p className="mt-4 text-xs text-center text-[var(--muted)]">
          This service does not provide legal advice.
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
