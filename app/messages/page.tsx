'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      const { data } = await supabase
        .from('conversations')
        .select(
          `
          id,
          created_at,
          product_id,
          buyer_id,
          seller_id,
          products ( name )
        `
        )
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      setConversations(data || [])
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return <p className="text-center py-16">جاري التحميل...</p>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">رسائلي</h1>

      {conversations.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد محادثات حالياً</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => {
            const isBuyer = c.buyer_id === userId
            const productName = c.products?.name || 'منتج'
            const otherParty = isBuyer ? 'البائع' : 'المشتري'

            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{productName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      محادثة مع {otherParty}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(c.created_at).toLocaleDateString('ar-DZ')}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}