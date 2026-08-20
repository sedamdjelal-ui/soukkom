'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function makeSlug(text: string) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    let imageUrl: string | null = null

    // رفع الصورة إن وُجدت
    if (file) {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (uploadError) {
        setLoading(false)
        setError('فشل رفع الصورة: ' + uploadError.message)
        return
      }

      const { data: publicUrl } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      imageUrl = publicUrl.publicUrl
    }

    const slug = makeSlug(name) + '-' + Date.now().toString().slice(-4)

    const { error: insertError } = await supabase.from('products').insert({
      merchant_id: user.id,
      name: name.trim(),
      slug,
      price: Number(price),
      description: description.trim() || null,
      image_url: imageUrl,
      in_stock: true,
    })

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    router.push('/dashboard/products')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/dashboard" className="text-sm text-teal-700 hover:underline mb-6 inline-block">
        ← العودة للوحة التحكم
      </Link>

      <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">اسم المنتج</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
            placeholder="مثال: سماعة بلوتوث"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">السعر (دج)</label>
          <input
            type="number"
            required
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
            placeholder="2500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">الوصف (اختياري)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
            placeholder="اكتب وصفاً قصيراً للمنتج"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">صورة المنتج</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-teal-50 file:text-teal-700"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition disabled:opacity-50"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ المنتج'}
        </button>
      </form>
    </div>
  )
}