'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  productId: string
  merchantUserId: string
}

export default function StartChatButton({ productId, merchantUserId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleClick() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // لا يرسل رسالة لنفسه
    if (user.id === merchantUserId) {
      alert('لا يمكنك مراسلة نفسك')
      setLoading(false)
      return
    }

    // البحث عن محادثة موجودة أو إنشاء جديدة
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('product_id', productId)
      .eq('buyer_id', user.id)
      .eq('seller_id', merchantUserId)
      .maybeSingle()

    let conversationId = existing?.id

    if (!conversationId) {
      const { data: created, error } = await supabase
        .from('conversations')
        .insert({
          product_id: productId,
          buyer_id: user.id,
          seller_id: merchantUserId,
        })
        .select('id')
        .single()

      if (error) {
        alert('حدث خطأ: ' + error.message)
        setLoading(false)
        return
      }

      conversationId = created.id
    }

    router.push(`/messages/${conversationId}`)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="border border-teal-700 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-50 transition disabled:opacity-50"
    >
      {loading ? 'جاري الفتح...' : 'راسل البائع'}
    </button>
  )
}