import { getPinnedArticles } from '@/utils/getArticles'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { getLocale, getTranslations } from 'next-intl/server'

import NotFound from '../not-found'

jest.mock('@/utils/getArticles', () => ({
  getPinnedArticles: jest.fn(),
}))

jest.mock('@/components/Cards', () => {
  return function MockCards({ articles }: { articles: IArticle[] }) {
    return <div data-testid='cards'>Cards with {articles.length} articles</div>
  }
})

describe('<NotFound />', () => {
  const mockTranslations = {
    title: 'Page Not Found',
    description:
      'The page you are looking for does not exist. Check out our {blog} or {projects}.',
    articles: 'Here are some recommended articles:',
  }

  const mockPinnedArticles = [
    { id: 1, title: 'Article 1' },
    { id: 2, title: 'Article 2' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    const mockT = jest.fn(
      (key: string) => mockTranslations[key as keyof typeof mockTranslations],
    ) as jest.Mock & { rich?: jest.Mock }
    mockT.rich = jest.fn(
      (
        key: string,
        options: {
          blog: (chunk: string) => React.ReactNode
          projects: (chunk: string) => React.ReactNode
        },
      ) => {
        if (key === 'description') {
          return (
            <>
              The page you are looking for does not exist. Check out our{' '}
              {options.blog('blog')} or {options.projects('projects')}.
            </>
          )
        }
        return mockTranslations[key as keyof typeof mockTranslations]
      },
    )
    ;(getTranslations as jest.Mock).mockResolvedValue(mockT)
    ;(getLocale as jest.Mock).mockResolvedValue('en')
    ;(getPinnedArticles as jest.Mock).mockReturnValue(mockPinnedArticles)
  })

  it('should render the component with title', async () => {
    const component = await NotFound()
    render(component)

    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('should render the description with links', async () => {
    const component = await NotFound()
    render(component)

    expect(
      screen.getByText(/The page you are looking for does not exist/),
    ).toBeInTheDocument()
  })

  it('should render blog and lab links', async () => {
    const component = await NotFound()
    render(component)

    const blogLink = screen.getByRole('link', { name: /blog/i })
    const labLink = screen.getByRole('link', { name: /projects/i })

    expect(blogLink).toHaveAttribute('href', '/blog')
    expect(labLink).toHaveAttribute('href', '/lab')
  })

  it('should render articles section', async () => {
    const component = await NotFound()
    render(component)

    expect(
      screen.getByText('Here are some recommended articles:'),
    ).toBeInTheDocument()
  })

  it('should render Cards component with pinned articles', async () => {
    const component = await NotFound()
    render(component)

    const cards = screen.getByTestId('cards')
    expect(cards).toBeInTheDocument()
    expect(cards).toHaveTextContent('Cards with 2 articles')
  })

  it('should call getPinnedArticles with correct locale', async () => {
    await NotFound()

    expect(getPinnedArticles).toHaveBeenCalledWith('en')
  })

  it('should call getTranslations with correct namespace', async () => {
    await NotFound()

    expect(getTranslations).toHaveBeenCalledWith('NotFound')
  })

  it('should call getLocale to get current locale', async () => {
    await NotFound()

    expect(getLocale).toHaveBeenCalled()
  })

  it('should render with correct CSS classes', async () => {
    const component = await NotFound()
    render(component)

    const container = screen.getByText('Page Not Found').closest('div')
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'text-primary',
      'lg:items-start',
    )
  })

  it('should render title with correct CSS class', async () => {
    const component = await NotFound()
    render(component)

    const title = screen.getByText('Page Not Found')
    expect(title).toHaveClass('text-title-giant')
  })

  it('should render description with correct CSS class', async () => {
    const component = await NotFound()
    render(component)

    const description = screen.getByText(
      /The page you are looking for does not exist/,
    )
    expect(description).toHaveClass('text-medium')
  })

  it('should render articles text with correct CSS classes', async () => {
    const component = await NotFound()
    render(component)

    const articlesText = screen.getByText('Here are some recommended articles:')
    expect(articlesText).toHaveClass('text-large', 'mt-medium', 'mb-medium')
  })
})
