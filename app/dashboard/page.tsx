'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
  in_stock: boolean
  created_at: string
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_url, in_stock, created_at')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false })

      setProducts(data || [])
      setLoading(false)
    }

    load()
  }, [router, supabase])

  async function handleDelete(id: string) {
    if (!confirm('هل تريد حذف هذا المنتج؟')) return

    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) {
    return <div className="p-12 text-center">جاري التحميل...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard" className="text-sm text-teal-700 hover:underline mb-2 inline-block">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-2xl font-bold">منتجاتي</h1>
        </div>
        <Link
          href="/dashboard/products/new"
          className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition text-sm"
        >
          + إضافة منتج
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          لا توجد منتجات بعد.{' '}
          <Link href="/dashboard/products/new" className="text-teal-700 underline">
            أضف أول منتج
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-xl p-4 flex items-center gap-4"
            >
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                  بدون صورة
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-teal-700 font-bold">{product.price} دج</p>
              </div>

              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 text-sm hover:underline"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}