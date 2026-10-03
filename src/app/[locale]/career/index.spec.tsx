import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Career from './page'

describe('<Career />', () => {
  it('should render the highlights and the experience feed', () => {
    render(<Career />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Feed.title' }),
    ).toBeInTheDocument()
  })
})
