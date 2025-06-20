import { SocialMediaItems } from '@/constants/SocialMediaItems'
import Link from 'next/link'

const Icons = () => {
  return (
    <div className='flex gap-small items-center'>
      {SocialMediaItems.map(({ Icon, name, link }) => (
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
