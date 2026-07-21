import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

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
  const t = useTranslations('Common')

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  const arrowClass =
    'flex items-center cursor-pointer text-white transition-colors hover:text-secondary ' +
    'disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:text-gray-600'

  return (
    <nav className='flex justify-center items-center gap-medium'>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label={t('previousPage')}
        className={arrowClass}
      >
        <FaChevronLeft size={14} />
      </button>
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1
        const isCurrent = currentPage === page

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={t('goToPage', { page })}
            aria-current={isCurrent ? 'page' : undefined}
            className={clsx(
              'bg-bg-primary rounded-md cursor-pointer p-xsmall pb-xxsmall transition-colors',
              isCurrent ? 'text-secondary' : 'text-white hover:text-secondary',
            )}
          >
            {page}
          </button>
        )
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label={t('nextPage')}
        className={arrowClass}
      >
        <FaChevronRight size={14} />
      </button>
    </nav>
  )
}

export default Pagination
