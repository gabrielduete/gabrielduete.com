'use client'

import { MouseEvent, useEffect } from 'react'

import Filter from '@/components/Filter'
import { useFilter } from '@/contexts/FilterContext'
import { Locales } from '@/enums/Locales'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

import { CONTRIBUTIONS, FILTERS } from '../index.data'

const LabView = () => {
  const locale = useLocale()
  const t = useTranslations('Common')
  const { setFilters, selectedFilter } = useFilter()

  const isEN = locale === Locales.EN

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()

    event.currentTarget.style.setProperty(
      '--mouse-x',
      `${event.clientX - rect.left}px`,
    )
    event.currentTarget.style.setProperty(
      '--mouse-y',
      `${event.clientY - rect.top}px`,
    )
  }

  const filteredLabs = CONTRIBUTIONS.filter(article => {
    const isAll = selectedFilter === 'Todos' || selectedFilter === 'All'

    const category = isEN ? article.category.en : article.category.pt

    return isAll || category.includes(selectedFilter)
  })

  useEffect(() => {
    setFilters(FILTERS)
  }, [setFilters])

  return (
    <section className='flex flex-col gap-xxlarge'>
      <Filter />
      {filteredLabs.length === 0 && (
        <p
          className='text-medium text-gray-400 text-center lg:text-left'
          data-testid='lab__empty'
        >
          {t('noResults')}
        </p>
      )}
      <div className='flex gap-xxlarge flex-wrap justify-center lg:justify-start'>
        {filteredLabs.map(({ title, description, age, image, link }) => {
          const titleText = isEN ? title.en : title.pt
          const descriptionText = isEN ? description.en : description.pt

          return (
            <article
              key={titleText}
              onMouseMove={handleMouseMove}
              className='
                spotlight-card
                max-w-[312px] w-full p-xxlarge bg-bg-cards cursor-pointer
                rounded-sm border border-bg-cards
              '
            >
              <Link
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                className='flex flex-col justify-between gap-medium'
              >
                <div>
                  <Image
                    src={image}
                    alt={titleText}
                    className='rounded-sm w-full h-[200px] object-cover'
                  />
                  <h1 className='text-title-headline mt-medium text-white'>
                    {titleText}
                  </h1>
                  <p className='text-small text-gray-400 mt-0.5'>{age}</p>
                </div>
                <p className='text-medium text-ellipsis line-clamp-3 mt-auto text-white'>
                  {descriptionText}
                </p>
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default LabView
