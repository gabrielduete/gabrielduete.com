import { SocialMedia } from '@/enums/SocialMedia'
import { FaStackOverflow } from 'react-icons/fa'
import { FaDev } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { PiLinkedinLogo } from 'react-icons/pi'
import { TbBrandGithubFilled } from 'react-icons/tb'

export const SocialMediaItems = [
  {
    Icon: PiLinkedinLogo,
    name: 'LinkedIn',
    link: SocialMedia.LINKEDIN,
  },
  {
    Icon: TbBrandGithubFilled,
    name: 'GitHub',
    link: SocialMedia.GITHUB,
  },
  {
    Icon: FaStackOverflow,
    name: 'StackOverflow',
    link: SocialMedia.STACKOVERFLOW,
  },
  {
    Icon: FaDev,
    name: 'DEV',
    link: SocialMedia.DEV,
  },
  {
    Icon: MdEmail,
    name: 'Email',
    link: SocialMedia.EMAIL,
  },
]
