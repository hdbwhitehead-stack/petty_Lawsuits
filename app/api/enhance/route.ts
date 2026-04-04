import { NextRequest, NextResponse } from 'next/server'
import { enhanceNarrative } from '@/lib/claude/enhance'

export async function POST(req: NextRequest) {
  const { description } = await req.json()

  if (!description || typeof description !== 'string' || description.trim().length < 20) {
    return NextResponse.json(
      { error: 'Description must be at least 20 characters' },
      { status: 400 }
    )
  }

  const enhanced = await enhanceNarrative(description.trim())
  return NextResponse.json({ enhanced })
}
