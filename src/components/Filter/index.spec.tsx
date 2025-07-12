import { useFilter } from '@/contexts/FilterContext'
import { fireEvent, render, screen } from '@testing-library/react'
import { useLocale } from 'next-intl'

import Filter from './index'

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}))

describe('<Filter />', () => {
  const mockFilters = {
    en: ['All', 'Tech', 'Health'],
    pt: ['Todos', 'Tecnologia', 'Saúde'],
  }

  const mockSetSelectedFilter = jest.fn()

  beforeEach(() => {
    ;(useFilter as jest.Mock).mockReturnValue({
      filters: mockFilters,
      selectedFilter: 'All',
      setSelectedFilter: mockSetSelectedFilter,
    })
    ;(useLocale as jest.Mock).mockReturnValue('en')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component', () => {
    render(<Filter />)

    expect(screen.getByTestId('component-filter')).toBeInTheDocument()
  })

  it('should render the correct filters based on locale', () => {
    render(<Filter />)

    mockFilters.en.forEach(filter => {
      expect(screen.getByText(filter)).toBeInTheDocument()
    })
  })

  it('should apply the correct class to the selected filter', () => {
    ;(useFilter as jest.Mock).mockReturnValue({
      filters: mockFilters,
      selectedFilter: 'Tech',
      setSelectedFilter: mockSetSelectedFilter,
    })

    render(<Filter />)

    const selectedButton = screen.getByText('Tech')
    expect(selectedButton).toHaveClass('text-secondary')
  })

  it('should call setSelectedFilter when a filter is clicked', () => {
    render(<Filter />)

    const button = screen.getByText('Tech')
    fireEvent.click(button)

    expect(mockSetSelectedFilter).toHaveBeenCalledWith('Tech')
  })

  it('should render localized filters when locale changes', () => {
    ;(useLocale as jest.Mock).mockReturnValue('pt')

    render(<Filter />)

    mockFilters.pt.forEach(filter => {
      expect(screen.getByText(filter)).toBeInTheDocument()
    })
  })
})
