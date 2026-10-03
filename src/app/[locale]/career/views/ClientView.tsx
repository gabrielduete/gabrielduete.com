'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

import CareerHighlights from '../components/CareerHighlights'
import ExperienceCard from '../components/ExperienceCard'
import { experienceFilters, experienceTypeOrder, experiences } from '../data'
import { ExperienceFilter, IExperiences } from '../types'
import { getCurrentMonth, sortByPeriod } from '../utils/period'

const parseTypeFilter = (value: string | null): ExperienceFilter =>
  experienceFilters.find(filter => filter === value) ?? 'all'

const matchesFilter = (type: string, filter: ExperienceFilter) =>
  filter === 'all' || type === filter

const EXPERIENCE_HASH_PREFIX = '#experience-'

const parseExperienceFromHash = (hash: string): IExperiences | null =>
  experiences.find(
    experience => `${EXPERIENCE_HASH_PREFIX}${experience.id}` === hash,
  )?.id ?? null

const CarrerView = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('CarrerPage')

  const currentMonth = useMemo(() => getCurrentMonth(), [])

  const [typeFilter, setTypeFilter] = useState<ExperienceFilter>(() =>
    parseTypeFilter(searchParams.get('type')),
  )

  const orderedExperiences = useMemo(
    () =>
      sortByPeriod(experiences, currentMonth).sort(
        (a, b) =>
          experienceTypeOrder.indexOf(a.type) -
          experienceTypeOrder.indexOf(b.type),
      ),
    [currentMonth],
  )

  const visibleExperiences = orderedExperiences.filter(experience =>
    matchesFilter(experience.type, typeFilter),
  )

  const [openIds, setOpenIds] = useState<Set<IExperiences>>(() => new Set())
  const pendingScrollRef = useRef<IExperiences | null>(null)

  const allVisibleOpen =
    visibleExperiences.length > 0 &&
    visibleExperiences.every(experience => openIds.has(experience.id))

  const toggleExperience = (id: IExperiences) => {
    setOpenIds(current => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  const toggleAll = () => {
    setOpenIds(current => {
      const next = new Set(current)

      visibleExperiences.forEach(experience =>
        allVisibleOpen ? next.delete(experience.id) : next.add(experience.id),
      )

      return next
    })
  }

  const openExperience = (id: IExperiences) => {
    const experience = experiences.find(item => item.id === id)

    if (experience && !matchesFilter(experience.type, typeFilter)) {
      handleTypeFilter('all')
    }

    setOpenIds(current => new Set(current).add(id))
    pendingScrollRef.current = id
    window.history.replaceState(null, '', `${EXPERIENCE_HASH_PREFIX}${id}`)
  }

  useEffect(() => {
    const id = parseExperienceFromHash(window.location.hash)

    if (id) {
      setOpenIds(current => new Set(current).add(id))
    }
  }, [])

  useEffect(() => {
    const id = pendingScrollRef.current

    if (!id) return

    pendingScrollRef.current = null

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    document.getElementById(`experience-${id}`)?.scrollIntoView?.({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [openIds, typeFilter])

  const handleTypeFilter = (type: ExperienceFilter) => {
    setTypeFilter(type)

    const params = new URLSearchParams(searchParams.toString())

    if (type === 'all') {
      params.delete('type')
    } else {
      params.set('type', type)
    }

    const query = params.toString()

    router.push(query ? `?${query}` : '?', { scroll: false })
  }

  return (
    <div className='flex w-full flex-col gap-giant'>
      <CareerHighlights onOpenExperience={openExperience} />

      <section
        aria-labelledby='career-experiences-title'
        className='flex flex-col gap-xxlarge'
      >
        <header className='flex flex-col gap-large'>
          <h2
            id='career-experiences-title'
            className='text-title-giant font-bold text-primary'
          >
            {t('Feed.title')}
          </h2>
          <div className='flex flex-wrap items-center justify-between gap-base'>
            <ul
              aria-label={t('Feed.filtersLabel')}
              className='flex flex-wrap gap-xsmall'
            >
              {experienceFilters.map(filter => {
                const isSelected = typeFilter === filter
                const count = experiences.filter(experience =>
                  matchesFilter(experience.type, filter),
                ).length

                return (
                  <li key={filter}>
                    <button
                      type='button'
                      onClick={() => handleTypeFilter(filter)}
                      aria-pressed={isSelected}
                      className={clsx(
                        'flex cursor-pointer items-center gap-xsmall rounded-full border px-base py-xsmall text-medium',
                        'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
                        isSelected
                          ? 'border-secondary bg-bg-cards text-white'
                          : 'border-green-weak-border text-primary hover:border-secondary hover:text-secondary',
                      )}
                    >
                      {t(`Filters.${filter}`)}
                      <span
                        aria-hidden
                        className={clsx(
                          'rounded-full px-xsmall text-small',
                          isSelected
                            ? 'bg-card-accent/20 text-card-accent'
                            : 'bg-green-weak',
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <button
              type='button'
              onClick={toggleAll}
              className='cursor-pointer text-medium text-primary underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'
            >
              {allVisibleOpen ? t('Feed.collapseAll') : t('Feed.expandAll')}
            </button>
          </div>
        </header>

        <p className='sr-only' aria-live='polite'>
          {t('Feed.results', { count: visibleExperiences.length })}
        </p>

        <ol className='flex flex-col gap-xxlarge'>
          {visibleExperiences.map((experience, index) => (
            <ExperienceCard
              key={`${typeFilter}-${experience.id}`}
              experience={experience}
              currentMonth={currentMonth}
              index={index}
              isOpen={openIds.has(experience.id)}
              onToggle={toggleExperience}
            />
          ))}
        </ol>
      </section>
    </div>
  )
}

export default CarrerView
