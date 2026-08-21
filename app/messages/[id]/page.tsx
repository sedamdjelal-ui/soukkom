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
  const router = useRouter()
  const supabase = createClient()

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

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
        .from('messages')
        .select('id, content, sender_id, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      setMessages(data || [])
      setLoading(false)
    }

    load()
  }, [conversationId, router, supabase])

  // الاستماع للرسائل الجديدة فورياً
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !userId) return

    const content = newMessage.trim()
    setNewMessage('')

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
    })

    if (error) {
      alert('خطأ: ' + error.message)
    }
  }

  if (loading) {
    return <div className="p-12 text-center">جاري التحميل...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col h-[80vh]">
      <Link
        href="/messages"
        className="text-sm text-teal-700 hover:underline mb-4 inline-block"
      >
        ← كل المحادثات
      </Link>

      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl p-4 space-y-3 mb-4 bg-white">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            لا توجد رسائل بعد. ابدأ المحادثة.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === userId ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                  msg.sender_id === userId
                    ? 'bg-teal-700 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-700"
        />
        <button
          type="submit"
          className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition"
        >
          إرسال
        </button>
      </form>
    </div>
  )
}