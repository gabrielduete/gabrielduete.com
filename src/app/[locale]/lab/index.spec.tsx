import { FilterProvider } from '@/contexts/FilterContext'
import { render, screen, waitFor } from '@testing-library/react'

import { CONTRIBUTIONS, FILTERS } from './index.data'
import Lab from './page'

describe('<Lab />', () => {
  it('should render the Filter component', () => {
    render(
      <FilterProvider>
        <Lab />
      </FilterProvider>,
    )

    expect(screen.getByTestId('component-filter')).toBeInTheDocument()
  })

  it('should render filtered labs based on the selected filter', () => {
    render(
      <FilterProvider>
        <Lab />
      </FilterProvider>,
    )

    const filteredlabs = CONTRIBUTIONS.filter(
      article => article.category.en === 'Open Source',
    )

    filteredlabs.forEach(article => {
      expect(screen.getByText(article.title.en)).toBeInTheDocument()
    })
  })

  it('should call setFilters on mount', async () => {
    const setFiltersMock = jest.fn()

    jest.mock('@/contexts/FilterContext', () => ({
      useFilter: jest.fn(() => ({
        setFilters: setFiltersMock,
        selectedFilter: 'Open Source',
      })),
    }))

    render(
      <FilterProvider>
        <Lab />
      </FilterProvider>,
    )

    waitFor(() => {
      expect(setFiltersMock).toHaveBeenCalledWith(FILTERS)
    })
  })

  it('should render labs with correct title and description based on locale', () => {
    render(
      <FilterProvider>
        <Lab />
      </FilterProvider>,
    )

    CONTRIBUTIONS.forEach(article => {
      const titleText = article.title.en
      const descriptionText = article.description.en

      expect(screen.getByText(titleText)).toBeInTheDocument()
      expect(screen.getByText(descriptionText)).toBeInTheDocument()
    })
  })
})
