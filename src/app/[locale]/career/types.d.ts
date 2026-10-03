export type IExperiences =
  | 'petlove'
  | 'nimbus-black'
  | 'juntos-somos-mais'
  | 'react4noobs'
  | 'he4rt-team'
  | 'open-source'

export type ExperienceType = 'full-time' | 'freelance' | 'open-source'

export type ExperienceFilter = 'all' | ExperienceType

export type IPeriod = {
  start: string
  end: string | null
}

export type LinkKind = 'issue' | 'pull-request' | 'repository' | 'website'

export type IExperienceLink = {
  key: string
  href: string
  kind: LinkKind
}

export type IContribution = {
  key: string
  link?: IExperienceLink
}

export type IContributionGroup = {
  key: string
  items: IContribution[]
}

export type IExperience = {
  id: IExperiences
  type: ExperienceType
  period: IPeriod | null
  techs: string[]
  metrics: string[]
  groups: IContributionGroup[]
  website?: IExperienceLink
}
