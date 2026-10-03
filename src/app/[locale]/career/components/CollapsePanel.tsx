'use client'

import { ReactNode, useLayoutEffect, useRef, useState } from 'react'

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
      style={{ height: isOpen ? height : 0 }}
      className='overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none'
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
}

export default CollapsePanel
