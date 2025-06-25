'use client'

import { useState } from 'react'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import { experiences } from './data'
import { IExperiences } from './types'

const Career = () => {
  const [selectedExperience, setSelectedExperience] =
    useState<IExperiences>('Juntos Somos Mais')

  const t = useTranslations('CarrerPage')

  const experience = `Experiences.${selectedExperience}`

  const totalContributions = Number(t(`${experience}.totalContributions`))

  const contributionKeys = Array.from({ length: totalContributions }, (_, i) =>
    (i + 1).toString(),
  )

  return (
    <section className='flex gap-giant'>
      <div
        className='
            w-[312px] p-xxlarge bg-bg-primary rounded-sm text-white flex-shrink-0 self-start
            border-[1px] border-green-weak-border flex flex-col gap-small
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
          {contributionKeys.map(contribution => (
            <li key={contribution} className='text-large text-primary'>
              • {t(`${experience}.contributions.${contribution}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Career
