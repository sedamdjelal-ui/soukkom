import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const query = `*[_type == "product" && _id == $id][0] {
    _id,
    name,
    price,
    description,
    image
  }`
  return await client.fetch(query, { id })
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* الهيدر */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-teal-700">
            سوقكم
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-teal-700">الرئيسية</Link>
            <Link href="/products" className="hover:text-teal-700">المنتجات</Link>
            <Link href="/register" className="hover:text-teal-700">سجل كتاجر</Link>
          </nav>
        </div>
      </header>

      {/* محتوى المنتج */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/products"
          className="text-sm text-gray-500 hover:text-teal-700 mb-8 inline-block"
        >
          ← العودة للمنتجات
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
          {/* الصورة */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
            {product.image ? (
              <img
                src={urlFor(product.image).width(800).height(800).url()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-400">
                لا توجد صورة
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl text-teal-700 font-bold mb-6">
              {product.price} دج
            </p>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <button className="bg-teal-700 text-white px-8 py-3 rounded-lg hover:bg-teal-800 transition w-fit">
              تواصل مع البائع
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}