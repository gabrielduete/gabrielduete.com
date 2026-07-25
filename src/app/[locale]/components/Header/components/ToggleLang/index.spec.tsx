import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import ToggleLang from '.'

const replaceMock = jest.fn()
let currentParams = new URLSearchParams()
let currentLocale = 'en'
let currentFilters: unknown = {
  'pt-br': ['Todos', 'Open Source', 'Úteis'],
  en: ['All', 'Open Source', 'Utils'],
}

jest.mock('next/navigation', () => ({
  useSearchParams: () => currentParams,
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => currentLocale,
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: replaceMock }),
  usePathname: () => '/lab',
}))

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: () => ({ filters: currentFilters }),
}))

describe('<ToggleLang />', () => {
  beforeEach(() => {
    replaceMock.mockClear()
    currentParams = new URLSearchParams()
    currentLocale = 'en'
    currentFilters = {
      'pt-br': ['Todos', 'Open Source', 'Úteis'],
      en: ['All', 'Open Source', 'Utils'],
    }
  })

  it('renders both language buttons', () => {
    render(<ToggleLang />)

    expect(screen.getByText('pt-br')).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
  })

  it('highlights the active locale', () => {
    render(<ToggleLang />)

    expect(screen.getByText('en')).toHaveClass('text-secondary')
    expect(screen.getByText('pt-br')).not.toHaveClass('text-secondary')
  })

  it('highlights pt-br when it is the active locale', () => {
    currentLocale = 'pt-br'

    render(<ToggleLang />)

    expect(screen.getByText('pt-br')).toHaveClass('text-secondary')
    expect(screen.getByText('en')).not.toHaveClass('text-secondary')
  })

  it('replaces the route with the plain pathname when there are no filters yet', () => {
    currentFilters = undefined

    render(<ToggleLang />)
    fireEvent.click(screen.getByText('pt-br'))

    expect(replaceMock).toHaveBeenCalledWith('/lab', { locale: 'pt-br' })
  })

  it('translates the current filter when switching to pt-br', () => {
    currentParams = new URLSearchParams('filter=Utils')

    render(<ToggleLang />)
    fireEvent.click(screen.getByText('pt-br'))

    expect(replaceMock).toHaveBeenCalledWith('/lab?filter=%C3%9Ateis', {
      locale: 'pt-br',
    })
  })

  it('translates the current filter when switching to en', () => {
    currentLocale = 'pt-br'
    currentParams = new URLSearchParams('filter=Todos')

    render(<ToggleLang />)
    fireEvent.click(screen.getByText('en'))

    expect(replaceMock).toHaveBeenCalledWith('/lab?filter=All', {
      locale: 'en',
    })
  })

  it('keeps the current filter when it is not a known one', () => {
    currentParams = new URLSearchParams('filter=Unknown')

    render(<ToggleLang />)
    fireEvent.click(screen.getByText('pt-br'))

    expect(replaceMock).toHaveBeenCalledWith('/lab?filter=Unknown', {
      locale: 'pt-br',
    })
  })

  it('replaces the route without a filter when the url has none', () => {
    render(<ToggleLang />)
    fireEvent.click(screen.getByText('pt-br'))

    expect(replaceMock).toHaveBeenCalledWith('/lab?', { locale: 'pt-br' })
  })

  it('keeps the other query params untouched', () => {
    currentParams = new URLSearchParams('page=2')

    render(<ToggleLang />)
    fireEvent.click(screen.getByText('pt-br'))

    expect(replaceMock).toHaveBeenCalledWith('/lab?page=2', { locale: 'pt-br' })
  })
})
