import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

import { FilterProvider, parseTagsParam, useFilter } from './FilterContext'

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
  const {
    selectedFilter,
    setSelectedFilter,
    filters,
    setFilters,
    query,
    setQuery,
    selectedTags,
    toggleTag,
    clearTags,
  } = useFilter()

  return (
    <div>
      <span data-testid='selected'>{selectedFilter}</span>
      <span data-testid='filters'>{JSON.stringify(filters ?? null)}</span>
      <span data-testid='query'>{query}</span>
      <span data-testid='tags'>{selectedTags.join('|')}</span>
      <button onClick={() => setSelectedFilter('Utils')}>select</button>
      <button onClick={() => setFilters('Todos')}>store</button>
      <button onClick={() => setQuery('gitflow')}>search</button>
      <button onClick={() => setQuery('  ')}>search blank</button>
      <button onClick={() => toggleTag('react')}>toggle</button>
      <button onClick={() => clearTags()}>clear tags</button>
    </div>
  )
}

const renderProvider = () =>
  render(
    <FilterProvider>
      <Consumer />
    </FilterProvider>,
  )

describe('parseTagsParam', () => {
  it('should return an empty list for a missing or empty param', () => {
    expect(parseTagsParam(null)).toEqual([])
    expect(parseTagsParam('')).toEqual([])
  })

  it('should split, trim and drop empty entries', () => {
    expect(parseTagsParam('git, react ,,')).toEqual(['git', 'react'])
  })
})

describe('FilterContext', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    pushMock.mockClear()
    currentParams = new URLSearchParams()
    currentLocale = 'en'
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('defaults to "All" for the en locale', () => {
    renderProvider()

    expect(screen.getByTestId('selected')).toHaveTextContent('All')
  })

  it('defaults to "Todos" for the pt-br locale', () => {
    currentLocale = 'pt-br'

    renderProvider()

    expect(screen.getByTestId('selected')).toHaveTextContent('Todos')
  })

  it('reads the selected filter from the url', () => {
    currentParams = new URLSearchParams('filter=Open Source')

    renderProvider()

    expect(screen.getByTestId('selected')).toHaveTextContent('Open Source')
  })

  it('pushes the new filter and drops the page param', () => {
    currentParams = new URLSearchParams('page=3')

    renderProvider()
    fireEvent.click(screen.getByText('select'))

    expect(pushMock).toHaveBeenCalledWith('?filter=Utils', { scroll: false })
  })

  it('exposes the stored filters', () => {
    renderProvider()

    expect(screen.getByTestId('filters')).toHaveTextContent('null')

    fireEvent.click(screen.getByText('store'))

    expect(screen.getByTestId('filters')).toHaveTextContent('"Todos"')
  })

  it('reads the query from the url', () => {
    currentParams = new URLSearchParams('q=gitflow')

    renderProvider()

    expect(screen.getByTestId('query')).toHaveTextContent('gitflow')
  })

  it('updates the query right away and pushes it debounced', () => {
    currentParams = new URLSearchParams('page=2')

    renderProvider()
    fireEvent.click(screen.getByText('search'))

    expect(screen.getByTestId('query')).toHaveTextContent('gitflow')
    expect(pushMock).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(pushMock).toHaveBeenCalledWith('?q=gitflow', { scroll: false })
  })

  it('drops the q param for a blank query', () => {
    currentParams = new URLSearchParams('q=gitflow')

    renderProvider()
    fireEvent.click(screen.getByText('search blank'))

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(pushMock).toHaveBeenCalledWith('?', { scroll: false })
  })

  it('pushes only once for consecutive keystrokes', () => {
    renderProvider()

    fireEvent.click(screen.getByText('search'))
    fireEvent.click(screen.getByText('search'))

    act(() => {
      jest.advanceTimersByTime(250)
    })

    expect(pushMock).toHaveBeenCalledTimes(1)
  })

  it('reads the selected tags from the url', () => {
    currentParams = new URLSearchParams('tags=git,react')

    renderProvider()

    expect(screen.getByTestId('tags')).toHaveTextContent('git|react')
  })

  it('adds a tag to the url keeping the others', () => {
    currentParams = new URLSearchParams('tags=git&page=2')

    renderProvider()
    fireEvent.click(screen.getByText('toggle'))

    expect(pushMock).toHaveBeenCalledWith('?tags=git%2Creact', {
      scroll: false,
    })
  })

  it('removes a tag that is already selected', () => {
    currentParams = new URLSearchParams('tags=react')

    renderProvider()
    fireEvent.click(screen.getByText('toggle'))

    expect(pushMock).toHaveBeenCalledWith('?', { scroll: false })
  })

  it('clears every tag keeping the other params', () => {
    currentParams = new URLSearchParams('filter=Utils&tags=react')

    renderProvider()
    fireEvent.click(screen.getByText('clear tags'))

    expect(pushMock).toHaveBeenCalledWith('?filter=Utils', { scroll: false })
  })

  it('throws when used outside the provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    expect(() => render(<Consumer />)).toThrow(
      'useFilter must be used within FilterProvider',
    )

    consoleError.mockRestore()
  })
})
