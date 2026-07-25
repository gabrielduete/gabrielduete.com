import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import Loading from './loading'

describe('<Loading />', () => {
  it('renders a busy skeleton', () => {
    const { container } = render(<Loading />)

    const skeleton = container.querySelector('section')

    expect(skeleton).toHaveAttribute('aria-busy', 'true')
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders eight placeholder lines with decreasing widths', () => {
    const { container } = render(<Loading />)

    const lines = container.querySelectorAll('.flex.flex-col.gap-small > div')

    expect(lines).toHaveLength(8)
    expect(lines[0]).toHaveStyle({ width: '90%' })
    expect(lines[3]).toHaveStyle({ width: '54%' })
  })
})
