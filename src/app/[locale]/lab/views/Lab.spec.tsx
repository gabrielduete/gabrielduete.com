import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { CONTRIBUTIONS, FILTERS } from '../index.data'
import LabView from './Lab'

const setFiltersMock = jest.fn()
let currentLocale = 'en'
let currentFilter = 'All'

jest.mock('next-intl', () => ({
  useLocale: () => currentLocale,
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: () => ({
    setFilters: setFiltersMock,
    selectedFilter: currentFilter,
  }),
}))

jest.mock('@/components/Filter', () => ({
  __esModule: true,
  default: () => <div data-testid='component-filter' />,
}))

describe('<LabView />', () => {
  beforeEach(() => {
    setFiltersMock.mockClear()
    currentLocale = 'en'
    currentFilter = 'All'
  })

  it('registers the lab filters on mount', () => {
    render(<LabView />)

    expect(setFiltersMock).toHaveBeenCalledWith(FILTERS)
  })

  it('renders every contribution in english', () => {
    render(<LabView />)

    CONTRIBUTIONS.forEach(({ title, description }) => {
      expect(screen.getByText(title.en)).toBeInTheDocument()
      expect(screen.getByText(description.en)).toBeInTheDocument()
    })
  })

  it('renders every contribution in portuguese', () => {
    currentLocale = 'pt-br'
    currentFilter = 'Todos'

    render(<LabView />)

    CONTRIBUTIONS.forEach(({ title, description }) => {
      expect(screen.getByText(title.pt)).toBeInTheDocument()
      expect(screen.getByText(description.pt)).toBeInTheDocument()
    })
  })

  it('keeps only the contributions of the selected category', () => {
    currentFilter = 'Open Source'

    render(<LabView />)

    const expected = CONTRIBUTIONS.filter(({ category }) =>
      category.en.includes('Open Source'),
    )

    expect(screen.getAllByRole('article').length).toBe(expected.length)
  })

  it('shows the empty state when no contribution matches', () => {
    currentFilter = 'Nothing'

    render(<LabView />)

    expect(screen.getByTestId('lab__empty')).toBeInTheDocument()
  })

  it('tracks the pointer position for the spotlight effect', () => {
    const { container } = render(<LabView />)

    const card = container.querySelector('article') as HTMLElement
    fireEvent.mouseMove(card, { clientX: 18, clientY: 6 })

    expect(card.style.getPropertyValue('--mouse-x')).toBe('18px')
    expect(card.style.getPropertyValue('--mouse-y')).toBe('6px')
  })
})
