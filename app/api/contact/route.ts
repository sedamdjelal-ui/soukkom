import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    if (!name || !message) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })
    }

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json({ error: 'لم يتم ضبط الرمز' }, { status: 500 })
    }

    await client.create({
      _type: 'contactMessage',
      name,
      email: email || '',
      phone: phone || '',
      message,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'فشل الإرسال' }, { status: 500 })
  }
}