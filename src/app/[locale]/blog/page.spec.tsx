import { FilterProvider } from '@/contexts/FilterContext'
import { fireEvent, render, screen } from '@testing-library/react'

import { FILTERS } from '../../../components/Cards/index.data'
import Blog from './page'

describe('<Blog />', () => {
  it('should paginate articles and render the correct number of articles per page', () => {
    render(
      <FilterProvider>
        <Blog />
      </FilterProvider>,
    )

    const articlesPerPage = 4

    const paginationButton = screen.getByText('1')

    fireEvent.click(paginationButton)

    const secondPageArticles = FILTERS.en
      .filter(article => article.category === 'All')
      .slice(articlesPerPage)

    secondPageArticles.forEach(article => {
      expect(screen.getByText(article.title)).toBeInTheDocument()
    })
  })

  it('should render filtered articles based on the selected filter', () => {
    render(
      <FilterProvider>
        <Blog />
      </FilterProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Engineering' }))

    const filteredArticles = FILTERS.en.filter(
      article => article.category === 'Engineering',
    )

    filteredArticles.forEach(article => {
      expect(screen.getByText(article.title)).toBeInTheDocument()
    })
  })
})
