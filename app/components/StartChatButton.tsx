'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  productId: string
  merchantUserId?: string
}

export default function StartChatButton({ productId, merchantUserId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleStart() {
    if (!merchantUserId) {
      alert('البائع ليس لديه حساب رسائل بعد. استخدم واتساب.')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('merchant_id', merchantUserId)
      .eq('product_id', productId)
      .maybeSingle()

    if (existing) {
      router.push(`/messages/${existing.id}`)
      return
    }

    const { data: created, error } = await supabase
      .from('conversations')
      .insert({
        buyer_id: user.id,
        merchant_id: merchantUserId,
        product_id: productId,
      })
      .select('id')
      .single()

    setLoading(false)

    if (error || !created) {
      alert('تعذر بدء المحادثة')
      return
    }

    router.push(`/messages/${created.id}`)
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="inline-block text-center border border-teal-700 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-50 transition disabled:opacity-50"
    >
      {loading ? 'جاري الفتح...' : 'راسل البائع'}
    </button>
  )
}