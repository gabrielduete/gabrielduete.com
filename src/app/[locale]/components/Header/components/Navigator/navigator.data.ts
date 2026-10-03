import { Paths } from '@/enums/Paths'
import { IconType } from 'react-icons'
import {
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiFileText,
  FiHome,
} from 'react-icons/fi'

type NavigatorItem =
  | {
      name: string
      name_en?: string
      icon: IconType
      href: string
    }
  | {
      name: string
      name_en?: string
      icon: IconType
      external: true
      href: string
      hrefEn: string
    }

const items: NavigatorItem[] = [
  {
    name: 'Olá',
    icon: FiHome,
    name_en: 'Hello',
    href: Paths.ROOT,
  },
  {
    name: 'Blog',
    icon: FiBookOpen,
    href: Paths.BLOG,
  },
  {
    name: 'Lab',
    icon: FiCode,
    href: Paths.LAB,
  },
  {
    name: 'Carreira',
    icon: FiBriefcase,
    name_en: 'Career',
    href: Paths.CAREER,
  },
  {
    name: 'Currículo',
    icon: FiFileText,
    name_en: 'Resume',
    external: true,
    href: 'https://gabrielduete.github.io/resume/br/resume.html',
    hrefEn: 'https://gabrielduete.github.io/resume/en/resume.html',
  },
]

export default items
