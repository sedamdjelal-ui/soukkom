'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../components/CartContext'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    wilaya: '',
    address: '',
    notes: '',
  })

  if (items.length === 0 && !done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-4">السلة فارغة</h1>
        <Link href="/products" className="text-brand-dark underline">
          تصفح المنتجات
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-brand-dark mb-2">تم استلام طلبك</h1>
        <p className="text-gray-600 mb-8">سنتواصل معك قريباً لتأكيد الطلب</p>
        <Link
          href="/products"
          className="bg-brand text-brand-dark px-6 py-3 rounded-lg font-medium hover:bg-brand-dark hover:text-white transition"
        >
          متابعة التسوق
        </Link>
      </div>
    )
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName || !form.phone) {
      alert('الرجاء إدخال الاسم ورقم الهاتف')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
        }),
      })

      if (!res.ok) throw new Error('فشل إرسال الطلب')

      clearCart()
      setDone(true)
    } catch {
      alert('حدث خطأ. حاول مرة أخرى أو تواصل معنا.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-dark mb-8">إتمام الطلب</h1>

      {/* ملخص السلة */}
      <div className="border border-brand-muted rounded-lg p-4 mb-8 bg-white">
        <h2 className="font-medium mb-3">ملخص الطلب</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{item.price * item.quantity} دج</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-brand-dark">
          <span>المجموع</span>
          <span>{total} دج</span>
        </div>
      </div>

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">الاسم الكامل *</label>
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="اسمك الكامل"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">رقم الهاتف *</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="05XXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">الولاية</label>
          <input
            name="wilaya"
            value={form.wilaya}
            onChange={handleChange}
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="مثال: الوادي"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">العنوان</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={2}
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="العنوان بالتفصيل"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">ملاحظات</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="أي ملاحظة إضافية"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-medium transition ${
            loading
              ? 'bg-gray-300 text-gray-500'
              : 'bg-brand text-brand-dark hover:bg-brand-dark hover:text-white'
          }`}
        >
          {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  )
}