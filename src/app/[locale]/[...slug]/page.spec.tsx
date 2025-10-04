import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { notFound } from 'next/navigation'

import NotFoundCatchAll from './page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('<NotFoundCatchAll />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call notFound when component is rendered', () => {
    render(<NotFoundCatchAll />)

    expect(notFound).toHaveBeenCalledTimes(1)
  })

  it('should call notFound immediately on render', () => {
    render(<NotFoundCatchAll />)

    expect(notFound).toHaveBeenCalledWith()
  })
})
