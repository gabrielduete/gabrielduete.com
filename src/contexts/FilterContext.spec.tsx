import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { FilterProvider, useFilter } from './FilterContext'

const pushMock = jest.fn()
let currentParams = new URLSearchParams()
let currentLocale = 'en'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => currentParams,
}))

jest.mock('next-intl', () => ({
  useLocale: () => currentLocale,
}))

const Consumer = () => {
  const { selectedFilter, setSelectedFilter, filters, setFilters } = useFilter()

  return (
    <div>
      <span data-testid='selected'>{selectedFilter}</span>
      <span data-testid='filters'>{JSON.stringify(filters ?? null)}</span>
      <button onClick={() => setSelectedFilter('Utils')}>select</button>
      <button onClick={() => setFilters('Todos')}>store</button>
    </div>
  )
}

describe('FilterContext', () => {
  beforeEach(() => {
    pushMock.mockClear()
    currentParams = new URLSearchParams()
    currentLocale = 'en'
  })

  it('defaults to "All" for the en locale', () => {
    render(
      <FilterProvider>
        <Consumer />
      </FilterProvider>,
    )

    expect(screen.getByTestId('selected')).toHaveTextContent('All')
  })

  it('defaults to "Todos" for the pt-br locale', () => {
    currentLocale = 'pt-br'

    render(
      <FilterProvider>
        <Consumer />
      </FilterProvider>,
    )

    expect(screen.getByTestId('selected')).toHaveTextContent('Todos')
  })

  it('reads the selected filter from the url', () => {
    currentParams = new URLSearchParams('filter=Open Source')

    render(
      <FilterProvider>
        <Consumer />
      </FilterProvider>,
    )

    expect(screen.getByTestId('selected')).toHaveTextContent('Open Source')
  })

  it('pushes the new filter and drops the page param', () => {
    currentParams = new URLSearchParams('page=3')

    render(
      <FilterProvider>
        <Consumer />
      </FilterProvider>,
    )
    fireEvent.click(screen.getByText('select'))

    expect(pushMock).toHaveBeenCalledWith('?filter=Utils')
  })

  it('exposes the stored filters', () => {
    render(
      <FilterProvider>
        <Consumer />
      </FilterProvider>,
    )

    expect(screen.getByTestId('filters')).toHaveTextContent('null')

    fireEvent.click(screen.getByText('store'))

    expect(screen.getByTestId('filters')).toHaveTextContent('"Todos"')
  })

  it('throws when used outside the provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    expect(() => render(<Consumer />)).toThrow(
      'useFilter must be used within FilterProvider',
    )

    consoleError.mockRestore()
  })
})
