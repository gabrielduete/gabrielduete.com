'use client'

import { useEffect, useState } from 'react'

import { Locales } from '@/enums/Locales'
import { Storages } from '@/enums/Storages'
import { hasWindow } from '@/utils/hasWindow'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

type BackButtonProps = {
  path: string
}

const BackButton = ({ path }: BackButtonProps) => {
  const locale = useLocale()
  const router = useRouter()
  const isEn = locale === Locales.EN

  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    if (!hasWindow) return

    const cameFromNavigation =
      sessionStorage.getItem(Storages.CAME_FROM_NAVIGATION) === 'true'

    sessionStorage.setItem(Storages.CAME_FROM_NAVIGATION, 'true')

    if (window.history.length > 1 && cameFromNavigation) {
      setCanGoBack(true)
    }
  }, [])

  const handleBack = () => {
    if (canGoBack) {
      router.back()
    } else {
      router.push(path)
    }
  }

  return (
    <button
      onClick={handleBack}
      className='cursor-pointer text-secondary hover:text-primary mb-small text-medium'
    >
      ⬅ {isEn ? 'Back' : 'Voltar'}
    </button>
  )
}

export default BackButton
