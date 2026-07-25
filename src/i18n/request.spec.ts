type RequestConfigHandler = (params: {
  requestLocale: Promise<string | undefined>
}) => Promise<{ locale: string; messages: Record<string, unknown> }>

let handler: RequestConfigHandler

jest.mock('next-intl/server', () => ({
  getRequestConfig: (callback: RequestConfigHandler) => {
    handler = callback
    return callback
  },
}))

jest.mock('next-intl/routing', () => ({
  defineRouting: (config: unknown) => config,
}))

jest.mock('next-intl', () => ({
  hasLocale: (locales: string[], locale?: string) =>
    Boolean(locale) && locales.includes(locale as string),
}))

describe('i18n request config', () => {
  beforeAll(async () => {
    await import('./request')
  })

  it('keeps a supported requested locale', async () => {
    const config = await handler({ requestLocale: Promise.resolve('pt-br') })

    expect(config.locale).toBe('pt-br')
    expect(config.messages).toBeDefined()
  })

  it('falls back to the default locale when the request has none', async () => {
    const config = await handler({ requestLocale: Promise.resolve(undefined) })

    expect(config.locale).toBe('en')
  })

  it('falls back to the default locale when the request is unsupported', async () => {
    const config = await handler({ requestLocale: Promise.resolve('fr') })

    expect(config.locale).toBe('en')
  })

  it('loads the messages of the resolved locale', async () => {
    const config = await handler({ requestLocale: Promise.resolve('en') })

    expect(Object.keys(config.messages).length).toBeGreaterThan(0)
  })
})
