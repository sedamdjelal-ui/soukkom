'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const { count } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="border-b border-brand-muted bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-brand-dark">
          سوقكم
        </Link>

        <nav className="flex gap-5 text-sm font-medium items-center">
          <Link href="/" className="hover:text-brand-dark transition">
            الرئيسية
          </Link>
          <Link href="/products" className="hover:text-brand-dark transition">
            المنتجات
          </Link>
          <Link href="/register" className="hover:text-brand-dark transition">
            سجل كتاجر
          </Link>
          <Link href="/contact" className="hover:text-brand-dark transition">
            تواصل
          </Link>
          <Link href="/messages" className="hover:text-brand-dark transition">
            الرسائل
          </Link>

          <Link
            href="/cart"
            className="relative hover:text-brand-dark transition flex items-center gap-1"
          >
            <span>السلة</span>
            {count > 0 && (
              <span className="absolute -top-2 -left-3 bg-brand-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="text-gray-600 text-xs hidden sm:inline hover:underline"
                  >
                    {user.email}
                  </Link>
                  <Link href="/profile" className="hover:text-brand-dark transition">
                    ملفي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:underline"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="hover:text-brand-dark transition">
                    دخول
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-brand-dark text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition"
                  >
                    حساب جديد
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}