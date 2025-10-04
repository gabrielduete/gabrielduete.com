import { render, screen } from '@testing-library/react'

import ExternalLink from './ExternalLink'

describe('ExternalLink', () => {
  it('renders with correct href and children', () => {
    render(<ExternalLink href='https://example.com'>Test Link</ExternalLink>)

    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveTextContent('Test Link')
  })
})
