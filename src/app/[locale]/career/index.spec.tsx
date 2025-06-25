import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import { experiences } from './data'
import Career from './page'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'CarrerPage.Experiences.Juntos Somos Mais.title': 'Juntos Somos Mais',
      'CarrerPage.Experiences.Juntos Somos Mais.time': '2020 - Present',
      'CarrerPage.Experiences.Juntos Somos Mais.totalContributions': '3',
      'CarrerPage.Experiences.Juntos Somos Mais.contributions.1':
        'Contribution 1',
      'CarrerPage.Experiences.Juntos Somos Mais.contributions.2':
        'Contribution 2',
      'CarrerPage.Experiences.Juntos Somos Mais.contributions.3':
        'Contribution 3',

      'CarrerPage.Experiences.React4Noobs.title': 'React4Noobs',
      'CarrerPage.Experiences.React4Noobs.time': '2019 - 2020',
      'CarrerPage.Experiences.React4Noobs.totalContributions': '2',
      'CarrerPage.Experiences.React4Noobs.contributions.1':
        'React Contribution 1',
      'CarrerPage.Experiences.React4Noobs.contributions.2':
        'React Contribution 2',
      'CarrerPage.Experiences.React4Noobs.link':
        'https://github.com/he4rt/react4noobs',
    }

    return translations[key] ?? key
  },
  useLocale: () => 'en',
}))

describe('<Career />', () => {
  it('should render the component with default experience', () => {
    render(<Career />)

    const title = screen.getByText('Juntos Somos Mais')
    expect(title).toBeInTheDocument()
  })

  it('should render buttons for all experiences', () => {
    render(<Career />)

    experiences.forEach(experience => {
      const button = screen.getByText(experience)
      expect(button).toBeInTheDocument()
    })
  })

  it('should update the experience when a button is clicked', () => {
    render(<Career />)

    fireEvent.click(screen.getByText('React4Noobs'))

    const title = screen.getByText('Experiences.React4Noobs.title')
    expect(title).toBeInTheDocument()
  })
})
