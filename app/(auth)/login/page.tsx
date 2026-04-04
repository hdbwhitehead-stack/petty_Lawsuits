'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    router.push('/dashboard')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/dashboard` }
    })
  }

  return (
    <main className="max-w-sm mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2" required />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2" required />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit"
          className="w-full bg-black text-white rounded px-3 py-2">
          Log in
        </button>
      </form>
      <button onClick={handleGoogle}
        className="w-full mt-3 border rounded px-3 py-2">
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account? <a href="/signup" className="underline">Sign up</a>
      </p>
    </main>
  )
}
