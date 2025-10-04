import { GiscusProps } from '@giscus/react'
import { render, screen } from '@testing-library/react'

import { GiscusComments } from './index'

jest.mock('@giscus/react', () => {
  return function MockGiscus(props: GiscusProps) {
    return <div data-testid='giscus' {...props} />
  }
})

describe('GiscusComments', () => {
  it('renders the Giscus component', () => {
    render(<GiscusComments locale='en' term='test-term' />)

    const giscus = screen.getByTestId('giscus')
    expect(giscus).toBeInTheDocument()
  })

  it('passes correct props to Giscus', () => {
    render(<GiscusComments locale='en' term='test-term' />)

    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('data-repo-id', 'R_kgDON7zbqA')
    expect(giscus).toHaveAttribute('category', 'General')
    expect(giscus).toHaveAttribute('mapping', 'pathname')
    expect(giscus).toHaveAttribute('term', 'test-term')
    expect(giscus).toHaveAttribute('reactionsEnabled', '1')
    expect(giscus).toHaveAttribute('inputPosition', 'bottom')
    expect(giscus).toHaveAttribute('theme', 'dark_dimmed')
    expect(giscus).toHaveAttribute('lang', 'en')
  })

  it('sets correct language for Portuguese locale', () => {
    render(<GiscusComments locale='pt' term='test-term' />)

    const giscus = screen.getByTestId('giscus')
    expect(giscus).toHaveAttribute('lang', 'pt')
  })

  it('has correct container styling', () => {
    render(<GiscusComments locale='en' term='test-term' />)

    const container = screen.getByTestId('giscus').parentElement
    expect(container).toHaveClass('mt-xxlarge')
  })
})
