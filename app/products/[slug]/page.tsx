import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AddToCartButton from '../../components/AddToCartButton'
import StartChatButton from '@/app/components/StartChatButton'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)

  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(
      'id, name, slug, price, description, image_url, in_stock, merchant_id'
    )
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('Product query error:', error.message)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link
        href="/products"
        className="text-sm text-teal-700 hover:underline mb-8 inline-block"
      >
        ← العودة للمنتجات
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
              بدون صورة
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-2xl text-teal-700 font-bold mb-4">
            {product.price} دج
          </p>

          {product.in_stock === false && (
            <p className="text-red-600 text-sm mb-4">غير متوفر حالياً</p>
          )}

          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {product.description}
            </p>
          )}

          {product.merchant_id && (
            <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">البائع</p>
              <Link
                href={`/merchant/${product.merchant_id}`}
                className="text-teal-700 font-medium hover:underline"
              >
                عرض متجر التاجر ←
              </Link>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url || undefined}
              disabled={product.in_stock === false}
            />

            {product.merchant_id && (
              <StartChatButton
                productId={product.id}
                merchantUserId={product.merchant_id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}