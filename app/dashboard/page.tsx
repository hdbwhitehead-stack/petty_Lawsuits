import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-2">Your documents</h1>
      <p className="text-gray-500 mb-8">You have no documents yet.</p>
      <a href="/wizard"
        className="bg-black text-white rounded px-4 py-2 inline-block">
        Create a document
      </a>
    </main>
  )
}
