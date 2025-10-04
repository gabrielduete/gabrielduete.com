import { FilterProvider } from '@/contexts/FilterContext'
import { render, screen } from '@testing-library/react'

import ToggleLang from '.'

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

jest.mock('../../../../../../i18n/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/en',
  createNavigation: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}))

jest.mock('../../../../../../contexts/FilterContext', () => ({
  FilterProvider: ({ children }: { children: React.ReactNode }) => children,
  useFilter: () => ({
    filters: {},
  }),
}))

describe('ToggleLang', () => {
  it('renders language buttons', () => {
    render(
      <FilterProvider>
        <ToggleLang />
      </FilterProvider>,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    expect(screen.getByText('pt-br')).toBeInTheDocument()
    expect(screen.getByText('en')).toBeInTheDocument()
  })
})
