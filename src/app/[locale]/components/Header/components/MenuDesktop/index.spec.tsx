import { render, screen } from '@testing-library/react'

import MenuDesktop from '.'

jest.mock('../Navigator/Desktop', () => {
  return function MockNavigatorDesktop() {
    return <div data-testid='navigator-desktop'>Navigator Desktop</div>
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

describe('MenuDesktop', () => {
  it('renders the desktop menu component', () => {
    render(<MenuDesktop />)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('renders all child components', () => {
    render(<MenuDesktop />)

    const navigatorDesktop = screen.getByTestId('navigator-desktop')
    const toggleLang = screen.getByTestId('toggle-lang')
    const toggleTheme = screen.getByTestId('toggle-theme')

    expect(navigatorDesktop).toBeInTheDocument()
    expect(toggleLang).toBeInTheDocument()
    expect(toggleTheme).toBeInTheDocument()
  })

  it('has correct styling for desktop', () => {
    render(<MenuDesktop />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('hidden', 'lg:block')
  })
})
