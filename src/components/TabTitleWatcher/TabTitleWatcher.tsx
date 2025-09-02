'use client'

import { useEffect } from 'react'

import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'

type TabTitleWatcherProps = {
  originalTitle: string
}

const TabTitleWatcher = ({ originalTitle }: TabTitleWatcherProps) => {
  const locale = useLocale()

  const isEN = locale === Locales.EN

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    const handleVisibilityChange = () => {
      if (document.hidden) {
        intervalId = setInterval(() => {
          document.title = isEN
            ? 'Hey, is anyone there?'
            : 'Opa, tem alguém aí?'
        }, 10000)
      } else {
        if (intervalId) {
          clearInterval(intervalId)
          intervalId = null
        }

        document.title = originalTitle
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [originalTitle, isEN])

  return null
}

export default TabTitleWatcher
