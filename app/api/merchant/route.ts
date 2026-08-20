import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { getSession } from '@/sanity/lib/auth'
import bcrypt from 'bcryptjs'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const merchant = await client.fetch(
    `*[_type == "merchant" && _id == $id][0]{
      storeName,
      name,
      email,
      phone,
      city,
      category
    }`,
    { id: session.id }
  )

  if (!merchant) {
    return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 })
  }

  return NextResponse.json(merchant)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const body = await req.json()
  const {
    storeName,
    name,
    phone,
    city,
    category,
    currentPassword,
    newPassword,
  } = body

  const merchant = await client.fetch(
    `*[_type == "merchant" && _id == $id][0]{ _id, password }`,
    { id: session.id }
  )

  if (!merchant) {
    return NextResponse.json({ error: 'التاجر غير موجود' }, { status: 404 })
  }

  const updates: Record<string, unknown> = {}

  if (storeName !== undefined) updates.storeName = storeName
  if (name !== undefined) updates.name = name
  if (phone !== undefined) updates.phone = phone
  if (city !== undefined) updates.city = city
  if (category !== undefined) updates.category = category

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'أدخل كلمة المرور الحالية' },
        { status: 400 }
      )
    }

    const valid = await bcrypt.compare(currentPassword, merchant.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    updates.password = await bcrypt.hash(newPassword, 10)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'لا توجد بيانات للتحديث' },
      { status: 400 }
    )
  }

  await client.patch(session.id).set(updates).commit()

  return NextResponse.json({ success: true })
}