'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Conversation = {
  id: string
  created_at: string
  product_id: string | null
  buyer_id: string
  seller_id: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
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
        .select('id, created_at, product_id, buyer_id, seller_id')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      setConversations(data || [])
      setLoading(false)
    }

    load()
  }, [router, supabase])

  if (loading) {
    return <div className="p-12 text-center">جاري التحميل...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">محادثاتي</h1>

      {conversations.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          لا توجد محادثات بعد.
        </p>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="block border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <p className="font-medium">
                {c.buyer_id === userId ? 'محادثة مع البائع' : 'محادثة مع مشتري'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.created_at).toLocaleDateString('ar-DZ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}