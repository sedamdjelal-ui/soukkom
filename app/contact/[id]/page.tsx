'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export default function ChatPage() {
  const params = useParams()
  const conversationId = params.id as string
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
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
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      setMessages(data || [])
      setLoading(false)
    }
    load()

    // استماع للرسائل الجديدة مباشرة
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !userId) return

    setSending(true)
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: content.trim(),
    })

    if (!error) setContent('')
    setSending(false)
  }

  if (loading) {
    return <p className="text-center py-16">جاري التحميل...</p>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">المحادثة</h1>
        <Link href="/messages" className="text-sm text-teal-700 hover:underline">
          العودة
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 border rounded-xl p-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm">لا رسائل بعد — ابدأ المحادثة</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
              m.sender_id === userId
                ? 'bg-teal-700 text-white mr-auto'
                : 'bg-white border ml-auto'
            }`}
          >
            <p>{m.content}</p>
            <p className={`text-[10px] mt-1 ${m.sender_id === userId ? 'text-teal-100' : 'text-gray-400'}`}>
              {new Date(m.created_at).toLocaleTimeString('ar-DZ', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="bg-teal-700 text-white px-5 py-2 rounded-full hover:bg-teal-800 disabled:opacity-50"
        >
          إرسال
        </button>
      </form>
    </div>
  )
}