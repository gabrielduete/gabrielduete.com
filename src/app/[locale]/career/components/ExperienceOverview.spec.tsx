import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { IExperiences } from '../types'
import ExperienceOverview from './ExperienceOverview'

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string, values?: Record<string, unknown>) => {
      if (key === 'Overview.selectExperience') {
        return `${values?.experience}, ${values?.period}`
      }

      if (key === 'months.3') return 'Mar'
      if (key === 'months.8') return 'Aug'
      if (key === 'monthYear') return `${values?.month} ${values?.year}`
      if (key === 'present') return 'Present'
      if (key === 'monthsCount') return `${values?.count} months`

      return key
    }

    return t
  },
}))

const allExperiences: IExperiences[] = [
  'Petlove',
  'React4Noobs',
  'Juntos Somos Mais',
  'Nimbus Black',
  'He4rt Team',
]

const renderOverview = (
  props: Partial<{
    experiences: IExperiences[]
    selectedExperience: IExperiences | null
    onSelect: (experience: IExperiences) => void
  }> = {},
) =>
  render(
    <ExperienceOverview
      experiences={props.experiences ?? allExperiences}
      selectedExperience={props.selectedExperience ?? null}
      currentMonth='2026-10'
      onSelect={props.onSelect ?? jest.fn()}
    />,
  )

describe('<ExperienceOverview />', () => {
  it('renders nothing when there is no experience to show', () => {
    renderOverview({ experiences: [] })

    expect(screen.queryByTestId('experience-overview')).not.toBeInTheDocument()
  })

  it('renders a bar per experience', () => {
    renderOverview()

    expect(screen.getAllByRole('button')).toHaveLength(allExperiences.length)
  })

  it('names each bar with its experience and period', () => {
    renderOverview({ experiences: ['Nimbus Black'] })

    expect(
      screen.getByRole('button', {
        name: 'Nimbus Black, Aug 2024 - Mar 2025 · 8 months',
      }),
    ).toBeInTheDocument()
  })

  it('marks the selected experience as pressed', () => {
    renderOverview({ selectedExperience: 'Petlove' })

    const pressed = screen
      .getAllByRole('button')
      .filter(button => button.getAttribute('aria-pressed') === 'true')

    expect(pressed).toHaveLength(1)
    expect(pressed[0]).toHaveAccessibleName(/^Petlove, /)
  })

  it('calls onSelect with the clicked experience', () => {
    const onSelect = jest.fn()

    renderOverview({ onSelect })
    fireEvent.click(screen.getByRole('button', { name: /^He4rt Team, / }))

    expect(onSelect).toHaveBeenCalledWith('He4rt Team')
  })

  it('spans the bars across the full range of the experiences', () => {
    const { container } = renderOverview({
      experiences: ['Juntos Somos Mais', 'Nimbus Black'],
    })

    const [first, second] = Array.from(
      container.querySelectorAll('button > span:last-child > span'),
    ) as HTMLElement[]

    expect(first.style.left).toBe('0%')
    expect(first.style.width).toBe('100%')
    expect(parseFloat(second.style.left)).toBeGreaterThan(0)
    expect(parseFloat(second.style.width)).toBeLessThan(100)
  })

  it('renders a label for every year in the range', () => {
    renderOverview({ experiences: ['Nimbus Black'] })

    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.queryByText('2026')).not.toBeInTheDocument()
  })
})
