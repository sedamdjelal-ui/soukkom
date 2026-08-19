'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [storeName, setStoreName] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!accepted) {
      alert('يجب الموافقة على شروط الاستخدام أولاً')
      return
    }

    const message = `طلب تسجيل تاجر جديد في سوقكم:

الاسم: ${name}
الهاتف: ${phone}
البريد: ${email || 'غير محدد'}
اسم المتجر: ${storeName}
المدينة: ${city}
نوع المنتجات: ${category}
وصف المتجر: ${description || 'لا يوجد'}`

    const whatsappNumber = '213668675851'
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-3">تم فتح واتساب</h1>
        <p className="text-gray-600 mb-8">
          أرسل الرسالة من واتساب ليصلك الرد قريباً.
          سنتواصل معك بعد مراجعة طلبك.
        </p>
        <Link
          href="/"
          className="inline-block bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition"
        >
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2 text-center">سجل كتاجر</h1>
      <p className="text-gray-600 text-center mb-8">
        انضم إلى سوقكم وابدأ بيع منتجاتك بسهولة
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">الاسم الكامل *</label>
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
          <label className="block text-sm mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
            placeholder="example@email.com"
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
            placeholder="اسم متجرك"
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
            placeholder="مثال: الجزائر، وهران، قسنطينة..."
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
            placeholder="مثال: نبيع ملابس نسائية عصرية بأسعار مناسبة"
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
            أوافق على شروط الاستخدام وأتعهد بصحة المعلومات المقدمة
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition mt-2"
        >
          إرسال الطلب عبر واتساب
        </button>
      </form>
    </div>
  )
}