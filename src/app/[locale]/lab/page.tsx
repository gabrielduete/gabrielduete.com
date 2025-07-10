import Filter from '@/components/Filter'
import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

import { contributions } from './index.data'

const Lab = () => {
  const locale = useLocale()

  const isEN = locale === Locales.EN

  return (
    <section className='flex flex-col gap-xxlarge'>
      <Filter />
      <div className='flex gap-xxlarge flex-wrap justify-center lg:justify-start'>
        {contributions.map(({ title, description, age, image, link }) => {
          const titleText = isEN ? title.en : title.pt
          const descriptionText = isEN ? description.en : description.pt

          return (
            <article
              key={titleText}
              className='
                max-w-[312px] w-full p-xxlarge bg-bg-cards text-primary
                cursor-pointer rounded-sm border border-bg-cards hover:border-secondary
              '
            >
              <Link
                href={link}
                target='_blank'
                className='flex flex-col justify-between gap-medium'
              >
                <div>
                  <Image
                    src={image}
                    alt={titleText}
                    className='rounded-sm w-full h-[200px]'
                  />
                  <h1 className='text-title-headline mt-medium'>{titleText}</h1>
                  <p className='text-small text-gray-400 mt-0.5'>{age}</p>
                </div>
                <p className='text-medium text-ellipsis line-clamp-3'>
                  {descriptionText}
                </p>
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Lab
