import { ExperienceFilter, ExperienceType, IExperiences } from './types'

export const experiences = [
  'Petlove',
  'Juntos Somos Mais',
  'Nimbus Black',
  'React4Noobs',
  'He4rt Team',
] as IExperiences[]

export const experienceTypes: Record<IExperiences, ExperienceType> = {
  Petlove: 'full-time',
  'Juntos Somos Mais': 'full-time',
  'Nimbus Black': 'freelance',
  React4Noobs: 'open-source',
  'He4rt Team': 'open-source',
}

export const experienceFilters: ExperienceFilter[] = [
  'all',
  'full-time',
  'freelance',
  'open-source',
]
