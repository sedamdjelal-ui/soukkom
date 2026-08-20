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

// جلب منتج واحد (للتعديل)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params

    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0]{
        _id,
        name,
        price,
        description,
        inStock,
        "merchantId": merchant._ref
      }`,
      { id }
    )

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    if (product.merchantId !== session.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    return NextResponse.json(product)
  } catch (err) {
    console.error('Get product error:', err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// تعديل منتج
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0]{ _id, "merchantId": merchant._ref }`,
      { id }
    )

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    if (product.merchantId !== session.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const updates: Record<string, unknown> = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.price !== undefined) updates.price = Number(body.price)
    if (body.description !== undefined) updates.description = body.description
    if (body.inStock !== undefined) updates.inStock = Boolean(body.inStock)

    await client.patch(id).set(updates).commit()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Update product error:', err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}

// حذف منتج
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params

    const product = await client.fetch(
      `*[_type == "product" && _id == $id][0]{ _id, "merchantId": merchant._ref }`,
      { id }
    )

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    if (product.merchantId !== session.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    await client.delete(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete product error:', err)
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 })
  }
}