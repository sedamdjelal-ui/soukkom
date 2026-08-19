import { NextResponse } from 'next/server'
import { destroySession } from '@/sanity/lib/auth'

export async function POST() {
  await destroySession()
  return NextResponse.json({ success: true })
}