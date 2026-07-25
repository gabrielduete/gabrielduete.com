import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import Card from '.'

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

const article: IArticle = {
  title: 'The art of lazy loading',
  description: 'How to defer work until it is really needed',
  date: '2025-03-14',
  category: 'Performance',
  tags: ['performance'],
  slug: 'art-of-lazy-loading',
  locale: 'en',
}

describe('<Card />', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the article data', () => {
    render(<Card {...article} />)

    expect(screen.getByRole('heading', { name: article.title })).toBeInTheDocument()
    expect(screen.getByText(article.description)).toBeInTheDocument()
    expect(screen.getByText('Mar 14, 2025')).toBeInTheDocument()
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
