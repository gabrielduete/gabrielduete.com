'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { UIMessage } from 'ai'
import { useTranslations } from 'next-intl'
import { FaComments, FaTimes } from 'react-icons/fa'

import { useCurrentPost } from './useCurrentPost'

const STORAGE_KEY = 'chatbot-history'
const MAX_PERSISTED = 50

const ChatBot = () => {
  const t = useTranslations('ChatBot')
  const { locale, slug } = useCurrentPost()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')

  // Restore persisted messages from localStorage on mount (SSR-safe lazy initializer)
  const [restoredMessages] = useState<UIMessage[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  // Keep latest slug/locale in refs so the transport body function always reads fresh values
  const slugRef = useRef(slug)
  const localeRef = useRef(locale)
  slugRef.current = slug
  localeRef.current = locale

  // Build transport once — body is a function that reads refs at request time
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({ currentSlug: slugRef.current, locale: localeRef.current }),
      }),
    [],
  )

  const { messages, sendMessage, status } = useChat({ transport, messages: restoredMessages })

  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_PERSISTED)))
      } catch {
        // persistence is best-effort; ignore quota errors
      }
    }
  }, [messages])

  useEffect(() => {
    if (listRef.current?.scrollTo) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight })
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || status !== 'ready') return
    sendMessage({ text })
    setInput('')
  }

  if (!isOpen) {
    return (
      <button
        aria-label={t('open')}
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-black text-white shadow-lg hover:opacity-90'
      >
        <FaComments size={22} />
      </button>
    )
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col rounded-xl border border-gray-600 bg-green-black text-white shadow-2xl'>
      <header className='flex items-center justify-between border-b border-gray-600 p-3'>
        <span className='font-semibold'>{t('title')}</span>
        <button aria-label={t('close')} onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>
      </header>

      <div ref={listRef} className='flex-1 space-y-3 overflow-y-auto p-3 text-sm'>
        {messages.length === 0 && <p className='text-gray-400'>{t('empty')}</p>}
        {messages.map(message => (
          <div
            key={message.id}
            className={message.role === 'user' ? 'text-right' : 'text-left'}
          >
            <span className='inline-block rounded-lg bg-black/30 px-3 py-2'>
              {message.parts
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((p: any) => p.type === 'text')
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((p: any) => p.text)
                .join('')}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='flex gap-2 border-t border-gray-600 p-3'>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className='flex-1 rounded-md bg-black/30 px-3 py-2 text-sm outline-none'
        />
        <button
          type='submit'
          disabled={status !== 'ready' || !input.trim()}
          className='rounded-md bg-secondary px-3 py-2 text-sm text-white hover:bg-primary disabled:opacity-50'
        >
          {t('send')}
        </button>
      </form>
    </div>
  )
}

export default ChatBot
