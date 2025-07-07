import { fireEvent, render, screen } from '@testing-library/react'

import Cards from '.'

describe('<Cards />', () => {
  const mockArticles = [
    {
      title: 'Article 1',
      category: 'Tech',
      date: '2023-01-01',
    },
    {
      title: 'Article 2',
      category: 'Health',
      date: '2023-02-01',
    },
    {
      title: 'Article 3',
      category: 'Tech',
      date: '2023-03-01',
    },
    {
      title: 'Article 4',
      category: 'Tech',
      date: '2023-04-01',
    },
    {
      title: 'Article 5',
      category: 'Health',
      date: '2023-05-01',
    },
    {
      title: 'Article 6',
      category: 'Health',
      date: '2023-05-01',
    },
  ]

  const mockAllTechArticles = [
    {
      title: 'Article 1',
      category: 'Tech',
      date: '2023-01-01',
    },
    {
      title: 'Article 2',
      category: 'Tech',
      date: '2023-02-01',
    },
    {
      title: 'Article 3',
      category: 'Tech',
      date: '2023-03-01',
    },
    {
      title: 'Article 4',
      category: 'Tech',
      date: '2023-04-01',
    },
    {
      title: 'Article 5',
      category: 'Tech',
      date: '2023-05-01',
    },
    {
      title: 'Article 6',
      category: 'Tech',
      date: '2023-05-01',
    },
  ]

  jest.mock('@/hooks/useFilter', () => ({
    useFilter: () => ({
      selectedFilter: 'Tech',
    }),
  }))

  it('should paginate articles and render the correct number of articles per page', () => {
    render(<Cards articles={mockAllTechArticles} />)

    const articlesPerPage = 4

    const paginationButton = screen.getByText('1')

    fireEvent.click(paginationButton)

    const secondPageArticles = mockArticles
      .filter(article => article.category === 'Tech')
      .slice(articlesPerPage)

    secondPageArticles.forEach(article => {
      expect(screen.getByText(article.title)).toBeInTheDocument()
    })
  })

  it('should render filtered articles based on the selected filter', () => {
    render(<Cards articles={mockArticles} />)

    const filteredArticles = mockArticles.filter(
      article => article.category === 'Tech',
    )

    filteredArticles.forEach(article => {
      expect(screen.getByText(article.title)).toBeInTheDocument()
    })

    const nonFilteredArticles = mockArticles.filter(
      article => article.category !== 'Tech',
    )

    nonFilteredArticles.forEach(article => {
      expect(screen.queryByText(article.title)).not.toBeInTheDocument()
    })
  })

  it('should render articles in descending order by date', () => {
    render(<Cards articles={mockArticles} />)

    const renderedArticles = screen
      .getAllByRole('heading')
      .map(article => article.textContent)

    const sortedArticles = mockArticles
      .filter(article => article.category === 'Tech')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(article => article.title)

    expect(renderedArticles).toEqual(sortedArticles)
  })

  it('should not render the pagination component if there is only one page', () => {
    const singlePageArticles = mockArticles.slice(0, 2)

    render(<Cards articles={singlePageArticles} />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
