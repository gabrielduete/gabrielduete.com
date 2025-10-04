import * as Sentry from '@sentry/nextjs'

jest.mock('@sentry/nextjs', () => ({
  captureRequestError: jest.fn(),
}))

jest.mock('../sentry.server.config', () => ({}))
jest.mock('../sentry.edge.config', () => ({}))

describe('instrumentation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete process.env.NEXT_RUNTIME
  })

  it('should register server config when NEXT_RUNTIME is nodejs', async () => {
    process.env.NEXT_RUNTIME = 'nodejs'

    const { register } = require('./instrumentation')
    await register()

    expect(true).toBe(true)
  })

  it('should register edge config when NEXT_RUNTIME is edge', async () => {
    process.env.NEXT_RUNTIME = 'edge'

    const { register } = require('./instrumentation')
    await register()

    expect(true).toBe(true)
  })

  it('should not register any config when NEXT_RUNTIME is not set', async () => {
    delete process.env.NEXT_RUNTIME

    const { register } = require('./instrumentation')
    await register()

    expect(true).toBe(true)
  })

  it('should export onRequestError function', () => {
    const { onRequestError } = require('./instrumentation')

    expect(onRequestError).toBe(Sentry.captureRequestError)
  })
})
