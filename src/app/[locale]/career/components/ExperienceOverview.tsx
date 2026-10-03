'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import { experiencePeriods, experienceTypes } from '../data'
import { ExperienceType, IExperiences } from '../types'
import { formatPeriod, getPeriodEnd, toMonthIndex } from '../utils/period'

const TYPE_BAR_CLASSES: Record<ExperienceType, string> = {
  'full-time': 'bg-secondary',
  freelance: 'bg-secondary/60',
  'open-source': 'bg-secondary/25 border border-secondary/60',
}

const ROW_GRID = 'grid grid-cols-1 gap-xxsmall lg:grid-cols-[150px_1fr]'

type ExperienceOverviewProps = {
  experiences: IExperiences[]
  selectedExperience: IExperiences | null
  currentMonth: string
  onSelect: (experience: IExperiences) => void
}

const ExperienceOverview = ({
  experiences,
  selectedExperience,
  currentMonth,
  onSelect,
}: ExperienceOverviewProps) => {
  const t = useTranslations('CarrerPage')
  const tPeriod = useTranslations('CarrerPage.Period')

  if (!experiences.length) {
    return null
  }

  const bounds = experiences.map(experience => ({
    start: toMonthIndex(experiencePeriods[experience].start),
    end: toMonthIndex(
      getPeriodEnd(experiencePeriods[experience], currentMonth),
    ),
  }))

  const firstMonth = Math.min(...bounds.map(bound => bound.start))
  const lastMonth = Math.max(...bounds.map(bound => bound.end))
  const totalMonths = lastMonth - firstMonth + 1

  const firstYear = Math.floor(firstMonth / 12)
  const lastYear = Math.floor(lastMonth / 12)
  const years = Array.from(
    { length: lastYear - firstYear + 1 },
    (_, index) => firstYear + index,
  )

  const toPercent = (months: number) => (months / totalMonths) * 100
  const yearOffset = (year: number) => toPercent(year * 12 - firstMonth)

  return (
    <section
      aria-label={t('Overview.title')}
      data-testid='experience-overview'
      className='flex flex-col gap-small rounded-sm border border-green-weak-border bg-bg-primary p-large'
    >
      <p className='text-medium text-green-white'>
        {t('Overview.description')}
      </p>
      <ul className='flex flex-col gap-xsmall'>
        {experiences.map(experience => {
          const period = experiencePeriods[experience]
          const start = toMonthIndex(period.start)
          const end = toMonthIndex(getPeriodEnd(period, currentMonth))
          const isSelected = selectedExperience === experience
          const label = formatPeriod(period, tPeriod, currentMonth)

          return (
            <li key={experience}>
              <button
                type='button'
                onClick={() => onSelect(experience)}
                aria-pressed={isSelected}
                className={clsx(
                  ROW_GRID,
                  'group w-full cursor-pointer items-center rounded-sm py-xxsmall text-left lg:gap-small',
                )}
              >
                <span className='sr-only'>
                  {t('Overview.selectExperience', {
                    experience,
                    period: label,
                  })}
                </span>
                <span
                  aria-hidden
                  className={clsx(
                    'truncate text-small transition-colors',
                    isSelected
                      ? 'text-secondary'
                      : 'text-green-white group-hover:text-secondary',
                  )}
                >
                  {experience}
                </span>
                <span aria-hidden className='relative block h-5 w-full'>
                  <span
                    style={{
                      left: `${toPercent(start - firstMonth)}%`,
                      width: `${toPercent(end - start + 1)}%`,
                    }}
                    className={clsx(
                      'absolute top-1/2 block h-3 min-w-[4px] -translate-y-1/2 rounded-sm transition-all duration-300',
                      TYPE_BAR_CLASSES[experienceTypes[experience]],
                      isSelected
                        ? 'ring-2 ring-secondary'
                        : 'opacity-70 group-hover:opacity-100',
                    )}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div aria-hidden className={clsx(ROW_GRID, 'lg:gap-small')}>
        <span className='hidden lg:block' />
        <span className='relative block h-5 w-full'>
          {years.map(year => (
            <span
              key={year}
              style={{ left: `${yearOffset(year)}%` }}
              className='absolute top-0 border-l border-green-weak-border pl-xxsmall text-small text-green-white'
            >
              {year}
            </span>
          ))}
        </span>
      </div>
    </section>
  )
}

export default ExperienceOverview
