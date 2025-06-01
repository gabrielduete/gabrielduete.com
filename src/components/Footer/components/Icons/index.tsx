import Link from 'next/link'
import { FaStackOverflow } from 'react-icons/fa'
import { FaSquareXTwitter } from 'react-icons/fa6'
import { PiLinkedinLogo } from 'react-icons/pi'
import { TbBrandGithubFilled } from 'react-icons/tb'

const iconList = [
  {
    Icon: PiLinkedinLogo,
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/gabrielduete/',
  },
  {
    Icon: TbBrandGithubFilled,
    name: 'GitHub',
    link: 'https://github.com/gabrielduete',
  },
  {
    Icon: FaStackOverflow,
    name: 'StackOverflow',
    link: 'https://stackoverflow.com/users/16782642/gabriel-duete',
  },
  {
    Icon: FaSquareXTwitter,
    name: 'X/Twitter',
    link: 'https://x.com/gabrielduetedev',
  },
]

const Icons = () => {
  return (
    <div className='flex gap-small items-center'>
      {iconList.map(({ Icon, name, link }) => (
        <Link href={link} key={name} target='_blank'>
          <Icon
            size={32}
            className='
          text-primary hover:text-icons-primary  
          cursor-pointer transition-colors duration-200'
            aria-label={name}
            title={name}
          />
        </Link>
      ))}
    </div>
  )
}

export default Icons
