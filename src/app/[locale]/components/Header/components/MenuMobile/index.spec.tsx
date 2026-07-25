import { fireEvent, render, screen } from '@testing-library/react'

import MenuMobile from '.'

jest.mock('../Navigator/Mobile', () => {
  return function MockNavigatorMobile({ closeMenu }: { closeMenu: () => void }) {
    return (
      <div data-testid='navigator-mobile'>
        <button onClick={closeMenu}>close from navigator</button>
      </div>
    )
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

  it('closes the menu when the close icon is clicked', () => {
    render(<MenuMobile />)

    fireEvent.click(screen.getByLabelText('Open Menu'))
    expect(screen.getByLabelText('Open Menu')).toHaveClass('hidden')

    fireEvent.click(screen.getByLabelText('Close Menu'))

    expect(screen.getByLabelText('Close Menu')).toHaveClass('hidden')
    expect(screen.getByLabelText('Open Menu')).toHaveClass('block')
  })

  it('closes the menu when the navigator asks for it', () => {
    render(<MenuMobile />)

    fireEvent.click(screen.getByLabelText('Open Menu'))
    fireEvent.click(screen.getByText('close from navigator'))

    expect(screen.getByLabelText('Close Menu')).toHaveClass('hidden')
  })
})
