'use client'

import { usePathname } from 'next/navigation'

export function useCurrentPost(): { locale: string; slug: string | null } {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0] === 'pt-br' ? 'pt-br' : 'en'
  const slug =
    segments[1] === 'blog' && segments[2] ? decodeURIComponent(segments[2]) : null

  return { locale, slug }
}
