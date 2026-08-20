import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price, image_url')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="min-h-screen">
      {/* القسم الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          سوقكم... مكانك للبيع والشراء
        </h2>
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
      </main>

      {/* منتجات مميزة */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold mb-8 text-center">منتجات مميزة</h3>

        {!products || products.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition block"
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    بدون صورة
                  </div>
                )}
                <div className="p-4 text-center">
                  <h4 className="font-medium mb-1">{product.name}</h4>
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