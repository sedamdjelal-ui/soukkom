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

  const whatsappNumber = '213668675851'
  const message = `مرحباً، أنا مهتم بهذا المنتج من سوقكم:

${product.name}
السعر: ${product.price} دج`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
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

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition w-fit text-center"
          >
            تواصل عبر واتساب
          </a>
        </div>
      </div>
    </div>
  )
}