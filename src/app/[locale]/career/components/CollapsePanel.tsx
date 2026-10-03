'use client'

import { ReactNode, useLayoutEffect, useRef, useState } from 'react'

export const COLLAPSE_OPEN_MS = 600
export const COLLAPSE_CLOSE_MS = 450
// Ease-out that settles slowly, so the end of the motion feels soft
export const COLLAPSE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

type CollapsePanelProps = {
  id: string
  isOpen: boolean
  children: ReactNode
}

const CollapsePanel = ({ id, isOpen, children }: CollapsePanelProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return

    const measure = () => setHeight(el.scrollHeight)
    measure()

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    observer?.observe(el)
    window.addEventListener('resize', measure)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [children])

  return (
    <div
      id={id}
      inert={!isOpen}
      style={{
        height: isOpen ? height : 0,
        transitionDuration: `${isOpen ? COLLAPSE_OPEN_MS : COLLAPSE_CLOSE_MS}ms`,
        transitionTimingFunction: COLLAPSE_EASING,
      }}
      className='cursor-auto overflow-hidden transition-[height] motion-reduce:transition-none'
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
}

export default CollapsePanel
