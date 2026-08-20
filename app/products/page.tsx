import Link from 'next/link'
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
  slug?: string
  inStock?: boolean
  image?: {
    asset?: {
      url?: string
    }
  }
}

async function getProducts(): Promise<Product[]> {
  return client.fetch(
    `*[_type == "product" && inStock != false] | order(_createdAt desc) {
      _id,
      name,
      price,
      "slug": slug.current,
      inStock,
      image{
        asset->{
          url
        }
      }
    }`
  )
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-brand-dark">المنتجات</h1>
      <p className="text-gray-600 mb-10">تصفح منتجات التجار على سوقكم</p>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-16">لا توجد منتجات حالياً</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={product.slug ? `/products/${product.slug}` : '#'}
              className="border border-brand-muted rounded-lg overflow-hidden hover:shadow-md transition group bg-white"
            >
              {product.image?.asset?.url ? (
                <img
                  src={product.image.asset.url}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-brand-bg flex items-center justify-center text-gray-400 text-sm">
                  بدون صورة
                </div>
              )}

              <div className="p-4">
                <h2 className="font-medium text-lg mb-1 group-hover:text-brand-dark transition">
                  {product.name}
                </h2>
                <p className="text-brand-dark font-bold">{product.price} دج</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}