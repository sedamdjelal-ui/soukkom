import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

type Product = {
  _id: string
  name: string
  price: number
  description?: string
  inStock?: boolean
  image?: {
    asset?: {
      url?: string
    }
  }
  merchant?: {
    storeName?: string
    phone?: string
  }
}

async function getProduct(param: string): Promise<Product | null> {
  return client.fetch(
    `*[
      _type == "product" &&
      (slug.current == $param || _id == $param)
    ][0]{
      _id,
      name,
      price,
      description,
      inStock,
      image{
        asset->{
          url
        }
      },
      merchant->{
        storeName,
        phone
      }
    }`,
    { param }
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link
        href="/products"
        className="text-teal-700 hover:underline text-sm mb-8 inline-block"
      >
        ← العودة للمنتجات
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          {product.image?.asset?.url ? (
            <img
              src={product.image.asset.url}
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

          {product.inStock === false && (
            <p className="text-red-600 text-sm mb-4">غير متوفر حالياً</p>
          )}

          {product.description && (
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {product.description}
            </p>
          )}

          {product.merchant?.storeName && (
            <p className="text-sm text-gray-500 mb-6">
              المتجر: {product.merchant.storeName}
            </p>
          )}

          {product.merchant?.phone && (
            <a
              href={`https://wa.me/213${product.merchant.phone.replace(/^0/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              تواصل عبر واتساب
            </a>
          )}
        </div>
      </div>
    </div>
  )
}