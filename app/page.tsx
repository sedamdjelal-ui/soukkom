import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'

async function getProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc)[0...4] {
    _id,
    name,
    price,
    image
  }`
  return await client.fetch(query)
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div>
      {/* القسم الرئيسي */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          سوقكم... مكانك للبيع والشراء
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          منصة جزائرية بسيطة تجمع التجار والزبائن في مكان واحد. ابدأ البيع أو التسوق بسهولة.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
          >
            تصفح المنتجات
          </Link>
          <Link
            href="/register"
            className="border border-teal-700 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-50 transition"
          >
            سجل كتاجر
          </Link>
        </div>
      </section>

      {/* قسم المنتجات */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">منتجات مميزة</h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition block"
              >
                {product.image && (
                  <img
                    src={urlFor(product.image).width(400).height(400).url()}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 text-center">
                  <h3 className="font-medium mb-1">{product.name}</h3>
                  <p className="text-teal-700 font-bold">{product.price} دج</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}