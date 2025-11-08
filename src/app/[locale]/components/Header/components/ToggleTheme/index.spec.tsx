import { fireEvent, render, screen } from '@testing-library/react'

import ToggleTheme from '.'

const mockUseRouter = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
}))

describe('ToggleTheme', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    })

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('renders the theme toggle component', () => {
    render(<ToggleTheme />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(<ToggleTheme />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label')
  })

  it('has correct styling', () => {
    render(<ToggleTheme />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('cursor-pointer')
  })

  it('handles click events', () => {
    render(<ToggleTheme />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toBeInTheDocument()
  })
})
