'use client'

import { ReactNode } from 'react'

import { ProgressProvider } from '@bprogress/next/app'

type Props = {
  children: ReactNode
}

const ProgressBar = ({ children }: Props) => (
  <ProgressProvider
    color='#46ce7a'
    height='3px'
    options={{ showSpinner: false }}
  >
    {children}
  </ProgressProvider>
)

export default ProgressBar
