import { render, screen } from '@testing-library/react'

import NavigatorMobile from '.'

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

describe('NavigatorMobile', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/en')
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    })
  })

  it('renders the mobile navigator component', () => {
    render(<NavigatorMobile closeMenu={() => {}} />)

    const navigator = screen.getByRole('list')
    expect(navigator).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<NavigatorMobile closeMenu={() => {}} />)

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)

    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })
})
