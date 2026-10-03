import { render, screen } from '@testing-library/react'

import NavigatorMobile from '.'

const mockUsePathname = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

let mockLocale = 'en'

jest.mock('next-intl', () => ({
  useLocale: () => mockLocale,
}))

describe('NavigatorMobile', () => {
  beforeEach(() => {
    mockLocale = 'en'
    mockUsePathname.mockReturnValue('/en')
  })

  it('renders one tab per navigation item, each with a link', () => {
    render(<NavigatorMobile />)

    const links = screen.getAllByRole('link')

    expect(links).toHaveLength(5)
    links.forEach(link => expect(link).toHaveAttribute('href'))
  })

  it('uses the english labels and the english resume for the en locale', () => {
    render(<NavigatorMobile />)

    expect(screen.getByRole('link', { name: 'Hello' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      'https://gabrielduete.github.io/resume/en/resume.html',
    )
  })

  it('uses the portuguese labels and the portuguese resume for the pt-br locale', () => {
    mockLocale = 'pt-br'
    mockUsePathname.mockReturnValue('/pt-br')

    render(<NavigatorMobile />)

    expect(screen.getByRole('link', { name: 'Olá' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Currículo' })).toHaveAttribute(
      'href',
      'https://gabrielduete.github.io/resume/br/resume.html',
    )
  })

  it('marks the active internal link as the current page', () => {
    mockUsePathname.mockReturnValue('/en/lab')

    render(<NavigatorMobile />)

    expect(screen.getByRole('link', { name: 'Lab' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Lab' })).toHaveClass(
      'text-card-accent',
    )
    expect(screen.getByRole('link', { name: 'Blog' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('opens the resume in a new tab', () => {
    render(<NavigatorMobile />)

    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'target',
      '_blank',
    )
  })
})
