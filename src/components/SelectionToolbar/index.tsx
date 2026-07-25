'use client'

import { useEffect, useRef, useState } from 'react'

import { useTranslations } from 'next-intl'
import { FaRegCommentDots, FaRegCopy, FaShareAlt } from 'react-icons/fa'
import { FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'

import { askBot } from '../ChatBot/askBot'

type ToolbarState = {
  text: string
  top: number
  left: number
}

// Floating toolbar shown when the reader selects text inside a blog article.
// Offers: ask the bot about the snippet, copy it, or share it to X / LinkedIn.
const SelectionToolbar = () => {
  const t = useTranslations('SelectionToolbar')
  const [state, setState] = useState<ToolbarState | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [mode, setMode] = useState<'actions' | 'share'>('actions')
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
      setMode('actions')
      setState({
        text,
        top: rect.top,
        left: rect.left + rect.width / 2,
      })
    }

    const onMouseUp = (event: MouseEvent) => {
      // Clicks inside the toolbar must not re-read the selection (which would
      // reset the submenu back to the default actions)
      if (barRef.current?.contains(event.target as Node)) return
      window.setTimeout(readSelection, 0)
    }
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

  const handleAsk = () => {
    askBot(state.text)
    clearSelection()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(state.text)
    } catch {
      // clipboard may be unavailable; fail silently
    }
    setFeedback(t('copied'))
    if (dismissTimer.current) window.clearTimeout(dismissTimer.current)
    dismissTimer.current = window.setTimeout(clearSelection, 1000)
  }

  // Open the platform's pre-filled compose window in a new tab
  const openShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    clearSelection()
  }

  const shareOnX = () => {
    const quote = `"${state.text}"`
    const url =
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote)}` +
      `&url=${encodeURIComponent(window.location.href)}`
    openShare(url)
  }

  const shareOnLinkedin = () => {
    // LinkedIn dropped the official text prefill; the feed composer with a
    // `text` param is the current working way to open it pre-filled.
    const text = `"${state.text}"\n\n${window.location.href}`
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      text,
    )}`
    openShare(url)
  }

  const buttonClass =
    'flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-white/10'

  const renderContent = () => {
    if (feedback) {
      return (
        <span className='px-3 py-1.5 text-xs font-medium text-secondary'>
          {feedback}
        </span>
      )
    }

    if (mode === 'share') {
      return (
        <>
          <button
            type='button'
            onClick={shareOnX}
            aria-label={t('shareX')}
            className={buttonClass}
          >
            <FaXTwitter size={13} />X
          </button>
          <span className='mx-0.5 h-4 w-px bg-gray-600' />
          <button
            type='button'
            onClick={shareOnLinkedin}
            aria-label={t('shareLinkedin')}
            className={buttonClass}
          >
            <FaLinkedinIn size={13} />
            LinkedIn
          </button>
        </>
      )
    }

    return (
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
          onClick={() => setMode('share')}
          aria-label={t('share')}
          className={buttonClass}
        >
          <FaShareAlt size={13} />
          {t('share')}
        </button>
      </>
    )
  }

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
      {renderContent()}
    </div>
  )
}

export default SelectionToolbar
