'use client'

import { useEffect } from 'react'

import Filter from '@/components/Filter'
import { useFilter } from '@/contexts/FilterContext'
import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

import { CONTRIBUTIONS, FILTERS } from '../index.data'

const LabView = () => {
  const locale = useLocale()
  const { setFilters, selectedFilter } = useFilter()

  const isEN = locale === Locales.EN

  const filteredLabs = CONTRIBUTIONS.filter(article => {
    const isAll = selectedFilter === 'Todos' || selectedFilter === 'All'

    const category = isEN ? article.category.en : article.category.pt

    return isAll || category === selectedFilter
  })

  useEffect(() => {
    setFilters(FILTERS)
  }, [setFilters])

  return (
    <section className='flex flex-col gap-xxlarge'>
      <Filter />
      <div className='flex gap-xxlarge flex-wrap justify-center lg:justify-start'>
        {filteredLabs.map(({ title, description, age, image, link }) => {
          const titleText = isEN ? title.en : title.pt
          const descriptionText = isEN ? description.en : description.pt

          return (
            <article
              key={titleText}
              className='
              max-w-[312px] w-full p-xxlarge bg-bg-cards text-primary
              cursor-pointer rounded-sm border border-bg-cards hover:border-secondary
              '
            >
              <Link
                href={link}
                target='_blank'
                className='flex flex-col justify-between gap-medium'
              >
                <div>
                  <Image
                    src={image}
                    alt={titleText}
                    aria-hidden
                    className='rounded-sm w-full h-[200px]'
                  />
                  <h1 className='text-title-headline mt-medium'>{titleText}</h1>
                  <p className='text-small text-gray-400 mt-0.5'>{age}</p>
                </div>
                <p className='text-medium text-ellipsis line-clamp-3 mt-auto'>
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
