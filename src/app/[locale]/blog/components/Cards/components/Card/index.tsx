type CardProps = {
  title: string
  date: string
  description: string
}

const Card = ({ title, date, description }: CardProps) => {
  return (
    <article
      className='
        w-[528px] p-xxlarge bg-bg-cards text-primary
        cursor-pointer rounded-sm border border-bg-cards hover:border-secondary
        flex flex-col justify-between gap-large
      '
    >
      <header className='flex justify-between items-center'>
        <h1 className='text-subtitle font-bold'>{title}</h1>
        <p className='text-xsmall text-gray-400'>{date}</p>
      </header>
      <p className='text-medium'>{description}</p>
    </article>
  )
}

export default Card
