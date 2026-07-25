import { fireEvent, render, screen } from '@testing-library/react'

import NavigatorMobile from '.'

const mockUsePathname = jest.fn()
const mockUseRouter = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}))

let mockLocale = 'en'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => mockLocale,
}))

describe('NavigatorMobile', () => {
  beforeEach(() => {
    mockLocale = 'en'
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

  it('closes the menu when a link is clicked', () => {
    const closeMenu = jest.fn()

    render(<NavigatorMobile closeMenu={closeMenu} />)
    fireEvent.click(screen.getByRole('link', { name: 'Blog' }))

    expect(closeMenu).toHaveBeenCalled()
  })

  it('uses the english labels and the english resume for the en locale', () => {
    render(<NavigatorMobile closeMenu={() => {}} />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      'https://gabrielduete.github.io/resume/en/resume.html',
    )
  })

  it('uses the portuguese labels and the portuguese resume for the pt-br locale', () => {
    mockLocale = 'pt-br'
    mockUsePathname.mockReturnValue('/pt-br')

    render(<NavigatorMobile closeMenu={() => {}} />)

    expect(screen.getByText('Olá')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Currículo' })).toHaveAttribute(
      'href',
      'https://gabrielduete.github.io/resume/br/resume.html',
    )
  })

  it('highlights the active internal link', () => {
    mockUsePathname.mockReturnValue('/en/lab')

    render(<NavigatorMobile closeMenu={() => {}} />)

    expect(screen.getByText('Lab')).toHaveClass('text-secondary')
    expect(screen.getByText('Blog')).toHaveClass('text-white')
  })
})
