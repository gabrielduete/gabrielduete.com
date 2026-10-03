'use client'

import { useState } from 'react'

import { useFilter } from '@/contexts/FilterContext'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

const VISIBLE_TAGS_LIMIT = 10

type TagFilterProps = {
  tags: string[]
}

const TagFilter = ({ tags }: TagFilterProps) => {
  const t = useTranslations('Common')
  const { selectedTags, toggleTag, clearTags } = useFilter()

  const [showAllTags, setShowAllTags] = useState(false)

  if (!tags.length) {
    return null
  }

  const hiddenTags = tags.slice(VISIBLE_TAGS_LIMIT)

  const visibleTags =
    showAllTags || !hiddenTags.length
      ? tags
      : [
          ...tags.slice(0, VISIBLE_TAGS_LIMIT),
          ...hiddenTags.filter(tag => selectedTags.includes(tag)),
        ]

  return (
    <div
      className='flex w-full flex-wrap items-center gap-xsmall'
      data-testid='tag-filter'
    >
      <ul
        aria-label={t('tagsLabel')}
        className='flex flex-1 flex-wrap items-center gap-xsmall'
      >
        {visibleTags.map(tag => {
          const isSelected = selectedTags.includes(tag)

          return (
            <li key={tag}>
              <button
                type='button'
                onClick={() => toggleTag(tag)}
                aria-pressed={isSelected}
                className={clsx(
                  'cursor-pointer text-small rounded-sm px-small py-xxsmall',
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
        {hiddenTags.length > 0 && (
          <li>
            <button
              type='button'
              onClick={() => setShowAllTags(current => !current)}
              aria-expanded={showAllTags}
              className='cursor-pointer text-small text-gray-400 underline hover:text-secondary'
            >
              {showAllTags
                ? t('showLessTags')
                : t('showMoreTags', { count: hiddenTags.length })}
            </button>
          </li>
        )}
      </ul>
      {selectedTags.length > 0 && (
        <button
          type='button'
          onClick={clearTags}
          className='cursor-pointer text-small text-gray-400 underline hover:text-secondary'
        >
          {t('clearTags')}
        </button>
      )}
    </div>
  )
}

export default TagFilter
