import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'

async function getProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc)[0...8] {
    _id,
    name,
    price,
    "slug": slug.current,
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-dark">
          سوقكم... مكانك للبيع والشراء
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          منصة جزائرية بسيطة تجمع التجار والزبائن في مكان واحد. ابدأ البيع أو التسوق بسهولة.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="bg-brand text-brand-dark px-6 py-3 rounded-lg hover:bg-brand-dark hover:text-white transition font-medium"
          >
            تصفح المنتجات
          </Link>
          <Link
            href="/register"
            className="border border-brand-dark text-brand-dark px-6 py-3 rounded-lg hover:bg-brand hover:border-brand transition font-medium"
          >
            سجل كتاجر
          </Link>
        </div>
      </section>

      {/* قسم المنتجات */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center text-brand-dark">
          منتجات مميزة
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product: any) => (
              <Link
                key={product._id}
                href={`/products/${product.slug || product._id}`}
                className="border border-brand-muted rounded-lg overflow-hidden hover:shadow-md transition block bg-white"
              >
                {product.image ? (
                  <img
                    src={urlFor(product.image).width(300).height(300).url()}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-brand-bg flex items-center justify-center text-gray-400 text-xs">
                    بدون صورة
                  </div>
                )}
                <div className="p-2 text-center">
                  <h3 className="font-medium text-sm truncate mb-0.5">{product.name}</h3>
                  <p className="text-brand-dark font-bold text-sm">{product.price} دج</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}