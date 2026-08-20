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
    const { customerName, phone, wilaya, address, notes, items, total } = body

    if (!customerName || !phone || !items?.length) {
      return NextResponse.json(
        { error: 'بيانات ناقصة' },
        { status: 400 }
      )
    }

    if (!process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        { error: 'لم يتم ضبط رمز Sanity للكتابة' },
        { status: 500 }
      )
    }

    const orderNumber = `SK-${Date.now().toString().slice(-8)}`

    const doc = await client.create({
      _type: 'order',
      orderNumber,
      customerName,
      phone,
      wilaya: wilaya || '',
      address: address || '',
      notes: notes || '',
      items,
      total: total || 0,
      status: 'new',
    })

    return NextResponse.json({ success: true, id: doc._id, orderNumber })
  } catch (error) {
    console.error('Order error:', error)
    return NextResponse.json(
      { error: 'فشل حفظ الطلب' },
      { status: 500 }
    )
  }
}