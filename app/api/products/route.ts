import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { getSession } from '@/sanity/lib/auth'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

function slugify(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]+/g, '')
    .replace(/--+/g, '-')
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, price, description, inStock } = body

    if (!name || price === undefined || price === null) {
      return NextResponse.json({ error: 'الاسم والسعر مطلوبان' }, { status: 400 })
    }

    const slug = slugify(name)

    const doc = await client.create({
      _type: 'product',
      name,
      slug: { _type: 'slug', current: slug },
      price: Number(price),
      description: description || '',
      inStock: inStock !== false,
      merchant: {
        _type: 'reference',
        _ref: session.id,
      },
    })

    return NextResponse.json({ success: true, id: doc._id })
  } catch (err: unknown) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'فشل إنشاء المنتج'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}