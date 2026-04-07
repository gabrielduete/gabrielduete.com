import { Paths } from '@/enums/Paths'

type NavigatorItem =
  | {
      name: string
      name_en?: string
      href: string
    }
  | {
      name: string
      name_en?: string
      external: true
      href: string
      hrefEn: string
    }

const items: NavigatorItem[] = [
  {
    name: 'Olá',
    name_en: 'Hello',
    href: Paths.ROOT,
  },
  {
    name: 'Blog',
    href: Paths.BLOG,
  },
  {
    name: 'Lab',
    href: Paths.LAB,
  },
  {
    name: 'Carreira',
    name_en: 'Career',
    href: Paths.CAREER,
  },
  {
    name: 'Currículo',
    name_en: 'Resume',
    external: true,
    href: 'https://gabrielduete.github.io/resume/br/resume.html',
    hrefEn: 'https://gabrielduete.github.io/resume/en/resume.html',
  },
]

export default items
