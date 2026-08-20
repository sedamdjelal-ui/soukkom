'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    alert('تم إنشاء الحساب. تحقق من بريدك إن طُلب التأكيد.')
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-2">إنشاء حساب</h1>
      <p className="text-gray-600 text-center mb-8">سجّل للشراء أو البيع على سوقكم</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">الاسم الكامل</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="اسمك"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-brand-muted rounded-lg px-4 py-2 focus:outline-none focus:border-brand-dark"
            placeholder="6 أحرف على الأقل"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-brand-dark py-3 rounded-lg font-medium hover:bg-brand-dark hover:text-white transition disabled:opacity-50"
        >
          {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        لديك حساب؟{' '}
        <Link href="/login" className="text-brand-dark underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  )
}