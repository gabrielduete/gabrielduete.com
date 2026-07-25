'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { UIMessage } from 'ai'
import { useTranslations } from 'next-intl'
import { FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa'

import { ASK_BOT_EVENT } from './askBot'
import MarkdownMessage from './MarkdownMessage'
import { useCurrentPost } from './useCurrentPost'

const STORAGE_KEY = 'chatbot-history'
const MAX_PERSISTED = 50

// Extract the plain text of a message from its text parts (type-safe, no `any`).
const textFromParts = (message: UIMessage): string =>
  message.parts
    .filter(
      (part): part is { type: 'text'; text: string } => part.type === 'text',
    )
    .map(part => part.text)
    .join('')

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

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
    messages: restoredMessages,
  })

  const isBusy = status === 'submitted' || status === 'streaming'

  const listRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(messages.slice(-MAX_PERSISTED)),
        )
      } catch {
        // persistence is best-effort; ignore quota errors
      }
    }
  }, [messages])

  useEffect(() => {
    if (listRef.current?.scrollTo) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight })
    }
  }, [messages, isBusy])

  // Autofocus the input when the panel opens
  useEffect(() => {
    if (isOpen) textareaRef.current?.focus()
  }, [isOpen])

  // Open and ask the model when the selection toolbar requests it
  useEffect(() => {
    const handler = (event: Event) => {
      const snippet = (event as CustomEvent<string>).detail?.trim()
      if (!snippet) return
      setIsOpen(true)
      sendMessage({ text: t('askAboutSnippet', { snippet }) })
    }
    window.addEventListener(ASK_BOT_EVENT, handler)
    return () => window.removeEventListener(ASK_BOT_EVENT, handler)
  }, [sendMessage, t])

  // Auto-grow the textarea up to a max height as the user types
  const handleInput = (value: string) => {
    setInput(value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`
    }
  }

  const submit = () => {
    const text = input.trim()
    if (!text || status !== 'ready') return
    sendMessage({ text })
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  // Enter sends; Shift+Enter inserts a newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  if (!isOpen) {
    return (
      <button
        aria-label={t('open')}
        onClick={() => setIsOpen(true)}
        className='fixed bottom-24 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-green-black text-secondary shadow-lg transition-transform hover:scale-105 hover:opacity-90'
      >
        <FaRobot size={22} />
      </button>
    )
  }

  return (
    <div className='fixed bottom-0 right-0 z-50 flex h-[85vh] max-h-[36rem] w-full flex-col border border-gray-600 bg-green-black text-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[34rem] sm:w-[24rem] sm:rounded-2xl'>
      <header className='flex items-center justify-between border-b border-gray-600 px-4 py-3'>
        <span className='font-semibold'>{t('title')}</span>
        <button
          aria-label={t('close')}
          onClick={() => setIsOpen(false)}
          className='cursor-pointer rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white'
        >
          <FaTimes />
        </button>
      </header>

      <div
        ref={listRef}
        className='flex-1 space-y-4 overflow-y-auto px-4 py-4'
      >
        {messages.length === 0 && (
          <p className='mt-2 text-sm leading-relaxed text-gray-400'>
            {t('empty')}
          </p>
        )}
        {messages.map(message => {
          const isUser = message.role === 'user'
          return (
            <div
              key={message.id}
              className={isUser ? 'flex justify-end' : 'flex justify-start'}
            >
              <div
                className={
                  isUser
                    ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-secondary px-3.5 py-2 text-sm whitespace-pre-wrap text-white'
                    : 'max-w-[90%] rounded-2xl rounded-bl-sm bg-white/5 px-3.5 py-2.5'
                }
              >
                {isUser ? (
                  textFromParts(message)
                ) : (
                  <MarkdownMessage content={textFromParts(message)} />
                )}
              </div>
            </div>
          )
        })}
        {isBusy && (
          <div className='flex justify-start' aria-live='polite'>
            <div className='flex gap-1 rounded-2xl rounded-bl-sm bg-white/5 px-4 py-3'>
              <span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]' />
              <span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]' />
              <span className='h-2 w-2 animate-bounce rounded-full bg-gray-400' />
            </div>
          </div>
        )}
        {error && (
          <div className='flex justify-start' aria-live='assertive'>
            <div className='max-w-[90%] rounded-2xl rounded-bl-sm bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400'>
              {t('error')}
              <button
                type='button'
                onClick={() => regenerate()}
                className='mt-2 block cursor-pointer text-xs underline hover:text-red-300'
              >
                {t('retry')}
              </button>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex items-end gap-2 border-t border-gray-600 px-3 py-3'
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={t('placeholder')}
          className='max-h-[120px] flex-1 resize-none rounded-xl bg-black/30 px-3.5 py-2.5 text-sm leading-relaxed outline-none ring-1 ring-transparent placeholder:text-gray-500 focus:ring-secondary'
        />
        <button
          type='submit'
          aria-label={t('send')}
          disabled={status !== 'ready' || !input.trim()}
          className='flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-secondary text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40'
        >
          <FaPaperPlane size={15} />
        </button>
      </form>
    </div>
  )
}

export default ChatBot
