import {
  ExperienceFilter,
  ExperienceType,
  IExperience,
  IExperienceLink,
} from './types'

export const careerLinks = {
  nuxtIssue: {
    key: 'nuxtIssue',
    href: 'https://github.com/nuxt/nuxt/issues/32494',
    kind: 'issue',
  },
  unleashPr: {
    key: 'unleashPr',
    href: 'https://l1nq.com/unleash-pr',
    kind: 'pull-request',
  },
  atomiumRepo: {
    key: 'atomiumRepo',
    href: 'https://github.com/juntossomosmais/atomium',
    kind: 'repository',
  },
  atomiumContributions: {
    key: 'atomiumContributions',
    href: 'https://shre.ink/Mliv',
    kind: 'pull-request',
  },
  atomiumXss: {
    key: 'atomiumXss',
    href: 'https://sl1nk.com/atomium',
    kind: 'pull-request',
  },
  react4noobs: {
    key: 'react4noobs',
    href: 'https://github.com/he4rt/react4noobs',
    kind: 'repository',
  },
  he4rt: {
    key: 'he4rt',
    href: 'https://github.com/he4rt',
    kind: 'repository',
  },
  petlove: {
    key: 'petlove',
    href: 'https://www.petlove.com.br/',
    kind: 'website',
  },
  juntosSomosMais: {
    key: 'juntosSomosMais',
    href: 'https://g.co/kgs/eVwdD6s',
    kind: 'website',
  },
} satisfies Record<string, IExperienceLink>

export const experiences: IExperience[] = [
  {
    id: 'petlove',
    type: 'full-time',
    period: { start: '2026-03', end: null },
    techs: [
      'Vue',
      'Next.js',
      'Lighthouse',
      'Honeybadger',
      'Security',
      'Microsoft Clarity',
      'Cursor',
      'Claude',
    ],
    metrics: ['manualExtraction', 'lighthouse', 'criticalFindings'],
    groups: [
      { key: 'ux', items: [{ key: 'clarity' }] },
      { key: 'accessibility', items: [{ key: 'audit' }] },
      { key: 'devsecops', items: [{ key: 'dependencies' }] },
      { key: 'observability', items: [{ key: 'honeybadger' }] },
      { key: 'documentation', items: [{ key: 'confluence' }] },
    ],
    website: careerLinks.petlove,
  },
  {
    id: 'nimbus-black',
    type: 'freelance',
    period: { start: '2024-08', end: '2025-03' },
    techs: ['React', 'SaaS', 'Design Systems', 'Figma', 'Cloud APIs'],
    metrics: ['mvp', 'designSystem'],
    groups: [
      {
        key: 'leadership',
        items: [{ key: 'mvp' }, { key: 'architecture' }],
      },
      { key: 'design', items: [{ key: 'uiux' }] },
      {
        key: 'product',
        items: [{ key: 'stakeholders' }, { key: 'consistency' }],
      },
      { key: 'integrations', items: [{ key: 'cloudApis' }] },
    ],
  },
  {
    id: 'juntos-somos-mais',
    type: 'full-time',
    period: { start: '2021-12', end: '2026-03' },
    techs: ['Vue', 'Nuxt.js', 'Web Components', 'CI/CD', 'Sonar', 'Security'],
    metrics: ['buildTime', 'vulnerabilities'],
    groups: [
      { key: 'cicd', items: [{ key: 'pipeline' }] },
      {
        key: 'security',
        items: [
          { key: 'redirect' },
          { key: 'xss', link: careerLinks.atomiumXss },
        ],
      },
      {
        key: 'designSystem',
        items: [{ key: 'atomium', link: careerLinks.atomiumContributions }],
      },
      {
        key: 'openSource',
        items: [
          { key: 'nuxt', link: careerLinks.nuxtIssue },
          { key: 'unleash', link: careerLinks.unleashPr },
        ],
      },
      { key: 'documentation', items: [{ key: 'adrs' }] },
      { key: 'features', items: [{ key: 'marketplace' }] },
      { key: 'pocs', items: [{ key: 'feasibility' }] },
      {
        key: 'quality',
        items: [{ key: 'refactoring' }, { key: 'chunkErrors' }],
      },
      {
        key: 'collaboration',
        items: [{ key: 'alignment' }, { key: 'squadFlow' }, { key: 'events' }],
      },
    ],
    website: careerLinks.juntosSomosMais,
  },
  {
    id: 'react4noobs',
    type: 'open-source',
    period: { start: '2023-09', end: null },
    techs: ['React', 'Design Patterns', 'Markdown', 'GitHub'],
    metrics: [],
    groups: [
      { key: 'content', items: [{ key: 'articles' }] },
      {
        key: 'maintenance',
        items: [{ key: 'architecture' }, { key: 'reviews' }],
      },
    ],
    website: careerLinks.react4noobs,
  },
  {
    id: 'he4rt-team',
    type: 'open-source',
    period: { start: '2022-06', end: '2023-01' },
    techs: [
      'JavaScript ES6+',
      'Next.js',
      'React',
      'Chakra UI',
      'Git',
      'GitHub',
    ],
    metrics: [],
    groups: [
      {
        key: 'development',
        items: [{ key: 'website' }, { key: 'improvements' }],
      },
      {
        key: 'team',
        items: [{ key: 'meetings' }, { key: 'learning' }],
      },
      { key: 'stack', items: [{ key: 'technologies' }] },
    ],
  },
  {
    id: 'open-source',
    type: 'open-source',
    period: null,
    techs: [
      'Nuxt',
      'Unleash',
      'Atomium DS',
      'Venice DS',
      'Stack Overflow',
      'He4rt Developers',
    ],
    metrics: ['nuxt', 'unleash', 'designSystems'],
    groups: [
      { key: 'nuxt', items: [{ key: 'issue', link: careerLinks.nuxtIssue }] },
      {
        key: 'unleash',
        items: [{ key: 'pullRequest', link: careerLinks.unleashPr }],
      },
      {
        key: 'designSystems',
        items: [{ key: 'contributions', link: careerLinks.atomiumRepo }],
      },
      {
        key: 'community',
        items: [{ key: 'content', link: careerLinks.he4rt }],
      },
    ],
  },
]

export const experienceTypeOrder: ExperienceType[] = [
  'full-time',
  'freelance',
  'open-source',
]

export const experienceFilters: ExperienceFilter[] = [
  'all',
  ...experienceTypeOrder,
]

export const typeStyles: Record<
  ExperienceType,
  { badge: string; dot: string }
> = {
  'full-time': {
    badge: 'border-card-accent/40 bg-card-accent/10 text-card-accent',
    dot: 'bg-card-accent',
  },
  freelance: {
    badge: 'border-amber-300/40 bg-amber-300/10 text-amber-300',
    dot: 'bg-amber-300',
  },
  'open-source': {
    badge: 'border-sky-300/40 bg-sky-300/10 text-sky-300',
    dot: 'bg-sky-300',
  },
}
