import { ReactNode } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

const progressProviderMock = jest.fn()

jest.mock('@bprogress/next/app', () => ({
  ProgressProvider: (props: { children: ReactNode }) => {
    progressProviderMock(props)
    return <div data-testid='progress-provider'>{props.children}</div>
  },
}))

import ProgressBar from './ProgressBar'

describe('<ProgressBar />', () => {
  it('renders its children inside the progress provider', () => {
    render(
      <ProgressBar>
        <span>content</span>
      </ProgressBar>,
    )

    expect(screen.getByTestId('progress-provider')).toBeInTheDocument()
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('configures the provider with the brand color and no spinner', () => {
    render(<ProgressBar>content</ProgressBar>)

    expect(progressProviderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        color: '#46ce7a',
        height: '3px',
        options: { showSpinner: false },
      }),
    )
  })
})
