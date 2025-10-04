import { ReactNode } from 'react'

import { FilterProvider } from '@/contexts/FilterContext'
import { routing } from '@/i18n/routing'
import '@/styles/index.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'

import Footer from './components/Footer'
import Header from './components/Header'
import KeyboardEasterEgg from './components/KeyboardEasterEgg'

export const metadata = {
  title: 'Gabriel Duete',
  icons: {
    icon: '/assets/images/logo.png',
    shortcut: '/assets/images/logo.png',
  },
  description: 'Gabriel Duete | Blog',
}

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const Layout = async ({ children, params }: Props) => {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <head>
        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "ssd498pnnn");
            `,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <FilterProvider>
            <Header />
            <main className='w-full max-w-content m-auto px-4 pb-24 lg:px-0 mt-giant'>
              <KeyboardEasterEgg />
              {children}
            </main>
            <Footer />
          </FilterProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default Layout
