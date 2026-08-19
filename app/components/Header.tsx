import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-teal-700">
          سوقكم
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-teal-700 transition">
            الرئيسية
          </Link>
          <Link href="/products" className="hover:text-teal-700 transition">
            المنتجات
          </Link>
          <Link href="/register" className="hover:text-teal-700 transition">
            سجل كتاجر
          </Link>
        </nav>
      </div>
    </header>
  )
}