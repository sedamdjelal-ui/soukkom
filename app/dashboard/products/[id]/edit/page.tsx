'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [inStock, setInStock] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'تعذر تحميل المنتج')
          setFetching(false)
          return
        }
        setName(data.name || '')
        setPrice(String(data.price ?? ''))
        setDescription(data.description || '')
        setInStock(data.inStock !== false)
        setFetching(false)
      } catch {
        setError('حدث خطأ أثناء التحميل')
        setFetching(false)
      }
    }
    load()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price),
          description,
          inStock,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'فشل التعديل')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.')
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center text-gray-500">
        جاري التحميل...
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">تعديل المنتج</h1>
      <p className="text-gray-600 mb-8">عدّل بيانات المنتج ثم احفظ</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">اسم المنتج</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">السعر (دج)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="inStock" className="text-sm">
            متوفر للبيع
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 text-white py-3 rounded-lg font-medium hover:bg-teal-800 transition disabled:opacity-50"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </form>

      <p className="mt-6 text-center">
        <Link href="/dashboard" className="text-teal-700 hover:underline text-sm">
          العودة للوحة التحكم
        </Link>
      </p>
    </div>
  )
}