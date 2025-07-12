require('@testing-library/jest-dom')

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

jest.mock('next/image', () => {
  const MockImage = props => <img {...props} />
  MockImage.displayName = 'NextImage'

  return MockImage
})

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => {
    const searchParams = new URLSearchParams()
    return {
      get: key => searchParams.get(key),
      has: key => searchParams.has(key),
      toString: () => searchParams.toString(),
    }
  },
}))

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))
