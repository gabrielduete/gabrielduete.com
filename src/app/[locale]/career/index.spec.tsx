import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { experiences } from './data'
import Career from './page'

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const translations: Record<string, string> = {
      'Experiences.Petlove.title': 'Petlove',
      'Experiences.Petlove.role': 'Mid-level Front-end Developer',
      'Experiences.Petlove.employmentMeta': 'Petlove · Full-time',
      'Experiences.Petlove.time': 'Mar 2026 - Present',
      'Experiences.Petlove.location': 'São Paulo, Brazil · Remote',
      'Experiences.Petlove.totalContributions': '1',
      'Experiences.Petlove.contributions.1': 'Contribution Petlove',
      'Experiences.Petlove.link': 'https://www.petlove.com.br/',

      'Experiences.Juntos Somos Mais.title': 'Juntos Somos Mais',
      'Experiences.Juntos Somos Mais.role': 'Front-end Developer',
      'Experiences.Juntos Somos Mais.employmentMeta':
        'Juntos Somos Mais · Full-time',
      'Experiences.Juntos Somos Mais.time': '2020 - Present',
      'Experiences.Juntos Somos Mais.location': 'Brazil · Remote',
      'Experiences.Juntos Somos Mais.totalContributions': '3',
      'Experiences.Juntos Somos Mais.contributions.1': 'Contribution 1',
      'Experiences.Juntos Somos Mais.contributions.2': 'Contribution 2',
      'Experiences.Juntos Somos Mais.contributions.3': 'Contribution 3',
      'Experiences.Juntos Somos Mais.link': '',

      'Experiences.Nimbus Black.title': 'Nimbus Black',
      'Experiences.Nimbus Black.role': 'Front-end Developer',
      'Experiences.Nimbus Black.employmentMeta': 'Nimbus Black · Contract',
      'Experiences.Nimbus Black.time': '2024 - 2025',
      'Experiences.Nimbus Black.location': 'Remote',
      'Experiences.Nimbus Black.totalContributions': '1',
      'Experiences.Nimbus Black.contributions.1': 'Nimbus 1',
      'Experiences.Nimbus Black.link': '',

      'Experiences.React4Noobs.title': 'React4Noobs',
      'Experiences.React4Noobs.role': 'Contributor',
      'Experiences.React4Noobs.employmentMeta':
        'He4rt Developers · Open source',
      'Experiences.React4Noobs.time': '2019 - 2020',
      'Experiences.React4Noobs.location': 'Remote',
      'Experiences.React4Noobs.totalContributions': '2',
      'Experiences.React4Noobs.contributions.1': 'React Contribution 1',
      'Experiences.React4Noobs.contributions.2': 'React Contribution 2',
      'Experiences.React4Noobs.link':
        'https://github.com/he4rt/react4noobs',

      'Experiences.He4rt Team.title': 'He4rt Team',
      'Experiences.He4rt Team.role': 'Front-end Developer',
      'Experiences.He4rt Team.employmentMeta': 'He4rt Team · Volunteer',
      'Experiences.He4rt Team.time': 'Jun 2022 - Jan 2023',
      'Experiences.He4rt Team.location': 'Remote',
      'Experiences.He4rt Team.totalContributions': '1',
      'Experiences.He4rt Team.contributions.1': 'He4rt 1',
      'Experiences.He4rt Team.link': '',
    }

    const t = (key: string) => translations[key] ?? key
    t.rich = (key: string) => translations[key] ?? key
    return t
  },
  useLocale: () => 'en',
}))

describe('<Career />', () => {
  it('should render the component with default experience', () => {
    render(<Career />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Petlove' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Mid-level Front-end Developer'),
    ).toBeInTheDocument()
  })

  it('should render buttons for all experiences', () => {
    render(<Career />)

    experiences.forEach(experience => {
      const button = screen.getByRole('button', { name: experience })
      expect(button).toBeInTheDocument()
    })
  })

  it('should update the experience when a button is clicked', () => {
    render(<Career />)

    fireEvent.click(screen.getByRole('button', { name: 'React4Noobs' }))

    expect(
      screen.getByRole('heading', { level: 1, name: 'React4Noobs' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Contributor')).toBeInTheDocument()
  })
})
