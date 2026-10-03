import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { IExperiences } from '../types'
import ExperienceLanes from './ExperienceLanes'

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => {
      if (key.endsWith('.totalContributions')) return '1'
      if (key.endsWith('.link')) return ''

      return key
    }

    t.rich = (key: string) => key

    return t
  },
}))

const renderLanes = (
  experiences: IExperiences[],
  selectedExperience: IExperiences | null = null,
) =>
  render(
    <ExperienceLanes
      experiences={experiences}
      selectedExperience={selectedExperience}
      currentMonth='2026-10'
      richHandlers={{}}
      registerCard={jest.fn()}
      onToggle={jest.fn()}
    />,
  )

describe('<ExperienceLanes />', () => {
  beforeEach(() => {
    global.ResizeObserver = class {
      observe = jest.fn()
      unobserve = jest.fn()
      disconnect = jest.fn()
    } as unknown as typeof ResizeObserver
  })

  it('renders nothing when there is no experience to place', () => {
    renderLanes([])

    expect(screen.queryByTestId('experience-lanes')).not.toBeInTheDocument()
  })

  it('shifts the selected card of the last lane to the left', () => {
    renderLanes(['Petlove', 'React4Noobs'], 'React4Noobs')

    const card = screen
      .getByRole('button', { name: 'React4Noobs' })
      .closest('li') as HTMLElement

    expect(card.className).toContain('-translate-x-')
  })

  it('does not shift the selected card of an earlier lane', () => {
    renderLanes(['Petlove', 'React4Noobs'], 'Petlove')

    const card = screen
      .getByRole('button', { name: 'Petlove' })
      .closest('li') as HTMLElement

    expect(card.className).not.toContain('-translate-x-')
  })

  it('draws a rail spanning the duration of each experience', () => {
    const { container } = renderLanes(['Nimbus Black'])

    const rail = container.querySelector('li > span') as HTMLElement

    expect(rail).toHaveStyle({ height: `${8 * 15}px` })
  })
})
