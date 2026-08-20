'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setTempPassword(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'حدث خطأ')
        setLoading(false)
        return
      }

      setMessage(data.message)
      if (data.tempPassword) {
        setTempPassword(data.tempPassword)
      }
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">نسيت كلمة المرور</h1>
      <p className="text-gray-600 mb-8">
        أدخل بريدك الإلكتروني لإنشاء كلمة مرور مؤقتة
      </p>

      {!tempPassword ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
              dir="ltr"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && !tempPassword && (
            <p className="text-gray-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-3 rounded-lg font-medium hover:bg-teal-800 transition disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : 'إنشاء كلمة مرور مؤقتة'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-2">{message}</p>
            <p className="text-sm text-gray-600 mb-1">كلمة المرور المؤقتة:</p>
            <p
              className="text-xl font-bold tracking-wider text-center bg-white border rounded-lg py-3"
              dir="ltr"
            >
              {tempPassword}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              انسخها الآن. لن تظهر مرة أخرى. سجّل الدخول بها فوراً.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full text-center bg-teal-700 text-white py-3 rounded-lg font-medium hover:bg-teal-800 transition"
          >
            الذهاب لتسجيل الدخول
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-teal-700 hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </div>
  )
}