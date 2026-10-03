import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import Card from '.'

const toggleTagMock = jest.fn()
let currentTags: string[] = []

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}))

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: () => ({ selectedTags: currentTags, toggleTag: toggleTagMock }),
}))

const article: IArticle = {
  title: 'The art of lazy loading',
  description: 'How to defer work until it is really needed',
  date: '2025-03-14',
  category: 'Performance',
  tags: ['performance'],
  slug: 'art-of-lazy-loading',
  locale: 'en',
  readingTime: 7,
}

describe('<Card />', () => {
  beforeEach(() => {
    sessionStorage.clear()
    toggleTagMock.mockClear()
    currentTags = []
  })

  it('renders the article data', () => {
    render(<Card {...article} />)

    expect(
      screen.getByRole('heading', { name: article.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(article.description)).toBeInTheDocument()
    expect(screen.getByText('Mar 14, 2025')).toBeInTheDocument()
  })

  it('renders the reading time', () => {
    render(<Card {...article} />)

    expect(screen.getByText('readingTime:{"minutes":7}')).toBeInTheDocument()
  })

  it('renders the pinned badge only for pinned articles', () => {
    const { rerender } = render(<Card {...article} />)

    expect(screen.queryByTestId('card__pinned')).not.toBeInTheDocument()

    rerender(<Card {...article} pinned />)

    expect(screen.getByTestId('card__pinned')).toBeInTheDocument()
  })

  it('renders at most three tags', () => {
    render(<Card {...article} tags={['a', 'b', 'c', 'd']} />)

    expect(screen.getByRole('button', { name: '#a' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '#c' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '#d' })).not.toBeInTheDocument()
  })

  it('toggles the tag filter without navigating when a tag is clicked', () => {
    render(<Card {...article} />)

    const event = fireEvent.click(
      screen.getByRole('button', { name: '#performance' }),
    )

    expect(toggleTagMock).toHaveBeenCalledWith('performance')
    expect(event).toBe(false)
    expect(sessionStorage.getItem('cameFromNavigation')).toBeNull()
  })

  it('marks the selected tags as pressed', () => {
    currentTags = ['performance']

    render(<Card {...article} />)

    expect(
      screen.getByRole('button', { name: '#performance' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('stretches to fill its grid cell so siblings keep the same height', () => {
    const { container } = render(<Card {...article} />)

    expect(screen.getByRole('link')).toHaveClass('h-full')
    expect(container.querySelector('article')).toHaveClass('h-full')
  })

  it('links to the article inside the current locale', () => {
    render(<Card {...article} />)

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/en/blog/art-of-lazy-loading',
    )
  })

  it('flags the navigation origin when the card is clicked', () => {
    render(<Card {...article} />)

    fireEvent.click(screen.getByRole('link'))

    expect(sessionStorage.getItem('cameFromNavigation')).toBe('true')
  })

  it('tracks the pointer position for the spotlight effect', () => {
    const { container } = render(<Card {...article} />)

    const card = container.querySelector('article') as HTMLElement
    fireEvent.mouseMove(card, { clientX: 24, clientY: 8 })

    expect(card.style.getPropertyValue('--mouse-x')).toBe('24px')
    expect(card.style.getPropertyValue('--mouse-y')).toBe('8px')
  })
})
