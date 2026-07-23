'use client'

import { useEffect, useRef, useState } from 'react'

import { Storages } from '@/enums/Storages'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

type Origin = { x: number; y: number }

const ToggleTheme = () => {
  const [theme, setThemeState] = useState<Themes>('dark')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedTheme = localStorage.getItem(Storages.THEME) as Themes

    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    const initialTheme = storedTheme ?? (systemPrefersDark ? 'dark' : 'light')

    setThemeState(initialTheme)
    document.body.dataset.theme = initialTheme
  }, [])

  const applyTheme = (next: Themes) => {
    document.body.dataset.theme = next
    localStorage.setItem(Storages.THEME, next)
    setThemeState(next)
  }

  const setTheme = (next: Themes, origin: Origin) => {
    const startViewTransition = (
      document as Document & {
        startViewTransition?: (cb: () => void) => {
          ready: Promise<void>
        }
      }
    ).startViewTransition

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (!startViewTransition || prefersReducedMotion) {
      applyTheme(next)
      return
    }

    // Circle grows from the toggle out to the farthest screen corner.
    const endRadius = Math.hypot(
      Math.max(origin.x, window.innerWidth - origin.x),
      Math.max(origin.y, window.innerHeight - origin.y),
    )

    const transition = startViewTransition.call(document, () => applyTheme(next))

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 450,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  const isDark = theme === 'dark'

  const toggle = (origin: Origin) => setTheme(isDark ? 'light' : 'dark', origin)

  const originFromElement = (): Origin => {
    const rect = rootRef.current?.getBoundingClientRect()

    if (!rect) return { x: window.innerWidth, y: 0 }

    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }

  return (
    <div
      ref={rootRef}
      className='cursor-pointer'
      onClick={e => toggle({ x: e.clientX, y: e.clientY })}
      aria-label='Toggle theme'
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle(originFromElement())
        }
      }}
    >
      {isDark ? (
        <MdLightMode size={24} className='text-secondary' />
      ) : (
        <MdDarkMode size={24} className='text-primary' />
      )}
    </div>
  )
}

export default ToggleTheme
