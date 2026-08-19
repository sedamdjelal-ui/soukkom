'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [storeName, setStoreName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const message = `طلب تسجيل تاجر جديد في سوقكم:

الاسم: ${name}
الهاتف: ${phone}
البريد: ${email || 'غير محدد'}
اسم المتجر: ${storeName}`

    // غيّر الرقم إلى رقمك
    const whatsappNumber = '213668675851'
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-teal-700">
            سوقكم
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-teal-700">الرئيسية</Link>
            <Link href="/products" className="hover:text-teal-700">المنتجات</Link>
            <Link href="/register" className="text-teal-700 font-medium">سجل كتاجر</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">سجل كتاجر</h1>
        <p className="text-gray-600 text-center mb-8">
          انضم إلى سوقكم وابدأ بيع منتجاتك بسهولة
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">الاسم الكامل</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="أدخل اسمك"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">رقم الهاتف</label>
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
            <label className="block text-sm mb-1">البريد الإلكتروني (اختياري)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">اسم المتجر</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
              placeholder="اسم متجرك"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition mt-4"
          >
            إرسال الطلب عبر واتساب
          </button>
        </form>
      </main>
    </div>
  )
}