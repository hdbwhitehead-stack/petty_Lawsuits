'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  documentId: string
}

export default function UnlockWatcher({ documentId }: Props) {
  const [timedOut, setTimedOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Poll for unlock status (simpler than Realtime for MVP)
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

    // Timeout after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setTimedOut(true)
    }, 300000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [documentId, router, supabase])

  if (timedOut) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-600">
            Email us at <strong>support@pettylawsuits.com.au</strong> and we&apos;ll sort it out.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Payment received</h2>
        <p className="text-gray-600">Your document is being unlocked...</p>
        <div className="mt-4 animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mx-auto" />
      </div>
    </div>
  )
}
