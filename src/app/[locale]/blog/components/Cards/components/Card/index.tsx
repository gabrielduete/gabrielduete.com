const Card = () => {
  return (
    <article
      className='
        w-[528px] p-xxlarge bg-bg-cards text-primary
        cursor-pointer rounded-sm border border-bg-cards hover:border-secondary
        flex flex-col justify-between gap-large
      '
    >
      <header className='flex justify-between items-center'>
        <h1 className='text-subtitle font-bold'>Nome do artigo</h1>
        <p className='text-xsmall text-gray-400'>há 1 dia</p>
      </header>
      <p className='text-medium'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor
        dolor ac felis lobortis efficitur. Donec ut nulla non nulla tincidunt
        eleifend. In vel enim pulvinar, tincidunt sapien eget, elementum nunc.
        Duis venenatis, urna in ultricies condimentum, ante felis consequat
        mauris, eget aliquam erat odio in sapien.
      </p>
    </article>
  )
}

export default Card
