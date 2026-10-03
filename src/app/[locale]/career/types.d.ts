export type IExperiences =
  | 'Petlove'
  | 'Juntos Somos Mais'
  | 'Nimbus Black'
  | 'React4Noobs'
  | 'He4rt Team'

export type ExperienceType = 'full-time' | 'freelance' | 'open-source'

export type ExperienceFilter = 'all' | ExperienceType

export type IPeriod = {
  start: string
  end: string | null
}
