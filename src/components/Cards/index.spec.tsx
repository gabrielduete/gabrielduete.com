import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import Cards from '.'

const pushMock = jest.fn()
let currentParams = new URLSearchParams()
let currentFilter = 'All'
let currentQuery = ''
let currentTags: string[] = []
const toggleTagMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/en/blog',
  useSearchParams: () => currentParams,
}))

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: () => ({
    selectedFilter: currentFilter,
    query: currentQuery,
    selectedTags: currentTags,
    toggleTag: toggleTagMock,
  }),
}))

const makeArticle = (overrides: Partial<IArticle>): IArticle => ({
  title: 'Title',
  description: 'Description',
  date: '2025-01-01',
  category: 'Engineering',
  tags: [],
  slug: 'slug',
  locale: 'en',
  pinned: false,
  readingTime: 3,
  ...overrides,
})

const articles: IArticle[] = Array.from({ length: 9 }, (_, index) =>
  makeArticle({
    title: `Article ${index + 1}`,
    slug: `article-${index + 1}`,
    date: `2025-01-0${index + 1}`,
  }),
)

describe('<Cards />', () => {
  beforeEach(() => {
    pushMock.mockClear()
    currentParams = new URLSearchParams()
    currentFilter = 'All'
    currentQuery = ''
    currentTags = []
    toggleTagMock.mockClear()
  })

  it('renders the empty state when nothing matches the filter', () => {
    currentFilter = 'Performance'

    render(<Cards articles={articles} />)

    expect(screen.getByTestId('cards__empty')).toBeInTheDocument()
  })

  it('shows only the first page of articles', () => {
    render(<Cards articles={articles} />)

    expect(screen.getByText('Article 9')).toBeInTheDocument()
    expect(screen.queryByText('Article 5')).not.toBeInTheDocument()
  })

  it('sorts pinned articles first and the rest by date', () => {
    render(
      <Cards
        articles={[
          makeArticle({ title: 'Old', slug: 'old', date: '2024-01-01' }),
          makeArticle({ title: 'New', slug: 'new', date: '2025-06-01' }),
          makeArticle({ title: 'Pinned', slug: 'pinned', pinned: true }),
        ]}
      />,
    )

    const titles = screen
      .getAllByRole('heading')
      .map(heading => heading.textContent)

    expect(titles).toEqual(['Pinned', 'New', 'Old'])
  })

  it('pushes the page number when navigating forward', () => {
    render(<Cards articles={articles} />)

    fireEvent.click(screen.getByRole('button', { name: 'nextPage' }))

    expect(pushMock).toHaveBeenCalledWith('/en/blog?page=2', { scroll: false })
  })

  it('drops the page param when going back to the first page', () => {
    currentParams = new URLSearchParams('page=2')

    render(<Cards articles={articles} />)
    fireEvent.click(screen.getByRole('button', { name: 'previousPage' }))

    expect(pushMock).toHaveBeenCalledWith('/en/blog', { scroll: false })
  })

  it('keeps the other query params when paginating', () => {
    currentParams = new URLSearchParams('filter=Engineering')

    render(<Cards articles={articles} />)
    fireEvent.click(screen.getByRole('button', { name: 'nextPage' }))

    expect(pushMock).toHaveBeenCalledWith(
      '/en/blog?filter=Engineering&page=2',
      { scroll: false },
    )
  })

  it('ignores an out-of-range page param', () => {
    currentParams = new URLSearchParams('page=99')

    render(<Cards articles={articles} />)

    expect(screen.getByText('Article 1')).toBeInTheDocument()
  })

  it('ignores a non numeric page param', () => {
    currentParams = new URLSearchParams('page=abc')

    render(<Cards articles={articles} />)

    expect(screen.getByText('Article 9')).toBeInTheDocument()
  })

  it('filters the articles by the search query', () => {
    currentQuery = 'article 3'

    render(<Cards articles={articles} />)

    expect(screen.getByText('Article 3')).toBeInTheDocument()
    expect(screen.queryByText('Article 9')).not.toBeInTheDocument()
  })

  it('filters the articles by the selected tags with an OR semantic', () => {
    currentTags = ['react', 'css']

    render(
      <Cards
        articles={[
          makeArticle({ title: 'React', slug: 'react', tags: ['react'] }),
          makeArticle({ title: 'Css', slug: 'css', tags: ['css'] }),
          makeArticle({ title: 'Git', slug: 'git', tags: ['git'] }),
        ]}
      />,
    )

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Css')).toBeInTheDocument()
    expect(screen.queryByText('Git')).not.toBeInTheDocument()
  })

  it('combines the category, tag and query filters', () => {
    currentFilter = 'Engineering'
    currentTags = ['react']
    currentQuery = 'hooks'

    render(
      <Cards
        articles={[
          makeArticle({
            title: 'React hooks',
            slug: 'react-hooks',
            tags: ['react'],
          }),
          makeArticle({
            title: 'React router',
            slug: 'react-router',
            tags: ['react'],
          }),
          makeArticle({
            title: 'Css hooks',
            slug: 'css-hooks',
            category: 'Front-end',
            tags: ['react'],
          }),
        ]}
      />,
    )

    expect(screen.getByText('React hooks')).toBeInTheDocument()
    expect(screen.queryByText('React router')).not.toBeInTheDocument()
    expect(screen.queryByText('Css hooks')).not.toBeInTheDocument()
  })

  it('renders the empty state when the query matches nothing', () => {
    currentQuery = 'kubernetes'

    render(<Cards articles={articles} />)

    expect(screen.getByTestId('cards__empty')).toBeInTheDocument()
  })

  it('hides the pagination when a single page holds every article', () => {
    render(<Cards articles={articles.slice(0, 3)} />)

    expect(
      screen.queryByRole('button', { name: 'nextPage' }),
    ).not.toBeInTheDocument()
  })
})
