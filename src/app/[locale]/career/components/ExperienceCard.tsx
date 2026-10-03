'use client'

import { CSSProperties } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import {
  FiCalendar,
  FiChevronDown,
  FiMapPin,
  FiTrendingUp,
} from 'react-icons/fi'

import { typeStyles } from '../data'
import { IExperience } from '../types'
import {
  formatDuration,
  formatPeriod,
  getDurationInMonths,
} from '../utils/period'
import { trackSpotlight } from '../utils/spotlight'
import CollapsePanel from './CollapsePanel'
import ExternalLink from './ExternalLink'

const ENTER_STAGGER_MS = 70

type ExperienceCardProps = {
  experience: IExperience
  currentMonth: string
  index: number
  isOpen: boolean
  onToggle: (id: IExperience['id']) => void
}

const ExperienceCard = ({
  experience,
  currentMonth,
  index,
  isOpen,
  onToggle,
}: ExperienceCardProps) => {
  const t = useTranslations('CarrerPage')
  const tPeriod = useTranslations('CarrerPage.Period')

  const { id, type, period, techs, metrics, groups, website } = experience
  const key = `Experiences.${id}`
  const headingId = `experience-${id}-title`
  const panelId = `experience-${id}-panel`
  const contributionsCount = groups.reduce(
    (total, group) => total + group.items.length,
    0,
  )
  const styles = typeStyles[type]

  const periodLabel = period
    ? formatPeriod(period, tPeriod, currentMonth)
    : t('Feed.ongoing')

  return (
    <li
      id={`experience-${id}`}
      style={
        { '--enter-delay': `${index * ENTER_STAGGER_MS}ms` } as CSSProperties
      }
      className='career-enter scroll-mt-24 lg:grid lg:grid-cols-[140px_1fr] lg:gap-xxlarge'
    >
      <div
        aria-hidden
        className='hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:items-end lg:gap-xxsmall lg:self-start lg:pt-large lg:text-right'
      >
        <span className='flex items-center gap-xsmall text-title-headline font-bold text-primary'>
          {period ? period.start.slice(0, 4) : '∞'}
          <span className={clsx('h-2.5 w-2.5 rounded-full', styles.dot)} />
        </span>
        <span className='text-xsmall text-primary opacity-70'>
          {period
            ? `→ ${period.end ? period.end.slice(0, 4) : t('Feed.now')}`
            : t('Feed.ongoing')}
        </span>
        {period && (
          <span className='text-xsmall text-primary opacity-70'>
            {formatDuration(getDurationInMonths(period, currentMonth), tPeriod)}
          </span>
        )}
      </div>
      <article
        aria-labelledby={headingId}
        onMouseMove={trackSpotlight}
        className={clsx(
          'spotlight-card flex flex-col rounded-sm border border-green-weak-border bg-bg-primary p-large text-white md:p-xxlarge',
          isOpen && 'is-focused',
        )}
      >
        <header className='flex flex-col gap-base'>
          <div className='flex flex-wrap items-center justify-between gap-xsmall'>
            <span
              className={clsx(
                'rounded-full border px-small py-xxsmall text-small font-semibold',
                styles.badge,
              )}
            >
              {t(`Types.${type}`)}
            </span>
            {website && (
              <ExternalLink href={website.href} kind={website.kind}>
                {t(`Links.${website.key}`)}
              </ExternalLink>
            )}
          </div>
          <h3 id={headingId}>
            <button
              type='button'
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(id)}
              className='group flex w-full cursor-pointer items-start justify-between gap-base text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-card-accent'
            >
              <span className='flex flex-col gap-xsmall'>
                <span className='flex flex-col gap-xxsmall'>
                  <span
                    className={clsx(
                      'text-title-headline font-bold transition-colors',
                      isOpen
                        ? 'text-card-accent'
                        : 'group-hover:text-card-accent',
                    )}
                  >
                    {t(`${key}.company`)}
                  </span>
                  <span className='text-subtitle-small font-normal text-gray-300'>
                    {t(`${key}.role`)}
                  </span>
                </span>
                <span className='flex flex-wrap gap-x-large gap-y-xxsmall text-xsmall font-normal text-gray-400'>
                  <span className='flex items-center gap-xxsmall'>
                    <FiCalendar aria-hidden />
                    {periodLabel}
                  </span>
                  <span className='flex items-center gap-xxsmall'>
                    <FiMapPin aria-hidden />
                    {t(`${key}.location`)}
                  </span>
                </span>
              </span>
              <span className='mt-xxsmall flex shrink-0 items-center gap-xsmall text-xsmall font-normal text-gray-400 group-hover:text-card-accent'>
                <span className='hidden sm:inline'>
                  {t('Feed.contributionsCount', { count: contributionsCount })}
                </span>
                <FiChevronDown
                  aria-hidden
                  className={clsx(
                    'h-5 w-5 transition-transform duration-300',
                    isOpen && 'rotate-180',
                  )}
                />
              </span>
            </button>
          </h3>
        </header>

        <ul
          aria-label={t('Feed.techsLabel')}
          className='mt-large flex flex-wrap gap-xsmall'
        >
          {techs.map(tech => (
            <li
              key={tech}
              className='rounded-sm border border-green-weak-border px-xsmall py-xxsmall text-small text-gray-300'
            >
              {tech}
            </li>
          ))}
        </ul>

        {metrics.length > 0 && (
          <ul
            aria-label={t('Feed.metricsLabel')}
            className='mt-base flex flex-wrap gap-xsmall'
          >
            {metrics.map(metric => (
              <li
                key={metric}
                className='flex items-center gap-xxsmall rounded-sm border border-card-accent/40 bg-card-accent/10 px-small py-xxsmall text-xsmall font-bold text-card-accent'
              >
                <FiTrendingUp aria-hidden />
                {t(`${key}.metrics.${metric}`)}
              </li>
            ))}
          </ul>
        )}

        <CollapsePanel id={panelId} isOpen={isOpen}>
          <div className='pt-large'>
            <div className='flex flex-col gap-large border-t border-green-weak-border pt-large'>
              {groups.map(group => (
                <section key={group.key} className='flex flex-col gap-xsmall'>
                  <h4 className='text-xsmall font-bold tracking-wider text-card-accent uppercase'>
                    {t(`${key}.groups.${group.key}.title`)}
                  </h4>
                  <ul className='flex flex-col gap-small'>
                    {group.items.map(item => (
                      <li
                        key={item.key}
                        className='relative pl-base text-medium leading-relaxed text-gray-100 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-card-accent/60'
                      >
                        {t(`${key}.groups.${group.key}.items.${item.key}`)}
                        {item.link && (
                          <div className='mt-xxsmall'>
                            <ExternalLink
                              href={item.link.href}
                              kind={item.link.kind}
                            >
                              {t(`Links.${item.link.key}`)}
                            </ExternalLink>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </CollapsePanel>
      </article>
    </li>
  )
}

export default ExperienceCard
