'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [storeName, setStoreName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/merchant')
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'تعذر التحميل')
          setFetching(false)
          return
        }
        setStoreName(data.storeName || '')
        setName(data.name || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
        setCity(data.city || '')
        setCategory(data.category || '')
        setFetching(false)
      } catch {
        setError('حدث خطأ أثناء التحميل')
        setFetching(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/merchant', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          name,
          phone,
          city,
          category,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'فشل الحفظ')
        setLoading(false)
        return
      }
      setSuccess('تم حفظ التعديلات بنجاح')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setLoading(false)
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
      <h1 className="text-3xl font-bold mb-2">إعدادات الحساب</h1>
      <p className="text-gray-600 mb-8">عدّل بيانات متجرك وكلمة المرور</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">اسم المتجر</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
            dir="ltr"
          />
          <p className="text-xs text-gray-400 mt-1">لا يمكن تغيير البريد حالياً</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الهاتف</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">المدينة</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">التصنيف</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <hr className="my-6" />

        <h2 className="font-bold text-lg">تغيير كلمة المرور</h2>
        <p className="text-sm text-gray-500 mb-2">اتركها فارغة إن لم ترد التغيير</p>

        <div>
          <label className="block text-sm font-medium mb-1">كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            dir="ltr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            dir="ltr"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

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