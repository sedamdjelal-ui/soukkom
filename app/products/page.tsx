import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price, image_url')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">كل المنتجات</h1>

      {!products || products.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
    </div>
  )
}