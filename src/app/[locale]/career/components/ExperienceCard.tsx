'use client'

import { MouseEvent, ReactNode, Ref, useState } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { experiencePeriods } from '../data'
import { IExperiences } from '../types'
import { formatPeriod } from '../utils/period'
import CollapsePanel from './CollapsePanel'

const COLLAPSED_CONTRIBUTIONS = 5

type ExperienceCardProps = {
  experience: IExperiences
  isActive: boolean
  currentMonth: string
  cardRef: Ref<HTMLLIElement>
  richHandlers: Record<string, (chunks: ReactNode) => ReactNode>
  onToggle: (experience: IExperiences) => void
}

const ExperienceCard = ({
  experience,
  isActive,
  currentMonth,
  cardRef,
  richHandlers,
  onToggle,
}: ExperienceCardProps) => {
  const t = useTranslations('CarrerPage')
  const tPeriod = useTranslations('CarrerPage.Period')

  const [showAll, setShowAll] = useState(false)

  const experienceKey = `Experiences.${experience}`
  const total = Number(t(`${experienceKey}.totalContributions`))
  const contributionKeys = Array.from({ length: total }, (_, index) =>
    (index + 1).toString(),
  )
  const visibleKeys = showAll
    ? contributionKeys
    : contributionKeys.slice(0, COLLAPSED_CONTRIBUTIONS)
  const hiddenCount = total - COLLAPSED_CONTRIBUTIONS
  const link = t(`${experienceKey}.link`)
  const hasLink = /https?:\/\//.test(link)
  const panelId = `experience-panel-${experience.replace(/\s+/g, '-')}`

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()

    event.currentTarget.style.setProperty(
      '--mouse-x',
      `${event.clientX - rect.left}px`,
    )
    event.currentTarget.style.setProperty(
      '--mouse-y',
      `${event.clientY - rect.top}px`,
    )
  }

  const handleToggle = () => {
    if (isActive) {
      setShowAll(false)
    }

    onToggle(experience)
  }

  return (
    <li ref={cardRef}>
      <div
        onMouseMove={handleMouseMove}
        className={clsx(
          'spotlight-card rounded-sm border-[1px] bg-bg-primary transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1',
          isActive
            ? 'is-focused border-green-weak-border shadow-[0_10px_30px_-12px_rgba(70,206,122,0.35)]'
            : 'border-green-weak-border hover:border-green-white',
        )}
      >
        <button
          aria-label={experience}
          aria-expanded={isActive}
          aria-controls={panelId}
          onClick={handleToggle}
          className='group flex w-full cursor-pointer items-start justify-between gap-small px-large pt-large pb-small text-left'
        >
          <span className='flex flex-col gap-2xs'>
            <h2
              className={clsx(
                'text-title-headline transition-colors',
                isActive
                  ? 'text-secondary'
                  : 'text-white group-hover:text-secondary',
              )}
            >
              {experience}
            </h2>
            <span className='text-subtitle-small text-white'>
              {t(`${experienceKey}.role`)}
            </span>
            <span className='text-medium text-green-white'>
              {formatPeriod(
                experiencePeriods[experience],
                tPeriod,
                currentMonth,
              )}
            </span>
          </span>
          <svg
            aria-hidden
            viewBox='0 0 24 24'
            className={clsx(
              'mt-1 h-5 w-5 flex-shrink-0 text-green-white transition-transform duration-300',
              isActive && 'rotate-180',
            )}
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m6 9 6 6 6-6' />
          </svg>
        </button>
        <CollapsePanel id={panelId} isOpen={isActive}>
          <div
            className={clsx(
              'px-large pb-large transition-opacity duration-500 ease-out',
              isActive ? 'opacity-100 delay-200' : 'opacity-0',
            )}
          >
            <p className='mb-small text-medium text-green-white'>
              {t(`${experienceKey}.location`)}
            </p>
            <ul className='flex flex-col gap-small'>
              {visibleKeys.map((contribution, itemIndex) => (
                <li
                  key={contribution}
                  style={{
                    transitionDelay: isActive
                      ? `${250 + itemIndex * 45}ms`
                      : '0ms',
                  }}
                  className={clsx(
                    'text-large text-white transition-all duration-300 ease-out',
                    isActive
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-1 opacity-0',
                  )}
                >
                  •{' '}
                  {t.rich(
                    `${experienceKey}.contributions.${contribution}`,
                    richHandlers,
                  )}
                </li>
              ))}
            </ul>
            {total > COLLAPSED_CONTRIBUTIONS && (
              <button
                type='button'
                onClick={() => setShowAll(current => !current)}
                className='mt-small cursor-pointer text-medium text-secondary hover:underline'
              >
                {showAll
                  ? t('Contributions.showLess')
                  : t('Contributions.showMore', { count: hiddenCount })}
              </button>
            )}
            {hasLink && (
              <div className='mt-small'>
                <Link
                  className='text-gray-400 hover:text-secondary'
                  target='_blank'
                  rel='noopener noreferrer'
                  href={link}
                >
                  👉 {t('Contributions.learnMore')}
                </Link>
              </div>
            )}
          </div>
        </CollapsePanel>
      </div>
    </li>
  )
}

export default ExperienceCard
