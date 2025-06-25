import { SocialMediaItems } from '@/constants/SocialMediaItems'
import ProfilePic from '@/public/assets/images/profile-pic.png'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { FaBuilding } from 'react-icons/fa6'

const Home = async () => {
  const t = await getTranslations('IndexPage')

  const MediasLink = [
    {
      Icon: FaBuilding,
      name: 'Juntos Somos Mais',
      link: 'https://g.co/kgs/eVwdD6s',
    },
    ...SocialMediaItems,
  ]

  return (
    <section className='w-full bg-bg-cards rounded-sm text-white p-xxxlarge flex flex-col items-center lg:flex-row lg:items-start gap-xxlarge drop-shadow-lg'>
      <Image
        src={ProfilePic}
        alt='Profile Pic'
        className='max-w-[148px] max-h-[148px] rounded-sm'
      />
      <div className='text-center lg:text-left'>
        <h1 className='text-xlarge font-bold'>Gabriel Duete</h1>
        <h2 className='text-medium whitespace-break-spaces leading-[160%] mt-xsmall mb-large'>
          {t('about')}
        </h2>
        <div className='flex gap-large flex-wrap justify-center lg:justify-start'>
          {MediasLink.map(({ Icon, name, link }, index) => (
            <Link
              key={index}
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-xsmall hover:text-icons-primary transition-colors group'
            >
              <Icon
                className='text-green-white group-hover:text-icons-primary transition-colors'
                data-testid={`home-page__icon-${name}`}
                size={20}
              />
              <p className='text-xsmall text-white group-hover:text-icons-primary transition-colors'>
                {name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
