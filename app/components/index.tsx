'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import Header from './header'
import Welcome from './welcome'
import { sendChatMessage } from '@/service'

export interface IMainProps {
  params: {
    locale: string
  }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const Main: FC<IMainProps> = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputQuery, setInputQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery
    if (!textToSend.trim() || loading)
      return

    const userMsgId = Date.now().toString()
    const assistantMsgId = (Date.now() + 1).toString()

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: textToSend.trim() },
      { id: assistantMsgId, role: 'assistant', content: '' },
    ])
    setInputQuery('')
    setLoading(true)

    try {
      await sendChatMessage(
        {
          inputs: {},
          query: textToSend.trim(),
          conversation_id: '', // Empty string prevents Dify Chatflow 500 memory crash on turn 2+
          response_mode: 'streaming',
        },
        {
          onData: (messageContent: string) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (last && last.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + messageContent },
                ]
              }
              return prev
            })
          },
          onCompleted: () => {
            setLoading(false)
          },
          onError: (errMsg: string) => {
            setMessages((prev) => {
              const last = prev[prev.length - 1]
              if (last && last.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: `⚠️ ${errMsg || 'Error communicating with Dify.'}` },
                ]
              }
              return prev
            })
            setLoading(false)
          },
        },
      )
    }
    catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last && last.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            { ...last, content: '⚠️ Could not reach the HKUST knowledge base. Please check Dify access.' },
          ]
        }
        return prev
      })
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* 1. Official HKUST Header */}
      <Header />

      {/* 2. Main Chat / Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="pt-8">
              <Welcome onSelectPrompt={handleSend} />
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#003366] text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C99700] uppercase tracking-wider mb-1">
                        <span>🏛️</span> HKUST Academic Advisor
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">
                      {msg.content || (loading && msg.role === 'assistant' ? '...' : '')}
                    </div>
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.content === '' && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-3.5 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#003366] animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-[#C99700] animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#003366] animate-bounce [animation-delay:-.5s]"></div>
                    <span className="text-xs text-slate-500 font-medium ml-1">
                      Consulting SBM regulations...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. Input Form */}
        <div className="sticky bottom-4 bg-white p-2 rounded-2xl border border-slate-300 shadow-lg flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about HKUST SBM courses, major declaration, or credit limits..."
            className="flex-1 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || !inputQuery.trim()}
            className="px-5 py-2.5 bg-[#003366] hover:bg-[#002244] disabled:opacity-40 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Send</span>
            <span>↗</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default React.memo(Main)
