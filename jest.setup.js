require('@testing-library/jest-dom')

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

jest.mock('next/image', () => {
  const MockImage = props => <img {...props} />
  MockImage.displayName = 'NextImage'

  return MockImage
})
