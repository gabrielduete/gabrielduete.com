'use client'

import { useEffect, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'
import { FaRegCommentDots, FaRegCopy, FaShareAlt } from 'react-icons/fa'

import { askBot } from '../ChatBot/askBot'

type ToolbarState = {
  text: string
  top: number
  left: number
}

// Floating toolbar shown when the reader selects text inside a blog article.
// Offers: ask the bot about the snippet, copy it, or copy a shareable link.
const SelectionToolbar = () => {
  const t = useTranslations('SelectionToolbar')
  const [state, setState] = useState<ToolbarState | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const dismissTimer = useRef<number | null>(null)

  // Clear any pending dismiss timeout when the component unmounts
  useEffect(
    () => () => {
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current)
    },
    [],
  )

  useEffect(() => {
    const readSelection = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''

      if (!selection || selection.rangeCount === 0 || text.length === 0) {
        setState(null)
        return
      }

      const range = selection.getRangeAt(0)
      const node = range.commonAncestorContainer
      const element =
        node.nodeType === Node.ELEMENT_NODE
          ? (node as Element)
          : node.parentElement

      // Only inside blog article content
      if (!element || !element.closest('article')) {
        setState(null)
        return
      }

      const rect = range.getBoundingClientRect()
      setFeedback(null)
      setState({
        text,
        top: rect.top,
        left: rect.left + rect.width / 2,
      })
    }

    const onMouseUp = () => window.setTimeout(readSelection, 0)
    const onSelectionChange = () => {
      const text = window.getSelection()?.toString().trim() ?? ''
      if (!text) setState(null)
    }
    const onDismiss = () => setState(null)

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('selectionchange', onSelectionChange)
    window.addEventListener('scroll', onDismiss, true)
    window.addEventListener('resize', onDismiss)

    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('selectionchange', onSelectionChange)
      window.removeEventListener('scroll', onDismiss, true)
      window.removeEventListener('resize', onDismiss)
    }
  }, [])

  if (!state) return null

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges()
    setState(null)
  }

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // clipboard may be unavailable; fail silently
    }
  }

  const handleAsk = () => {
    askBot(state.text)
    clearSelection()
  }

  const dismissAfterFeedback = () => {
    if (dismissTimer.current) window.clearTimeout(dismissTimer.current)
    dismissTimer.current = window.setTimeout(clearSelection, 1000)
  }

  const handleCopy = async () => {
    await copyToClipboard(state.text)
    setFeedback(t('copied'))
    dismissAfterFeedback()
  }

  const handleShare = async () => {
    await copyToClipboard(`${window.location.href}\n\n"${state.text}"`)
    setFeedback(t('shared'))
    dismissAfterFeedback()
  }

  const buttonClass =
    'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10'

  return (
    <div
      ref={barRef}
      role='toolbar'
      aria-label={t('label')}
      // Prevent the mousedown from collapsing the text selection before click
      onMouseDown={event => event.preventDefault()}
      style={{
        position: 'fixed',
        top: state.top,
        left: state.left,
        transform: 'translate(-50%, calc(-100% - 8px))',
      }}
      className='z-[60] flex items-center rounded-xl border border-gray-600 bg-green-black p-1 text-white shadow-2xl'
    >
      {feedback ? (
        <span className='px-3 py-1.5 text-xs font-medium text-secondary'>
          {feedback}
        </span>
      ) : (
        <>
          <button type='button' onClick={handleAsk} className={buttonClass}>
            <FaRegCommentDots size={13} />
            {t('askBot')}
          </button>
          <span className='mx-0.5 h-4 w-px bg-gray-600' />
          <button
            type='button'
            onClick={handleCopy}
            aria-label={t('copy')}
            className={buttonClass}
          >
            <FaRegCopy size={13} />
            {t('copy')}
          </button>
          <button
            type='button'
            onClick={handleShare}
            aria-label={t('share')}
            className={buttonClass}
          >
            <FaShareAlt size={13} />
            {t('share')}
          </button>
        </>
      )}
    </div>
  )
}

export default SelectionToolbar
