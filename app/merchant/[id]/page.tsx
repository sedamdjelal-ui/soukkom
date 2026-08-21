import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MerchantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // معلومات التاجر
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  // منتجات التاجر
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, price, image_url, in_stock')
    .eq('merchant_id', id)
    .order('created_at', { ascending: false })

  const storeName =
    profile?.store_name ||
    profile?.full_name ||
    profile?.name ||
    'متجر التاجر'

  const phone = profile?.phone || null
  const city = profile?.city || null
  const bio = profile?.bio || profile?.description || null

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* بطاقة التاجر */}
      <div className="mb-12 border border-gray-200 rounded-2xl p-6 md:p-8 bg-white">
        <h1 className="text-3xl font-bold mb-2">{storeName}</h1>

        {bio && (
          <p className="text-gray-600 mb-4 leading-relaxed">{bio}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {city && <span>المدينة: {city}</span>}
          {phone && <span>الهاتف: {phone}</span>}
          <span>{products?.length ?? 0} منتج</span>
        </div>
      </div>

      {/* المنتجات */}
      <h2 className="text-2xl font-bold mb-6">منتجات المتجر</h2>

      {!products || products.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          لا توجد منتجات حالياً
        </p>
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
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-teal-700 font-bold">{product.price} دج</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}