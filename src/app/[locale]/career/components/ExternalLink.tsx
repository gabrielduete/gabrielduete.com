import { FC, ReactNode } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { IconType } from 'react-icons'
import { FiExternalLink } from 'react-icons/fi'
import { GoGitPullRequest, GoIssueOpened, GoRepo } from 'react-icons/go'

import { LinkKind } from '../types'

export const linkIcons: Record<LinkKind, IconType> = {
  issue: GoIssueOpened,
  'pull-request': GoGitPullRequest,
  repository: GoRepo,
  website: FiExternalLink,
}

type ExternalLinkProps = {
  href: string
  children: ReactNode
  kind?: LinkKind
  className?: string
}

const ExternalLink: FC<ExternalLinkProps> = ({
  href,
  children,
  kind = 'website',
  className,
}) => {
  const t = useTranslations('CarrerPage.Feed')
  const Icon = linkIcons[kind]

  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={clsx(
        'inline-flex items-center gap-xxsmall text-xsmall text-gray-300 underline-offset-4 hover:text-card-accent hover:underline',
        className,
      )}
    >
      <Icon aria-hidden className='shrink-0' />
      {children}
      <span className='sr-only'> {t('newTab')}</span>
    </Link>
  )
}

export default ExternalLink
