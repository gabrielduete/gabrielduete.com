import { render, screen } from '@testing-library/react'

import NavigatorDesktop from '.'

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

describe('NavigatorDesktop', () => {
  beforeEach(() => {
    mockLocale = 'en'
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

  it('uses the english labels and the english resume for the en locale', () => {
    render(<NavigatorDesktop />)

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      'https://gabrielduete.github.io/resume/en/resume.html',
    )
  })

  it('uses the portuguese labels and the portuguese resume for the pt-br locale', () => {
    mockLocale = 'pt-br'
    mockUsePathname.mockReturnValue('/pt-br')

    render(<NavigatorDesktop />)

    expect(screen.getByText('Olá')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Currículo' })).toHaveAttribute(
      'href',
      'https://gabrielduete.github.io/resume/br/resume.html',
    )
  })

  it('highlights the active internal link', () => {
    mockUsePathname.mockReturnValue('/en/blog')

    render(<NavigatorDesktop />)

    expect(screen.getByText('Blog')).toHaveClass('text-secondary')
    expect(screen.getByText('Lab')).toHaveClass('text-white')
  })

  it('opens external links in a new tab only', () => {
    render(<NavigatorDesktop />)

    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(screen.getByRole('link', { name: 'Blog' })).not.toHaveAttribute(
      'target',
    )
  })
})
