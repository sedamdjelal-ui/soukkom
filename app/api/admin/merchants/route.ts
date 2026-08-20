import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { getSession } from '@/sanity/lib/auth'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

function isAdmin(email: string) {
  return email === process.env.ADMIN_EMAIL
}

export async function GET() {
  const session = await getSession()
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const merchants = await client.fetch(
    `*[_type == "merchant"] | order(_createdAt desc) {
      _id,
      name,
      storeName,
      email,
      phone,
      city,
      category,
      approved,
      _createdAt
    }`
  )

  return NextResponse.json(merchants)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session || !isAdmin(session.email)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const { merchantId, approved } = await req.json()

  if (!merchantId) {
    return NextResponse.json({ error: 'معرّف التاجر مطلوب' }, { status: 400 })
  }

  await client.patch(merchantId).set({ approved: !!approved }).commit()

  return NextResponse.json({ success: true })
}