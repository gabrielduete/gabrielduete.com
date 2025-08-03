'use client'

import { useState } from 'react'

import { Locales } from '@/enums/Locales'
import clsx from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

import { experiences } from '../data'
import { IExperiences } from '../types'

const CarrerView = () => {
  const [selectedExperience, setSelectedExperience] =
    useState<IExperiences>('Juntos Somos Mais')

  const locale = useLocale()
  const isEn = locale === Locales.EN
  const t = useTranslations('CarrerPage')

  const experience = `Experiences.${selectedExperience}`

  const totalContributions = Number(t(`${experience}.totalContributions`))
  const contributionKeys = Array.from({ length: totalContributions }, (_, i) =>
    (i + 1).toString(),
  )

  const hasLink = t(`${experience}.link`).match(/https?:\/\//)

  const ExternalLink = (href: string) => (chunks: React.ReactNode) => (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='underline text-secondary'
    >
      {chunks}
    </Link>
  )

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
            onClick={() => setSelectedExperience(experience as IExperiences)}
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
        <p className='text-green-white text-medium mb-xsmall'>
          {t(`${experience}.time`)}
        </p>
        <ul className='flex flex-col gap-small'>
          {contributionKeys.map(contribution => {
            const path = `${experience}.contributions.${contribution}`

            const content = t.rich(path, {
              atomium: ExternalLink(
                'https://github.com/juntossomosmais/atomium',
              ),
              venice: ExternalLink('https://github.com/juntossomosmais/venice'),
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
