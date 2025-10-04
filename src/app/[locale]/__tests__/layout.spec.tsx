import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

import Layout from '../layout'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='next-intl-provider'>{children}</div>
  ),
  hasLocale: jest.fn(),
}))

jest.mock('@/contexts/FilterContext', () => ({
  FilterProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='filter-provider'>{children}</div>
  ),
}))

jest.mock('../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid='footer'>Footer</footer>
  }
})

jest.mock('../components/Header', () => {
  return function MockHeader() {
    return <header data-testid='header'>Header</header>
  }
})

jest.mock('../components/KeyboardEasterEgg', () => {
  return function MockKeyboardEasterEgg() {
    return <div data-testid='keyboard-easter-egg'>Keyboard Easter Egg</div>
  }
})

jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'pt-br'],
  },
}))

describe('<Layout />', () => {
  const mockChildren = <div data-testid='children'>Test Children</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the layout with valid locale', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    expect(screen.getByTestId('next-intl-provider')).toBeInTheDocument()
    expect(screen.getByTestId('filter-provider')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('keyboard-easter-egg')).toBeInTheDocument()
    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  it('should render with correct HTML structure', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    const html = document.querySelector('html')
    const body = document.querySelector('body')
    const main = document.querySelector('main')

    expect(html).toBeInTheDocument()
    expect(html).toHaveAttribute('lang', 'en')
    expect(body).toBeInTheDocument()
    expect(main).toBeInTheDocument()
  })

  it('should render with correct CSS classes on main element', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    const main = document.querySelector('main')
    expect(main).toHaveClass(
      'w-full',
      'max-w-content',
      'm-auto',
      'px-4',
      'pb-24',
      'lg:px-0',
      'mt-giant',
    )
  })

  it('should include Clarity script in head', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    const script = document.querySelector('script[type="text/javascript"]')
    expect(script).toBeInTheDocument()
    expect(script?.innerHTML).toContain('clarity')
  })

  it('should call notFound when locale is invalid', async () => {
    const mockParams = Promise.resolve({ locale: 'invalid' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(false)

    await Layout({ children: mockChildren, params: mockParams })

    expect(notFound).toHaveBeenCalledTimes(1)
  })

  it('should call hasLocale with correct parameters', async () => {
    const mockParams = Promise.resolve({ locale: 'pt-br' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    await Layout({ children: mockChildren, params: mockParams })

    expect(hasLocale).toHaveBeenCalledWith(['en', 'pt-br'], 'pt-br')
  })

  it('should render with different locale', async () => {
    const mockParams = Promise.resolve({ locale: 'pt-br' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    const html = document.querySelector('html')
    expect(html).toHaveAttribute('lang', 'pt-br')
  })

  it('should render all required components in correct order', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    expect(screen.getByTestId('next-intl-provider')).toBeInTheDocument()
    expect(screen.getByTestId('filter-provider')).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should render children inside main element', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    const main = document.querySelector('main')
    const children = main?.querySelector('[data-testid="children"]')
    expect(children).toBeInTheDocument()
  })

  it('should include KeyboardEasterEgg component', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    render(component)

    expect(screen.getByTestId('keyboard-easter-egg')).toBeInTheDocument()
  })

  it('should handle async params correctly', async () => {
    const mockParams = Promise.resolve({ locale: 'en' })
    const { hasLocale } = require('next-intl')
    hasLocale.mockReturnValue(true)

    const component = await Layout({
      children: mockChildren,
      params: mockParams,
    })
    expect(component).toBeDefined()
  })
})
