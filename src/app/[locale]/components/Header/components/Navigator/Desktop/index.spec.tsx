import { render, screen } from '@testing-library/react'

import NavigatorDesktop from '.'

const mockUsePathname = jest.fn()
const mockUseRouter = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

describe('NavigatorDesktop', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/en')
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    })
  })

  it('renders the desktop navigator component', () => {
    render(<NavigatorDesktop />)

    const navigator = screen.getByRole('list')
    expect(navigator).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<NavigatorDesktop />)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)

    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('has correct styling', () => {
    render(<NavigatorDesktop />)

    const navigator = screen.getByRole('list')
    expect(navigator).toHaveClass('bg-bg-primary', 'flex', 'items-center')
  })
})
