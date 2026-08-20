import Link from 'next/link'
import { getSession } from '@/sanity/lib/auth'

export default async function Header() {
  const session = await getSession()
  const isAdmin = session?.email === process.env.ADMIN_EMAIL

  return (
    <header className="border-b border-brand-muted bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-brand-dark">
          سوقكم
        </Link>
        <nav className="flex gap-6 text-sm font-medium items-center">
          <Link href="/" className="hover:text-brand-dark transition">
            الرئيسية
          </Link>
          <Link href="/products" className="hover:text-brand-dark transition">
            المنتجات
          </Link>

          {isAdmin && (
            <Link href="/admin" className="hover:text-brand-dark transition">
              لوحة المسؤول
            </Link>
          )}

          {session ? (
            <Link
              href="/dashboard"
              className="bg-brand text-brand-dark px-4 py-1.5 rounded-lg hover:bg-brand-dark hover:text-white transition font-medium"
            >
              لوحة التحكم
            </Link>
          ) : (
            <Link href="/register" className="hover:text-brand-dark transition">
              سجل كتاجر
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}