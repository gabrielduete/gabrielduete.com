import React, { memo } from 'react'

import Footer from './components/Footer'
import Header from './components/Header'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = memo(({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
})

export default Layout
