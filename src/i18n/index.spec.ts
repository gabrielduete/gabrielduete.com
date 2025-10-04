jest.mock('next-intl/routing', () => ({
  defineRouting: jest.fn(() => ({
    locales: ['en', 'pt-br'],
    defaultLocale: 'en',
  })),
}))

jest.mock('next-intl/navigation', () => ({
  createNavigation: jest.fn(() => ({
    Link: 'mock-link',
    redirect: 'mock-redirect',
    usePathname: 'mock-usePathname',
    useRouter: 'mock-useRouter',
    getPathname: 'mock-getPathname',
  })),
}))

jest.mock('next-intl/server', () => ({
  getRequestConfig: jest.fn(() => 'mock-request-config'),
}))

jest.mock('next-intl', () => ({
  hasLocale: jest.fn(),
}))

jest.mock('../messages/en.json', () => ({ default: { hello: 'Hello' } }))
jest.mock('../messages/pt-br.json', () => ({ default: { hello: 'Olá' } }))

describe('i18n configuration', () => {
  it('should have routing configuration', () => {
    const { routing } = require('./routing')

    expect(routing).toBeDefined()
    expect(routing.locales).toEqual(['en', 'pt-br'])
    expect(routing.defaultLocale).toBe('en')
  })

  it('should export navigation functions', () => {
    const navigation = require('./navigation')

    expect(navigation.Link).toBe('mock-link')
    expect(navigation.redirect).toBe('mock-redirect')
    expect(navigation.usePathname).toBe('mock-usePathname')
    expect(navigation.useRouter).toBe('mock-useRouter')
    expect(navigation.getPathname).toBe('mock-getPathname')
  })

  it('should export request configuration', () => {
    const requestConfig = require('./request')

    expect(requestConfig.default).toBe('mock-request-config')
  })
})
