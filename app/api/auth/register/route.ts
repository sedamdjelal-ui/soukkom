import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from 'next-sanity'
import { createSession } from '@/sanity/lib/auth'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, phone, storeName, city, category, description } = body

    if (!name || !email || !password || !phone || !storeName) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب تعبئتها' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // التحقق من وجود البريد مسبقاً
    const existing = await writeClient.fetch(
      `*[_type == "merchant" && email == $email][0]{ _id }`,
      { email: email.toLowerCase() }
    )

    if (existing) {
      return NextResponse.json(
        { error: 'هذا البريد مسجل مسبقاً' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const merchant = await writeClient.create({
      _type: 'merchant',
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      storeName,
      city: city || '',
      category: category || '',
      description: description || '',
      approved: false,
    })

    await createSession({
      id: merchant._id,
      name: merchant.name,
      email: merchant.email,
      storeName: merchant.storeName,
    })

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    )
  }
}