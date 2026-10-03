'use client'

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

import ExperienceCard from '../components/ExperienceCard'
import ExperienceLanes from '../components/ExperienceLanes'
import ExternalLink from '../components/ExternalLink'
import {
  experienceFilters,
  experiencePeriods,
  experienceTypes,
  experiences,
} from '../data'
import { ExperienceFilter, IExperiences } from '../types'
import { getCurrentMonth, sortExperiencesByPeriod } from '../utils/period'
import { useIsWideScreen } from '../utils/useIsWideScreen'

const FOCUS_OFFSET_PX = 100
const FOCUS_DURATION_MS = 500

const formatExperienceForUrl = (experience: string): string =>
  experience.replace(/\s+/g, '-')

const parseExperienceFromUrl = (urlValue: string): IExperiences | null => {
  const formattedExperience = urlValue.replace(/-/g, ' ')

  return (
    (experiences.find(
      experience =>
        formatExperienceForUrl(experience) === urlValue ||
        experience === formattedExperience,
    ) as IExperiences) ?? null
  )
}

const CarrerView = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('CarrerPage')

  const currentMonth = useMemo(() => getCurrentMonth(), [])
  const isWideScreen = useIsWideScreen()

  const getInitialExperience = (): IExperiences | null => {
    const filterParam = searchParams.get('filter')

    return filterParam ? parseExperienceFromUrl(filterParam) : null
  }

  const [selectedExperience, setSelectedExperience] =
    useState<IExperiences | null>(getInitialExperience())

  const getInitialTypeFilter = (): ExperienceFilter => {
    const typeParam = searchParams.get('type')

    return experienceFilters.find(filter => filter === typeParam) ?? 'all'
  }

  const [typeFilter, setTypeFilter] = useState<ExperienceFilter>(
    getInitialTypeFilter(),
  )

  const orderedExperiences = useMemo(
    () => sortExperiencesByPeriod(experiences, experiencePeriods, currentMonth),
    [currentMonth],
  )

  const visibleExperiences = orderedExperiences.filter(
    experience =>
      typeFilter === 'all' || experienceTypes[experience] === typeFilter,
  )

  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({})
  const focusFrameRef = useRef(0)

  const registerCard = (experience: IExperiences, el: HTMLLIElement | null) => {
    cardRefs.current[experience] = el
  }

  useEffect(() => {
    const filterParam = searchParams.get('filter')

    if (filterParam) {
      const parsed = parseExperienceFromUrl(filterParam)

      if (parsed && parsed !== selectedExperience) {
        setSelectedExperience(parsed)
      }
    }
  }, [searchParams])

  useEffect(() => {
    return () => cancelAnimationFrame(focusFrameRef.current)
  }, [])

  const focusCard = (el: HTMLElement) => {
    cancelAnimationFrame(focusFrameRef.current)

    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const startTop = el.getBoundingClientRect().top

    if (prefersReduced) {
      window.scrollBy(0, startTop - FOCUS_OFFSET_PX)
      return
    }

    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / FOCUS_DURATION_MS, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const desiredTop = startTop + (FOCUS_OFFSET_PX - startTop) * eased
      const currentTop = el.getBoundingClientRect().top

      window.scrollBy(0, currentTop - desiredTop)

      if (progress < 1) {
        focusFrameRef.current = requestAnimationFrame(tick)
      }
    }

    focusFrameRef.current = requestAnimationFrame(tick)
  }

  const handleExperienceClick = (experience: IExperiences) => {
    const next = selectedExperience === experience ? null : experience

    setSelectedExperience(next)

    if (next) {
      const el = cardRefs.current[next]

      if (el) focusCard(el)
    }

    const params = new URLSearchParams(searchParams.toString())

    if (next) {
      params.set('filter', formatExperienceForUrl(next))
    } else {
      params.delete('filter')
    }

    const query = params.toString()

    router.push(query ? `?${query}` : '?')
  }

  const handleTypeFilter = (type: ExperienceFilter) => {
    setTypeFilter(type)

    const params = new URLSearchParams(searchParams.toString())

    if (type === 'all') {
      params.delete('type')
    } else {
      params.set('type', type)
    }

    const hidesSelected =
      selectedExperience &&
      type !== 'all' &&
      experienceTypes[selectedExperience] !== type

    if (hidesSelected) {
      setSelectedExperience(null)
      params.delete('filter')
    }

    const query = params.toString()

    router.push(query ? `?${query}` : '?')
  }

  const richHandlers = {
    atomium: (chunks: ReactNode) => (
      <ExternalLink href='https://github.com/juntossomosmais/atomium'>
        {chunks}
      </ExternalLink>
    ),
    a: (chunks: ReactNode) => {
      const extractUrl = (node: ReactNode): string => {
        if (typeof node === 'string') {
          return node.trim()
        }

        if (Array.isArray(node)) {
          return node.map(extractUrl).join('').trim()
        }

        if (node && typeof node === 'object' && 'props' in node) {
          const children = node.props?.children

          return children ? extractUrl(children) : ''
        }

        return String(node).trim()
      }

      return <ExternalLink href={extractUrl(chunks)}>{chunks}</ExternalLink>
    },
  }

  return (
    <section className='flex w-full flex-col gap-xxlarge'>
      <ul className='flex flex-wrap gap-xxlarge'>
        {experienceFilters.map(filter => {
          const isSelected = typeFilter === filter

          return (
            <li key={filter}>
              <button
                type='button'
                onClick={() => handleTypeFilter(filter)}
                aria-pressed={isSelected}
                className={clsx(
                  'cursor-pointer text-large text-primary hover:text-secondary',
                  'border-b pb-xxsmall transition-colors',
                  isSelected
                    ? 'border-secondary text-secondary'
                    : 'border-transparent',
                )}
              >
                {t(`Filters.${filter}`)}
              </button>
            </li>
          )
        })}
      </ul>
      {isWideScreen ? (
        <ExperienceLanes
          experiences={visibleExperiences}
          selectedExperience={selectedExperience}
          currentMonth={currentMonth}
          richHandlers={richHandlers}
          registerCard={registerCard}
          onToggle={handleExperienceClick}
        />
      ) : (
        <ol className='flex flex-col gap-large'>
          {visibleExperiences.map(experience => (
            <ExperienceCard
              key={experience}
              experience={experience}
              isActive={selectedExperience === experience}
              currentMonth={currentMonth}
              richHandlers={richHandlers}
              onToggle={handleExperienceClick}
              cardRef={el => registerCard(experience, el)}
            />
          ))}
        </ol>
      )}
    </section>
  )
}

export default CarrerView
