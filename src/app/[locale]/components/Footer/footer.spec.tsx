import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Footer from '.'
import Icons from './components/Icons'

describe('<Footer />', () => {
  it('should render the footer component', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('should render with correct CSS classes', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass(
      'w-full',
      'h-[60px]',
      'fixed',
      'border-1',
      'border-green-weak-border',
      'bg-bg-primary',
      'bottom-0',
      'left-0',
      'flex',
      'justify-center',
    )
  })

  it('should render the Icons component', () => {
    render(<Footer />)

    const iconsContainer = screen.getByRole('link', { name: /github/i })
    expect(iconsContainer).toBeInTheDocument()
  })

  it('should have correct positioning classes', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('fixed', 'bottom-0', 'left-0')
  })

  it('should have correct sizing classes', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('w-full', 'h-[60px]')
  })

  it('should have correct layout classes', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('flex', 'justify-center')
  })

  it('should have correct border and background classes', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass(
      'border-1',
      'border-green-weak-border',
      'bg-bg-primary',
    )
  })

  it('should render as a footer element', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer.tagName).toBe('FOOTER')
  })

  it('should contain the Icons component as a child', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    const iconsContainer = screen.getByRole('link', { name: /github/i })

    expect(footer).toContainElement(iconsContainer)
  })

  it('should have proper accessibility role', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})

describe('<Icons />', () => {
  it('should render the Icons component', () => {
    render(<Icons />)

    const iconsContainer = screen.getByRole('link', { name: /github/i })
    expect(iconsContainer).toBeInTheDocument()
  })

  it('should render with correct CSS classes', () => {
    render(<Icons />)

    const iconsContainer = screen.getByRole('link', {
      name: /github/i,
    }).parentElement
    expect(iconsContainer).toHaveClass('flex', 'gap-small', 'items-center')
  })

  it('should render all social media links', () => {
    render(<Icons />)

    const githubLink = screen.getByRole('link', { name: /github/i })
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i })
    const stackOverflowLink = screen.getByRole('link', {
      name: /stackoverflow/i,
    })
    const devLink = screen.getByRole('link', { name: /dev/i })
    const emailLink = screen.getByRole('link', { name: /email/i })

    expect(githubLink).toBeInTheDocument()
    expect(linkedinLink).toBeInTheDocument()
    expect(stackOverflowLink).toBeInTheDocument()
    expect(devLink).toBeInTheDocument()
    expect(emailLink).toBeInTheDocument()
  })

  it('should have correct link attributes', () => {
    render(<Icons />)

    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('href')
  })

  it('should render icons with correct attributes', () => {
    render(<Icons />)

    const githubIcon = screen
      .getByRole('link', { name: /github/i })
      .querySelector('svg')
    expect(githubIcon).toBeInTheDocument()
    expect(githubIcon).toHaveAttribute('aria-label')
    expect(githubIcon).toHaveAttribute('width', '26')
    expect(githubIcon).toHaveAttribute('height', '26')
  })

  it('should have correct icon styling classes', () => {
    render(<Icons />)

    const githubIcon = screen
      .getByRole('link', { name: /github/i })
      .querySelector('svg')
    expect(githubIcon).toHaveClass(
      'text-white',
      'hover:text-secondary',
      'cursor-pointer',
      'transition-colors',
      'duration-200',
    )
  })

  it('should render icons with correct size', () => {
    render(<Icons />)

    const githubIcon = screen
      .getByRole('link', { name: /github/i })
      .querySelector('svg')
    expect(githubIcon).toHaveAttribute('width', '26')
    expect(githubIcon).toHaveAttribute('height', '26')
  })

  it('should have proper accessibility attributes', () => {
    render(<Icons />)

    const githubLink = screen.getByRole('link', { name: /github/i })
    const githubIcon = githubLink.querySelector('svg')

    expect(githubIcon).toHaveAttribute('aria-label')
    expect(githubIcon).toHaveAttribute('width', '26')
    expect(githubIcon).toHaveAttribute('height', '26')
  })

  it('should render multiple social media icons', () => {
    render(<Icons />)

    const allLinks = screen.getAllByRole('link')
    expect(allLinks.length).toBeGreaterThan(1)
  })

  it('should have external links that open in new tab', () => {
    render(<Icons />)

    const allLinks = screen.getAllByRole('link')
    allLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
    })
  })
})
