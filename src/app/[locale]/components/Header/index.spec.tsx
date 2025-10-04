import { render, screen } from '@testing-library/react'

import Header from './index'

jest.mock('./components/MenuDesktop', () => {
  return function MockMenuDesktop() {
    return <div data-testid='menu-desktop'>Menu Desktop</div>
  }
})

jest.mock('./components/MenuMobile', () => {
  return function MockMenuMobile() {
    return <div data-testid='menu-mobile'>Menu Mobile</div>
  }
})

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header />)

    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('renders desktop menu', () => {
    render(<Header />)

    const menuDesktop = screen.getByTestId('menu-desktop')
    expect(menuDesktop).toBeInTheDocument()
  })

  it('renders mobile menu', () => {
    render(<Header />)

    const menuMobile = screen.getByTestId('menu-mobile')
    expect(menuMobile).toBeInTheDocument()
  })
})
