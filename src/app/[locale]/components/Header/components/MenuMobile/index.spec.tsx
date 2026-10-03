import { render, screen, within } from '@testing-library/react'

import MenuMobile from '.'

let mockLocale = 'en'

jest.mock('next-intl', () => ({
  useLocale: () => mockLocale,
}))

jest.mock('../Navigator/Mobile', () => {
  return function MockNavigatorMobile() {
    return <div data-testid='navigator-mobile' />
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
  beforeEach(() => {
    mockLocale = 'en'
  })

  it('renders the navigation as a bar fixed to the bottom', () => {
    render(<MenuMobile />)

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })

    expect(nav).toHaveClass('fixed', 'bottom-0')
    expect(within(nav).getByTestId('navigator-mobile')).toBeInTheDocument()
  })

  it('keeps the language and theme toggles at the top, outside the bar', () => {
    render(<MenuMobile />)

    const nav = screen.getByRole('navigation')

    expect(screen.getByTestId('toggle-lang')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-theme')).toBeInTheDocument()
    expect(within(nav).queryByTestId('toggle-lang')).not.toBeInTheDocument()
    expect(within(nav).queryByTestId('toggle-theme')).not.toBeInTheDocument()
  })

  it('only shows on small screens', () => {
    const { container } = render(<MenuMobile />)

    expect(container.firstChild).toHaveClass('lg:hidden')
  })

  it('labels the navigation in portuguese for the pt-br locale', () => {
    mockLocale = 'pt-br'
    render(<MenuMobile />)

    expect(
      screen.getByRole('navigation', { name: 'Navegação principal' }),
    ).toBeInTheDocument()
  })
})
