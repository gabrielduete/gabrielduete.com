import Link from 'next/link'

const Card = (article: IArticle) => {
  const { title, date, description, slug } = article

  return (
    <Link href={`blog/${slug}`}>
      <article
        className='
          max-w-[484px] w-full h-[260px] p-xxlarge bg-bg-cards text-cards
          cursor-pointer rounded-sm border border-bg-cards hover:border-secondary
          flex flex-col justify-between gap-large
        '
      >
        <header className='flex justify-between'>
          <h1 className='text-subtitle font-bold max-w-[330px] w-full'>
            {title}
          </h1>
          <p className='text-small text-gray-400 mt-xxsmall'>{date}</p>
        </header>
        <p className='text-medium text-ellipsis line-clamp-3'>{description}</p>
      </article>
    </Link>
  )
}

export default Card
