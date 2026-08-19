import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'

async function getProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    image
  }`
  return await client.fetch(query)
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-teal-700">
            سوقكم
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-teal-700">
              الرئيسية
            </Link>
            <Link href="/products" className="text-teal-700 font-medium">
              المنتجات
            </Link>
            <Link href="/register" className="hover:text-teal-700">
              سجل كتاجر
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">كل المنتجات</h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <a
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
                  <h4 className="font-medium mb-1">{product.name}</h4>
                  <p className="text-teal-700 font-bold">{product.price} دج</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}