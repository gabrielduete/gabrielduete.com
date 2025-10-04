import * as Sentry from '@sentry/nextjs'

jest.mock('@sentry/nextjs', () => ({
  init: jest.fn(),
  replayIntegration: jest.fn(() => 'replay-integration'),
  captureRouterTransitionStart: jest.fn(),
}))

describe('instrumentation-client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize Sentry with correct configuration', () => {
    // Import and execute the module after mocks are set up
    require('./instrumentation-client')

    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: ['replay-integration'],
      tracesSampleRate: 1,
      enableLogs: true,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      debug: false,
    })
  })

  it('should export onRouterTransitionStart function', () => {
    const { onRouterTransitionStart } = require('./instrumentation-client')

    expect(onRouterTransitionStart).toBe(Sentry.captureRouterTransitionStart)
  })
})
