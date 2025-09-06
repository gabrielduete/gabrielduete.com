'use client'

import { useEffect } from 'react'

const KeyBoardEasterEgg = () => {
  const flashScreen = () => {
    const flash = document.createElement('div')
    flash.style.position = 'fixed'
    flash.style.top = '0'
    flash.style.left = '0'
    flash.style.width = '100vw'
    flash.style.height = '100vh'
    flash.style.background = '#fff'
    flash.style.zIndex = '9999'
    flash.style.opacity = '0'
    flash.style.transition = 'opacity 0.05s'
    flash.style.pointerEvents = 'none'

    document.body.appendChild(flash)

    const colors = ['#46ce7a', '#17aadb', '#069b3f', '#097099ec', '#ffffff']
    let count = 0

    const interval = setInterval(() => {
      const isVisible = flash.style.opacity === '0'

      flash.style.opacity = isVisible ? '0.9' : '0'
      flash.style.background = colors[Math.floor(Math.random() * colors.length)]

      count++
      if (count > 20) {
        clearInterval(interval)

        flash.remove()
      }
    }, 100)

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100, 50, 100])
    }
  }

  useEffect(() => {
    const secretKeys = [
      'ArrowLeft',
      'ArrowUp',
      'ArrowDown',
      'd',
      'a',
      'e',
      'ArrowUp',
      'ArrowRight',
      'r',
      'a',
      'g',
      'ArrowDown',
      'ArrowUp',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'g',
      'o',
      'n',
    ]

    let position = 0

    const keyEvent = (e: KeyboardEvent) => {
      const key = e.key
      const isCorrectKey = key === secretKeys[position]
      const defaultPosition = key === secretKeys[0] ? 1 : 0

      if (isCorrectKey) {
        console.log(`%c${key} 🎉`, 'color: #46ce7a; font-size: 16px;')
        position++

        const isFinishKey = position === secretKeys.length

        if (isFinishKey) {
          console.log('%c🎉 EASTER EGG!!!!', 'color: #46ce7a; font-size: 20px;')
          flashScreen()
          position = 0
        }
      } else {
        console.log(`%c${key} ❌`, 'color: #ff4d4d; font-size: 16px;')
        console.log(`%cTry again! 🔄`, 'font-size: 16px;')
        position = defaultPosition
      }
    }

    document.addEventListener('keydown', keyEvent)
    return () => document.removeEventListener('keydown', keyEvent)
  }, [])

  return (
    <span
      className='
        fixed text-secondary bottom-0 right-0
        z-50 opacity-0 hover:opacity-100 transition-opacity duration-300
        cursor-default text-small
      '
      aria-label='Easter egg sequence hint'
    >
      ← ↑ ↓ d a e ↑ → r a g ↓ ↑ → ← → g o n
    </span>
  )
}

export default KeyBoardEasterEgg
