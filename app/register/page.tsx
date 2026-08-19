'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!accepted) {
      setError('يجب الموافقة على الشروط أولاً')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          storeName,
          city,
          category,
          description,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('حدث خطأ في الاتصال')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-center">إنشاء حساب تاجر</h1>
      <p className="text-gray-600 text-center mb-8">
        انضم إلى سوقكم وابدأ بيع منتجاتك
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm mb-1">الاسم الكامل *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">البريد الإلكتروني *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">كلمة المرور *</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
            placeholder="6 أحرف على الأقل"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">رقم الهاتف *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
            placeholder="05XXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">اسم المتجر *</label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">المدينة *</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">نوع المنتجات *</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700 bg-white"
          >
            <option value="">اختر النوع</option>
            <option value="ملابس">ملابس</option>
            <option value="إلكترونيات">إلكترونيات</option>
            <option value="مواد غذائية">مواد غذائية</option>
            <option value="أثاث ومنزل">أثاث ومنزل</option>
            <option value="تجميل وعناية">تجميل وعناية</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">وصف قصير عن المتجر</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            أوافق على شروط الاستخدام وأتعهد بصحة المعلومات
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition mt-2 disabled:opacity-50"
        >
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        لديك حساب؟{' '}
        <Link href="/login" className="text-teal-700 hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  )
}