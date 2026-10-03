import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import SearchInput from '.'

const setQueryMock = jest.fn()
let currentQuery = ''

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: () => ({ query: currentQuery, setQuery: setQueryMock }),
}))

describe('<SearchInput />', () => {
  beforeEach(() => {
    setQueryMock.mockClear()
    currentQuery = ''
  })

  it('renders the input with its accessible label', () => {
    render(<SearchInput />)

    expect(screen.getByLabelText('searchLabel')).toBeInTheDocument()
  })

  it('reflects the current query', () => {
    currentQuery = 'gitflow'

    render(<SearchInput />)

    expect(screen.getByLabelText('searchLabel')).toHaveValue('gitflow')
  })

  it('calls setQuery while the user types', () => {
    render(<SearchInput />)

    fireEvent.change(screen.getByLabelText('searchLabel'), {
      target: { value: 'react' },
    })

    expect(setQueryMock).toHaveBeenCalledWith('react')
  })

  it('hides the clear button when the query is empty', () => {
    render(<SearchInput />)

    expect(
      screen.queryByRole('button', { name: 'clearSearch' }),
    ).not.toBeInTheDocument()
  })

  it('clears the query when the clear button is clicked', () => {
    currentQuery = 'react'

    render(<SearchInput />)
    fireEvent.click(screen.getByRole('button', { name: 'clearSearch' }))

    expect(setQueryMock).toHaveBeenCalledWith('')
  })
})
