import clsx from 'clsx'

type PaginationProps = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  return (
    <div>
      <nav className='flex justify-center items-center gap-medium'>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={clsx(
              'bg-bg-primary rounded-md cursor-pointer p-xsmall pb-xxsmall',
              currentPage === index + 1
                ? 'text-secondary'
                : 'text-primary hover:text-secondary',
            )}
          >
            {index + 1}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Pagination
