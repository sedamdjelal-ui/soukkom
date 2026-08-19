import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import bcrypt from 'bcryptjs'
import { createSession } from '@/sanity/lib/auth'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    const merchant = await client.fetch(
      `*[_type == "merchant" && email == $email][0]{
        _id, name, email, storeName, passwordHash
      }`,
      { email: email.toLowerCase().trim() }
    )

    if (!merchant || !merchant.passwordHash) {
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, merchant.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    await createSession({
      id: merchant._id,
      email: merchant.email,
      name: merchant.name,
      storeName: merchant.storeName,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}