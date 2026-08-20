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
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('id, name, slug, price, description, image_url, in_stock, merchant_id')
    .eq('slug', slug)
    .single()

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

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url || undefined}
              disabled={product.in_stock === false}
            />

            <StartChatButton
              productId={product.id}
              merchantUserId={product.merchant_id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}