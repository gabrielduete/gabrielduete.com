'use client'

import { ReactNode, useEffect, useState } from 'react'

import { Locales } from '@/enums/Locales'
import clsx from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import ExternalLink from '../components/ExternalLink'
import { experiences } from '../data'
import { IExperiences } from '../types'

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

  const [selectedExperience, setSelectedExperience] = useState<IExperiences>(
    getInitialExperience(),
  )

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
    setSelectedExperience(experience)

    const params = new URLSearchParams(searchParams.toString())

    params.set('filter', formatExperienceForUrl(experience))
    router.push(`?${params.toString()}`)
  }

  const experience = `Experiences.${selectedExperience}`

  const totalContributions = Number(t(`${experience}.totalContributions`))
  const contributionKeys = Array.from({ length: totalContributions }, (_, i) =>
    (i + 1).toString(),
  )

  const hasLink = t(`${experience}.link`).match(/https?:\/\//)

  return (
    <section className='flex flex-col gap-giant items-center lg:flex-row'>
      <div
        className='
          w-[312px] p-xxlarge bg-bg-primary rounded-sm text-white flex-shrink-0 
          border-[1px] border-green-weak-border flex flex-col gap-small self-center lg:self-start
        '
      >
        {experiences.map(experience => (
          <button
            key={experience}
            onClick={() => handleExperienceClick(experience as IExperiences)}
            className={clsx(
              'rounded-sm bg-green-weak-border w-full w-max-[248px] p-small cursor-pointer text-large hover:bg-secondary hover:text-black transition-colors duration-500',
              selectedExperience === experience &&
                'bg-secondary text-black cursor-default',
            )}
          >
            {experience}
          </button>
        ))}
      </div>
      <div>
        <h1 className='text-green-neutral text-title-giant'>
          {t(`${experience}.title`)}
        </h1>
        <p className='text-large text-primary'>{t(`${experience}.role`)}</p>
        <div className='flex flex-col gap-2xs text-green-white text-medium mb-xsmall'>
          <p>{t(`${experience}.time`)}</p>
          <p>{t(`${experience}.location`)}</p>
        </div>
        <ul className='flex flex-col gap-small'>
          {contributionKeys.map(contribution => {
            const path = `${experience}.contributions.${contribution}`

            const content = t.rich(path, {
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
            })

            return (
              <li key={contribution} className='text-large text-primary'>
                • {content}
              </li>
            )
          })}
        </ul>
        {hasLink && (
          <div className='mt-small'>
            <Link
              className='text-gray-400 hover:text-secondary'
              target='_blank'
              rel='noopener noreferrer'
              href={t(`${experience}.link`)}
            >
              👉 {isEn ? 'Learn more' : 'Saiba Mais'}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default CarrerView
