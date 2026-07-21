const Loading = () => {
  return (
    <section className='text-blog animate-pulse' aria-busy='true'>
      <div className='h-6 w-24 rounded bg-bg-cards mb-large' />
      <header>
        <div className='h-10 w-3/4 rounded bg-bg-cards mb-xxsmall' />
        <div className='h-5 w-1/2 rounded bg-bg-cards mb-xxsmall' />
        <div className='h-4 w-32 rounded bg-bg-cards mb-large' />
      </header>
      <div className='flex flex-col gap-small'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='h-4 rounded bg-bg-cards'
            style={{ width: `${90 - (i % 4) * 12}%` }}
          />
        ))}
      </div>
    </section>
  )
}

export default Loading
