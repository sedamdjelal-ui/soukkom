'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  productId: string
  productName: string
}

export default function ProductActions({ productId, productName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const ok = window.confirm(`هل تريد حذف المنتج «${productName}»؟`)
    if (!ok) return

    setLoading(true)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'فشل الحذف')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      alert('حدث خطأ أثناء الحذف')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 text-sm shrink-0">
      <Link
        href={`/dashboard/products/${productId}/edit`}
        className="text-teal-700 hover:underline"
      >
        تعديل
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        {loading ? 'جاري الحذف...' : 'حذف'}
      </button>
    </div>
  )
}