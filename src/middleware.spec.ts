import createMiddleware from 'next-intl/middleware'

jest.mock('next-intl/middleware', () => {
  return jest.fn(() => 'mocked-middleware')
})

jest.mock('./i18n/routing', () => ({
  routing: 'mocked-routing-config',
}))

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create middleware with routing config', () => {
    const middleware = require('./middleware').default

    expect(createMiddleware).toHaveBeenCalledWith('mocked-routing-config')
    expect(middleware).toBe('mocked-middleware')
  })

  it('should export correct config matcher', () => {
    const { config } = require('./middleware')

    expect(config).toEqual({
      matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    })
  })

  it('should have correct matcher pattern', () => {
    const { config } = require('./middleware')
    const matcher = config.matcher

    expect(matcher).toContain('api')
    expect(matcher).toContain('trpc')
    expect(matcher).toContain('_next')
    expect(matcher).toContain('_vercel')
    expect(matcher).toContain('.*\\..*')
  })
})
