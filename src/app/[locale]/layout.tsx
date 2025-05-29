import { ReactNode } from 'react'

import { routing } from '@/i18n/routing'
import '@/styles/globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

export const metadata = {
  title: 'Gabriel Duete',
  description: 'My blog xd',
}

type Props = {
  children: ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body data-theme='dark'>
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
