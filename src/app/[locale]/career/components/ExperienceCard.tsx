'use client'

import { CSSProperties } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { FiCalendar, FiMapPin, FiTrendingUp } from 'react-icons/fi'

import { typeStyles } from '../data'
import { IExperience } from '../types'
import {
  formatDuration,
  formatPeriod,
  getDurationInMonths,
} from '../utils/period'
import { trackSpotlight } from '../utils/spotlight'
import ExternalLink from './ExternalLink'

const ENTER_STAGGER_MS = 70

type ExperienceCardProps = {
  experience: IExperience
  currentMonth: string
  index: number
}

const ExperienceCard = ({
  experience,
  currentMonth,
  index,
}: ExperienceCardProps) => {
  const t = useTranslations('CarrerPage')
  const tPeriod = useTranslations('CarrerPage.Period')

  const { id, type, period, techs, metrics, groups, website } = experience
  const key = `Experiences.${id}`
  const headingId = `experience-${id}-title`
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
        className='spotlight-card spotlight-loop flex flex-col gap-large rounded-sm border border-green-weak-border bg-bg-primary p-large text-white md:p-xxlarge'
      >
        <header className='flex flex-col gap-small'>
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
          <div className='flex flex-col gap-xxsmall'>
            <h3 id={headingId} className='text-title-headline font-bold'>
              {t(`${key}.company`)}
            </h3>
            <p className='text-subtitle-small text-gray-300'>
              {t(`${key}.role`)}
            </p>
          </div>
          <ul className='flex flex-wrap gap-x-large gap-y-xxsmall text-xsmall text-gray-400'>
            <li className='flex items-center gap-xxsmall'>
              <FiCalendar aria-hidden />
              {periodLabel}
            </li>
            <li className='flex items-center gap-xxsmall'>
              <FiMapPin aria-hidden />
              {t(`${key}.location`)}
            </li>
          </ul>
        </header>

        <ul
          aria-label={t('Feed.techsLabel')}
          className='flex flex-wrap gap-xsmall'
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
            className='flex flex-wrap gap-xsmall'
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
      </article>
    </li>
  )
}

export default ExperienceCard
