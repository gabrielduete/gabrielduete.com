import {
  ExperienceFilter,
  ExperienceType,
  IExperiences,
  IPeriod,
} from './types'

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

export const experiencePeriods: Record<IExperiences, IPeriod> = {
  Petlove: { start: '2026-03', end: null },
  'Juntos Somos Mais': { start: '2021-12', end: '2026-03' },
  'Nimbus Black': { start: '2024-08', end: '2025-03' },
  React4Noobs: { start: '2023-09', end: null },
  'He4rt Team': { start: '2022-06', end: '2023-01' },
}

export const laneOrder: ExperienceType[] = [
  'full-time',
  'freelance',
  'open-source',
]
