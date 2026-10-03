'use client'

import { MouseEvent } from 'react'

import { useFilter } from '@/contexts/FilterContext'
import { Storages } from '@/enums/Storages'
import { formatDate } from '@/utils/formatterDate'
import clsx from 'clsx'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { FiClock } from 'react-icons/fi'

const MAX_VISIBLE_TAGS = 3

const Card = (article: IArticle) => {
  const { title, date, description, slug, tags, pinned, readingTime } = article

  const locale = useLocale()
  const t = useTranslations('Common')
  const { selectedTags, toggleTag } = useFilter()

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)

  const setNavigation = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(Storages.CAME_FROM_NAVIGATION, 'true')
    }
  }

  const handleTagClick = (
    event: MouseEvent<HTMLButtonElement>,
    tag: string,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    toggleTag(tag)
  }

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

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      onClick={setNavigation}
      className='block h-full w-full max-w-[484px]'
    >
      <article
        onMouseMove={handleMouseMove}
        className='
          spotlight-card
          w-full h-full min-h-[260px] p-xxlarge bg-bg-cards text-white
          cursor-pointer rounded-sm border border-bg-cards overflow-hidden
          flex flex-col gap-medium
        '
      >
        <header className='flex flex-col gap-xsmall'>
          <div className='flex items-center gap-xsmall text-small text-gray-400'>
            {pinned && (
              <span
                data-testid='card__pinned'
                className='rounded-sm bg-green-weak px-xsmall py-xxsmall text-secondary'
              >
                {t('pinned')}
              </span>
            )}
            <time dateTime={date}>{formatDate(date, locale as Langs)}</time>
            <span aria-hidden>·</span>
            <span className='flex items-center gap-xxsmall'>
              <FiClock aria-hidden />
              {t('readingTime', { minutes: readingTime })}
            </span>
          </div>
          <h1 className='text-subtitle font-bold line-clamp-2'>{title}</h1>
        </header>
        <p className='text-medium text-ellipsis line-clamp-3 flex-1'>
          {description}
        </p>
        {visibleTags.length > 0 && (
          <ul className='flex flex-wrap gap-xsmall'>
            {visibleTags.map(tag => {
              const isSelected = selectedTags.includes(tag)

              return (
                <li key={tag}>
                  <button
                    type='button'
                    onClick={event => handleTagClick(event, tag)}
                    aria-pressed={isSelected}
                    className={clsx(
                      'cursor-pointer text-small rounded-sm px-xsmall py-xxsmall',
                      'border transition-colors',
                      isSelected
                        ? 'border-secondary text-secondary bg-green-weak'
                        : 'border-green-weak-border text-gray-400 hover:text-secondary hover:border-secondary',
                    )}
                  >
                    #{tag}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </article>
    </Link>
  )
}

export default Card
