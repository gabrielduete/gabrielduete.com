import { ReactNode } from 'react'

import { FilterProvider } from '@/contexts/FilterContext'
import { routing } from '@/i18n/routing'
import '@/styles/index.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'

import Footer from './components/Footer'
import Header from './components/Header'

export const metadata = {
  title: 'Gabriel Duete',
  description: 'Gabriel Duete | Blog',
}

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <FilterProvider>
            <Header />
            <main className='w-full max-w-content m-auto px-4 pb-24 lg:px-0 mt-giant'>
              {children}
            </main>
            <Footer />
          </FilterProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
