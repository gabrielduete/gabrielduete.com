import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Footer from '.'

jest.mock('./components/Icons', () => {
  return function MockIcons() {
    return <div data-testid='footer-icons'>Footer Icons</div>
  }
})

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

    expect(screen.getByTestId('footer-icons')).toBeInTheDocument()
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
    const icons = screen.getByTestId('footer-icons')

    expect(footer).toContainElement(icons)
  })

  it('should have proper accessibility role', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })
})
