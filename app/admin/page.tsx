'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Merchant = {
  _id: string
  name: string
  storeName: string
  email: string
  phone?: string
  city?: string
  category?: string
  approved?: boolean
  _createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/merchants')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'غير مصرح')
        setLoading(false)
        if (res.status === 401) {
          setTimeout(() => router.push('/login'), 1500)
        }
        return
      }
      setMerchants(data)
      setLoading(false)
    } catch {
      setError('حدث خطأ أثناء التحميل')
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleApprove(id: string, approved: boolean) {
    try {
      const res = await fetch('/api/admin/merchants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId: id, approved }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'فشل التحديث')
        return
      }
      load()
    } catch {
      alert('حدث خطأ')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">
        جاري التحميل...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/login" className="text-teal-700 hover:underline">
          تسجيل الدخول
        </Link>
      </div>
    )
  }

  const pending = merchants.filter((m) => !m.approved)
  const approved = merchants.filter((m) => m.approved)

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">لوحة المسؤول</h1>
      <p className="text-gray-600 mb-8">إدارة التجار والموافقة عليهم</p>

      <div className="mb-10">
        <h2 className="font-bold text-lg mb-3">
          بانتظار الموافقة ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">لا يوجد تجار بانتظار الموافقة</p>
        ) : (
          <ul className="border rounded-lg divide-y">
            {pending.map((m) => (
              <li
                key={m._id}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{m.storeName}</p>
                  <p className="text-sm text-gray-500">
                    {m.name} — {m.email}
                    {m.phone ? ` — ${m.phone}` : ''}
                    {m.city ? ` — ${m.city}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => toggleApprove(m._id, true)}
                  className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-800 transition"
                >
                  موافقة
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="font-bold text-lg mb-3">
          التجار الموافق عليهم ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-gray-500 text-sm">لا يوجد تجار موافق عليهم بعد</p>
        ) : (
          <ul className="border rounded-lg divide-y">
            {approved.map((m) => (
              <li
                key={m._id}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium">{m.storeName}</p>
                  <p className="text-sm text-gray-500">
                    {m.name} — {m.email}
                  </p>
                </div>
                <button
                  onClick={() => toggleApprove(m._id, false)}
                  className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition"
                >
                  إيقاف
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-10">
        <Link href="/dashboard" className="text-teal-700 hover:underline text-sm">
          لوحة التاجر
        </Link>
        <span className="mx-2 text-gray-300">|</span>
        <Link href="/" className="text-teal-700 hover:underline text-sm">
          الرئيسية
        </Link>
      </p>
    </div>
  )
}