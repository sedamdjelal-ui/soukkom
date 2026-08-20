'use client'

import Link from 'next/link'
import { useCart } from '../components/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-4">السلة فارغة</h1>
        <p className="text-gray-600 mb-8">لم تضف أي منتج بعد</p>
        <Link
          href="/products"
          className="bg-brand text-brand-dark px-6 py-3 rounded-lg hover:bg-brand-dark hover:text-white transition font-medium"
        >
          تصفح المنتجات
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-dark mb-8">سلة التسوق</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border border-brand-muted rounded-lg p-4 bg-white"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-brand-dark font-bold text-sm">{item.price} دج</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 border rounded text-lg hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 border rounded text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <p className="font-bold w-20 text-left">
              {item.price * item.quantity} دج
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 text-sm hover:underline"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-muted pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xl font-bold text-brand-dark">
          المجموع: {total} دج
        </p>
        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            إفراغ السلة
          </button>
          <Link
            href="/checkout"
            className="bg-brand text-brand-dark px-6 py-2 rounded-lg hover:bg-brand-dark hover:text-white transition font-medium"
          >
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  )
}