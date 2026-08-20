'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) {
      alert('الرجاء إدخال الاسم والرسالة')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-brand-dark mb-2 text-center">تواصل معنا</h1>
      <p className="text-gray-600 text-center mb-10">
        أرسل رسالتك وسنرد عليك في أقرب وقت
      </p>

      {status === 'success' ? (
        <div className="text-center py-12 border border-brand-muted rounded-xl bg-white">
          <p className="text-xl font-medium text-brand-dark mb-2">تم إرسال رسالتك</p>
          <p className="text-gray-600 mb-6">شكراً لتواصلك معنا</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-brand-dark underline text-sm"
          >
            إرسال رسالة أخرى
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">الاسم *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
              placeholder="اسمك"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">البريد الإلكتروني</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">رقم الهاتف</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
              placeholder="05XXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">الرسالة *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm">حدث خطأ. حاول مرة أخرى.</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-3 rounded-lg font-medium transition ${
              status === 'loading'
                ? 'bg-gray-300 text-gray-500'
                : 'bg-brand text-brand-dark hover:bg-brand-dark hover:text-white'
            }`}
          >
            {status === 'loading' ? 'جاري الإرسال...' : 'إرسال الرسالة'}
          </button>
        </form>
      )}
    </div>
  )
}