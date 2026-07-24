'use client'

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Locales } from '@/enums/Locales'
import clsx from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import ExternalLink from '../components/ExternalLink'
import { experiences } from '../data'
import { IExperiences } from '../types'

const COLLAPSED_CONTRIBUTIONS = 5

const formatExperienceForUrl = (experience: string): string => {
  return experience.replace(/\s+/g, '-')
}

const parseExperienceFromUrl = (urlValue: string): IExperiences | null => {
  const formattedExperience = urlValue.replace(/-/g, ' ')

  return experiences.find(
    exp =>
      formatExperienceForUrl(exp) === urlValue || exp === formattedExperience,
  ) as IExperiences | null
}

const CollapsePanel = ({
  id,
  isOpen,
  children,
}: {
  id: string
  isOpen: boolean
  children: ReactNode
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return

    const measure = () => setHeight(el.scrollHeight)
    measure()

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    observer?.observe(el)
    window.addEventListener('resize', measure)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [children])

  return (
    <div
      id={id}
      style={{ height: isOpen ? height : 0 }}
      className='overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]'
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
}

const CarrerView = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const isEn = locale === Locales.EN
  const t = useTranslations('CarrerPage')

  const getInitialExperience = (): IExperiences => {
    const filterParam = searchParams.get('filter')

    if (filterParam) {
      const parsed = parseExperienceFromUrl(filterParam)
      if (parsed) return parsed
    }
    return 'Petlove'
  }

  const [selectedExperience, setSelectedExperience] =
    useState<IExperiences | null>(getInitialExperience())

  const [showAllFor, setShowAllFor] = useState<Record<string, boolean>>({})

  const toggleShowAll = (experience: string) =>
    setShowAllFor(prev => ({ ...prev, [experience]: !prev[experience] }))

  const timelineRef = useRef<HTMLOListElement>(null)
  const [timeline, setTimeline] = useState<{
    width: number
    height: number
    dotYs: number[]
  }>({ width: 0, height: 0, dotYs: [] })

  useLayoutEffect(() => {
    const ol = timelineRef.current
    if (!ol) return

    const measure = () => {
      const olRect = ol.getBoundingClientRect()
      const dots = ol.querySelectorAll('[data-timeline-dot]')
      const dotYs = Array.from(dots).map(dot => {
        const rect = dot.getBoundingClientRect()
        return rect.top - olRect.top + rect.height / 2
      })
      setTimeline({ width: olRect.width, height: olRect.height, dotYs })
    }

    measure()
    window.addEventListener('resize', measure)

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    observer?.observe(ol)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [selectedExperience])

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam) {
      const parsed = parseExperienceFromUrl(filterParam)

      if (parsed && parsed !== selectedExperience) {
        setSelectedExperience(parsed)
      }
    }
  }, [searchParams])

  const handleExperienceClick = (experience: IExperiences) => {
    const next = selectedExperience === experience ? null : experience
    setSelectedExperience(next)

    if (!next) {
      setShowAllFor(prev => ({ ...prev, [experience]: false }))
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
          return extractUrl(node.props?.children || node)
        }

        return String(node).trim()
      }
      const url = extractUrl(chunks)
      return <ExternalLink href={url}>{chunks}</ExternalLink>
    },
  }

  const WAVE_AMPLITUDE = 40
  const cx = timeline.width / 2
  const serpentinePath = timeline.dotYs.reduce((path, y, i) => {
    if (i === 0) return `M ${cx} 0 L ${cx} ${y}`
    const dir = i % 2 === 0 ? 1 : -1
    const midY = (timeline.dotYs[i - 1] + y) / 2
    return `${path} Q ${cx + dir * WAVE_AMPLITUDE} ${midY} ${cx} ${y}`
  }, '')
  const fullPath = timeline.dotYs.length
    ? `${serpentinePath} L ${cx} ${timeline.height}`
    : ''

  return (
    <section className='w-full'>
      <ol ref={timelineRef} className='relative flex flex-col gap-giant'>
        <span
          aria-hidden
          className='absolute top-2 bottom-2 left-[9px] w-0.5 bg-green-weak-border lg:hidden'
        />
        <svg
          aria-hidden
          viewBox={`0 0 ${timeline.width} ${timeline.height}`}
          preserveAspectRatio='none'
          className='pointer-events-none absolute inset-0 hidden h-full w-full lg:block'
        >
          <path
            d={fullPath}
            fill='none'
            className='stroke-green-weak-border'
            strokeWidth={2}
            vectorEffect='non-scaling-stroke'
          />
        </svg>
        {experiences.map((experience, index) => {
          const experienceKey = `Experiences.${experience}`
          const isActive = selectedExperience === experience
          const isLeft = index % 2 === 0
          const total = Number(t(`${experienceKey}.totalContributions`))
          const contributionKeys = Array.from({ length: total }, (_, i) =>
            (i + 1).toString(),
          )
          const showAll = showAllFor[experience] ?? false
          const visibleKeys = showAll
            ? contributionKeys
            : contributionKeys.slice(0, COLLAPSED_CONTRIBUTIONS)
          const hiddenCount = total - COLLAPSED_CONTRIBUTIONS
          const link = t(`${experienceKey}.link`)
          const hasLink = /https?:\/\//.test(link)
          const panelId = `experience-panel-${index}`

          return (
            <li key={experience} className='relative'>
              <button
                aria-hidden
                tabIndex={-1}
                data-timeline-dot
                onClick={() =>
                  handleExperienceClick(experience as IExperiences)
                }
                className={clsx(
                  'absolute top-2 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-500 ease-[cubic-bezier(0.42,0,0.58,1)]',
                  'left-0 lg:left-1/2 lg:-translate-x-1/2',
                  'hover:scale-125 hover:border-secondary',
                  isActive
                    ? 'scale-110 border-secondary bg-secondary ring-4 ring-secondary/20'
                    : 'border-green-white bg-bg-primary',
                )}
              >
                <span
                  className={clsx(
                    'h-1.5 w-1.5 rounded-full bg-bg-primary transition-opacity duration-500',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </button>
              <div
                className={clsx(
                  'ml-large lg:ml-0 lg:w-[calc(50%-40px)]',
                  isLeft ? 'lg:mr-auto' : 'lg:ml-auto',
                )}
              >
                <div
                  className={clsx(
                    'rounded-sm border-[1px] bg-bg-primary transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1',
                    isActive
                      ? 'border-secondary shadow-[0_10px_30px_-12px_rgba(70,206,122,0.35)]'
                      : 'border-green-weak-border hover:border-green-white',
                  )}
                >
                  <button
                    aria-label={experience}
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() =>
                      handleExperienceClick(experience as IExperiences)
                    }
                    className='group flex w-full cursor-pointer items-start justify-between gap-small p-large text-left'
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
                      <span className='text-medium text-primary'>
                        {t(`${experienceKey}.role`)}
                      </span>
                      <span className='text-xsmall text-green-white'>
                        {t(`${experienceKey}.time`)}
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
                      <p className='mb-small text-xsmall text-green-white'>
                        {t(`${experienceKey}.location`)}
                      </p>
                      <ul className='flex flex-col gap-small'>
                        {visibleKeys.map((contribution, itemIndex) => {
                          const path = `${experienceKey}.contributions.${contribution}`
                          const content = t.rich(path, richHandlers)

                          return (
                            <li
                              key={contribution}
                              style={{
                                transitionDelay: isActive
                                  ? `${250 + itemIndex * 45}ms`
                                  : '0ms',
                              }}
                              className={clsx(
                                'text-large text-primary transition-all duration-300 ease-out',
                                isActive
                                  ? 'translate-x-0 opacity-100'
                                  : '-translate-x-1 opacity-0',
                              )}
                            >
                              • {content}
                            </li>
                          )
                        })}
                      </ul>
                      {total > COLLAPSED_CONTRIBUTIONS && (
                        <button
                          type='button'
                          onClick={() => toggleShowAll(experience)}
                          className='mt-small cursor-pointer text-medium text-secondary hover:underline'
                        >
                          {showAll
                            ? isEn
                              ? 'Show less'
                              : 'Ver menos'
                            : `${isEn ? 'Show more' : 'Ver mais'} (+${hiddenCount})`}
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
                            👉 {isEn ? 'Learn more' : 'Saiba Mais'}
                          </Link>
                        </div>
                      )}
                    </div>
                  </CollapsePanel>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default CarrerView
