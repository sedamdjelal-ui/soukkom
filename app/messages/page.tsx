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
  merchant_id: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${user.id},merchant_id.eq.${user.id}`)
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
        <p className="text-center text-gray-500">
          لا توجد محادثات حالياً
        </p>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.id}`}
              className="block border rounded-xl p-4 hover:bg-gray-50 transition"
            >
              <p className="font-medium">
                محادثة #{c.id.slice(0, 8)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(c.created_at).toLocaleString('ar-DZ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}