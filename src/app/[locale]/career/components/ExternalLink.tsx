import { FC, ReactNode } from 'react'

import Link from 'next/link'

type ExternalLinkProps = {
  href: string
  children: ReactNode
}

const ExternalLink: FC<ExternalLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='underline text-secondary'
  >
    {children}
  </Link>
)

export default ExternalLink
