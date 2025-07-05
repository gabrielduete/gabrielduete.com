'use client'

import Link from 'next/link'

const Card = (article: IArticle) => {
  const { title, date, description, slug } = article

  return (
    <Link href={`blog/${slug}`}>
      <article
        className='
          max-w-[528px] w-full p-xxlarge bg-bg-cards text-primary
          cursor-pointer rounded-sm border border-bg-cards hover:border-secondary
          flex flex-col justify-between gap-large
        '
      >
        <header className='flex justify-between items-center'>
          <h1 className='text-subtitle font-bold max-w-[330px] w-full'>
            {title}
          </h1>
          <p className='text-xsmall text-gray-400'>{date}</p>
        </header>
        <p className='text-medium'>{description}</p>
      </article>
    </Link>
  )
}

export default Card
