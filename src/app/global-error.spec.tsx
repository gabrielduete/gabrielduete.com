import * as Sentry from '@sentry/nextjs'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import NextError from 'next/error'

import GlobalError from './global-error'

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}))

jest.mock('next/error', () => {
  return function MockNextError({ statusCode }: { statusCode: number }) {
    return (
      <div data-testid='next-error'>Error with status code: {statusCode}</div>
    )
  }
})

describe('<GlobalError />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the component with NextError', () => {
    const mockError = new Error('Test error')

    render(<GlobalError error={mockError} />)

    const nextError = document.querySelector('[data-testid="next-error"]')
    expect(nextError).toBeInTheDocument()
    expect(nextError).toHaveTextContent('Error with status code: 0')
  })

  it('should call Sentry.captureException with the error', () => {
    const mockError = new Error('Test error')

    render(<GlobalError error={mockError} />)

    expect(Sentry.captureException).toHaveBeenCalledTimes(1)
    expect(Sentry.captureException).toHaveBeenCalledWith(mockError)
  })

  it('should render html and body tags', () => {
    const mockError = new Error('Test error')

    render(<GlobalError error={mockError} />)

    const html = document.querySelector('html')
    const body = document.querySelector('body')

    expect(html).toBeInTheDocument()
    expect(body).toBeInTheDocument()
  })

  it('should handle error with digest property', () => {
    const mockError = new Error('Test error') as Error & { digest?: string }
    mockError.digest = 'test-digest-123'

    render(<GlobalError error={mockError} />)

    expect(Sentry.captureException).toHaveBeenCalledWith(mockError)
  })

  it('should call Sentry.captureException when error changes', () => {
    const mockError1 = new Error('First error')
    const mockError2 = new Error('Second error')

    const { rerender } = render(<GlobalError error={mockError1} />)

    expect(Sentry.captureException).toHaveBeenCalledTimes(1)
    expect(Sentry.captureException).toHaveBeenCalledWith(mockError1)

    rerender(<GlobalError error={mockError2} />)

    expect(Sentry.captureException).toHaveBeenCalledTimes(2)
    expect(Sentry.captureException).toHaveBeenLastCalledWith(mockError2)
  })
})
