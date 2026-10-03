'use client'

import { ReactNode } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import { experiencePeriods, experienceTypes, laneOrder } from '../data'
import { IExperiences } from '../types'
import { buildTimelineLayout } from '../utils/lanes'
import ExperienceCard from './ExperienceCard'

const AXIS_WIDTH = '48px'

type ExperienceLanesProps = {
  experiences: IExperiences[]
  selectedExperience: IExperiences | null
  currentMonth: string
  richHandlers: Record<string, (chunks: ReactNode) => ReactNode>
  registerCard: (experience: IExperiences, el: HTMLLIElement | null) => void
  onToggle: (experience: IExperiences) => void
}

const ExperienceLanes = ({
  experiences,
  selectedExperience,
  currentMonth,
  richHandlers,
  registerCard,
  onToggle,
}: ExperienceLanesProps) => {
  const t = useTranslations('CarrerPage')

  const layout = buildTimelineLayout(
    experiences,
    experiencePeriods,
    experienceTypes,
    laneOrder,
    currentMonth,
  )

  if (!layout) {
    return null
  }

  return (
    <div
      data-testid='experience-lanes'
      className='grid gap-small'
      style={{
        gridTemplateColumns: `${AXIS_WIDTH} repeat(${layout.lanes.length}, minmax(0, 1fr))`,
      }}
    >
      <span />
      {layout.lanes.map(lane => (
        <h3
          key={lane.type}
          className='pb-xsmall text-medium text-green-white uppercase'
        >
          {t(`Filters.${lane.type}`)}
        </h3>
      ))}
      <div
        aria-hidden
        className='relative'
        style={{ height: layout.heightPx }}
        data-testid='experience-lanes__axis'
      >
        {layout.years.map(({ year, topPx }) => (
          <span
            key={year}
            style={{ top: topPx }}
            className='absolute right-0 text-small text-green-white'
          >
            {year}
          </span>
        ))}
      </div>
      {layout.lanes.map((lane, laneIndex) => (
        <ol
          key={lane.type}
          aria-label={t(`Filters.${lane.type}`)}
          className='relative'
          style={{ height: layout.heightPx }}
        >
          {lane.items.map(item => {
            const experience = item.experience as IExperiences
            const isActive = selectedExperience === experience

            return (
              <ExperienceCard
                key={experience}
                experience={experience}
                isActive={isActive}
                currentMonth={currentMonth}
                richHandlers={richHandlers}
                onToggle={onToggle}
                cardRef={el => registerCard(experience, el)}
                rail={
                  <span
                    aria-hidden
                    style={{
                      top: item.railTopPx - item.topPx,
                      height: item.railHeightPx,
                    }}
                    className={clsx(
                      'absolute -left-small w-0.5 rounded-sm transition-colors',
                      isActive ? 'bg-secondary' : 'bg-green-weak-border',
                    )}
                  />
                }
                className={clsx(
                  'absolute w-full transition-[width] duration-300',
                  isActive && 'z-10 w-[calc(200%+var(--spacing-small))]',
                  isActive &&
                    laneIndex === layout.lanes.length - 1 &&
                    '-translate-x-[calc(50%+var(--spacing-small)/2)]',
                )}
                style={{ top: item.topPx }}
              />
            )
          })}
        </ol>
      ))}
    </div>
  )
}

export default ExperienceLanes
