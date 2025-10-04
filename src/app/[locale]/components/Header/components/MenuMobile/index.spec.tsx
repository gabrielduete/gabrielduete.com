import { fireEvent, render, screen } from '@testing-library/react'

import MenuMobile from '.'

jest.mock('../Navigator/Mobile', () => {
  return function MockNavigatorMobile() {
    return <div data-testid='navigator-mobile'>Navigator Mobile</div>
  }
})

jest.mock('../ToggleLang', () => {
  return function MockToggleLang() {
    return <div data-testid='toggle-lang'>Toggle Lang</div>
  }
})

jest.mock('../ToggleTheme', () => {
  return function MockToggleTheme() {
    return <div data-testid='toggle-theme'>Toggle Theme</div>
  }
})

describe('MenuMobile', () => {
  it('renders the mobile menu component', () => {
    render(<MenuMobile />)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders hamburger and close buttons', () => {
    render(<MenuMobile />)

    const hamburgerButton = screen.getByLabelText('Open Menu')
    const closeButton = screen.getByLabelText('Close Menu')

    expect(hamburgerButton).toBeInTheDocument()
    expect(closeButton).toHaveClass('hidden')
  })

  it('toggles menu visibility when hamburger is clicked', () => {
    render(<MenuMobile />)

    const hamburgerButton = screen.getByLabelText('Open Menu')
    fireEvent.click(hamburgerButton)

    const closeButton = screen.getByLabelText('Close Menu')
    expect(closeButton).toBeInTheDocument()
  })

  it('renders all child components', () => {
    render(<MenuMobile />)

    const navigatorMobile = screen.getByTestId('navigator-mobile')
    const toggleLang = screen.getByTestId('toggle-lang')
    const toggleTheme = screen.getByTestId('toggle-theme')

    expect(navigatorMobile).toBeInTheDocument()
    expect(toggleLang).toBeInTheDocument()
    expect(toggleTheme).toBeInTheDocument()
  })

  it('has correct mobile styling', () => {
    render(<MenuMobile />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('lg:hidden', 'flex')
  })
})
