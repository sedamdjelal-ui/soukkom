import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import bcrypt from 'bcryptjs'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        { error: 'SANITY_API_TOKEN غير موجود في .env.local' },
        { status: 500 }
      )
    }

    const merchant = await client.fetch(
      `*[_type == "merchant" && email == $email][0]{ _id, email }`,
      { email: normalizedEmail }
    )

    if (!merchant) {
      return NextResponse.json({
        message: 'لا يوجد حساب بهذا البريد: ' + normalizedEmail,
        tempPassword: null,
      })
    }

    const tempPassword = generateTempPassword(10)
    const hashed = await bcrypt.hash(tempPassword, 10)

    await client
      .patch(merchant._id)
      .set({ passwordHash: hashed })
      .commit()

    return NextResponse.json({
      message: 'تم إنشاء كلمة مرور مؤقتة. انسخها الآن.',
      tempPassword,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('forgot-password error:', msg)
    return NextResponse.json(
      { error: 'خطأ تفصيلي: ' + msg },
      { status: 500 }
    )
  }
}