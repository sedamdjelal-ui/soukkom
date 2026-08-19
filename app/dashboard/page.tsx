import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from 'next-sanity'
import { getSession, destroySession } from '@/sanity/lib/auth'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

type Product = {
  _id: string
  name: string
  price: number
  inStock?: boolean
  slug?: string
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const merchant = await client.fetch(
    `*[_type == "merchant" && (_id == $id || _id == $draftId)] | order(_updatedAt desc)[0]{
      _id,
      approved,
      storeName,
      email,
      phone,
      city,
      category
    }`,
    { id: session.id, draftId: `drafts.${session.id}` }
  )

  const products: Product[] = await client.fetch(
    `*[_type == "product" && merchant._ref == $merchantId] | order(_createdAt desc) {
      _id,
      name,
      price,
      inStock,
      "slug": slug.current
    }`,
    { merchantId: session.id }
  )

  const approved = true

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
      <p className="text-gray-600 mb-8">
        مرحباً {session.name} — متجر: {session.storeName}
      </p>

      {approved ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-sm text-green-800">
          حسابك مفعّل. يمكنك إضافة المنتجات.
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-sm text-yellow-800">
          حسابك قيد المراجعة. بعد الموافقة ستتمكن من إضافة المنتجات.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <div className="border rounded-lg p-6">
          <h2 className="font-bold mb-2">منتجاتي</h2>
          <p className="text-gray-500 text-sm mb-4">
            {products.length > 0
              ? `لديك ${products.length} منتج`
              : 'أضف منتجات متجرك للبيع'}
          </p>
          {approved && (
            <Link
              href="/dashboard/products/new"
              className="inline-block bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition"
            >
              إضافة منتج
            </Link>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="font-bold mb-2">بيانات المتجر</h2>
          <p className="text-sm text-gray-600">البريد: {merchant?.email || session.email}</p>
          {merchant?.phone && (
            <p className="text-sm text-gray-600 mt-1">الهاتف: {merchant.phone}</p>
          )}
          {merchant?.city && (
            <p className="text-sm text-gray-600 mt-1">المدينة: {merchant.city}</p>
          )}
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b font-medium">
          قائمة المنتجات
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            لا توجد منتجات بعد.
            {approved && (
              <div className="mt-3">
                <Link
                  href="/dashboard/products/new"
                  className="text-teal-700 hover:underline"
                >
                  أضف أول منتج
                </Link>
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y">
            {products.map((product) => (
              <li
                key={product._id}
                className="px-4 py-3 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.price} دج
                    {product.inStock === false && (
                      <span className="text-red-600 mr-2"> — غير متوفر</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        action={async () => {
          'use server'
          await destroySession()
          redirect('/login')
        }}
        className="mt-10"
      >
        <button type="submit" className="text-red-600 hover:underline text-sm">
          تسجيل الخروج
        </button>
      </form>

      <p className="mt-6">
        <Link href="/" className="text-teal-700 hover:underline text-sm">
          العودة للرئيسية
        </Link>
      </p>
    </div>
  )
}