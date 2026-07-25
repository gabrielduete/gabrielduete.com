import { fireEvent, render, screen } from '@testing-library/react'

import Pagination from '.'

describe('<Pagination />', () => {
  const mockOnPageChange = jest.fn()

  it('should render the correct number of page buttons', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />,
    )

    const pageButtons = screen.getAllByRole('button', { name: 'goToPage' })
    expect(pageButtons).toHaveLength(5)
  })

  it('should highlight the current page button', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />,
    )

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('text-secondary')
  })

  it('should not highlight non-current page buttons', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />,
    )

    const nonCurrentPageButton = screen.getByText('2')
    expect(nonCurrentPageButton).toHaveClass(
      ' bg-bg-primary rounded-md cursor-pointer p-xsmall pb-xxsmall text-white hover:text-secondary',
    )
    expect(nonCurrentPageButton).not.toHaveClass('text-secondary')
  })

  it('should call onPageChange with the correct page number when a button is clicked', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />,
    )

    const button = screen.getByText('4')
    fireEvent.click(button)

    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('should go to the previous page through the left arrow', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'previousPage' }))

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should go to the next page through the right arrow', () => {
    render(
      <Pagination
        totalPages={5}
        currentPage={3}
        onPageChange={mockOnPageChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'nextPage' }))

    expect(mockOnPageChange).toHaveBeenCalledWith(4)
  })

  it('should disable the arrows on the edges', () => {
    const { rerender } = render(
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />,
    )

    expect(screen.getByRole('button', { name: 'previousPage' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'nextPage' })).toBeEnabled()

    rerender(
      <Pagination
        totalPages={5}
        currentPage={5}
        onPageChange={mockOnPageChange}
      />,
    )

    expect(screen.getByRole('button', { name: 'nextPage' })).toBeDisabled()
  })

  it('should not render the arrows when there is a single page', () => {
    render(
      <Pagination
        totalPages={1}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'previousPage' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'nextPage' }),
    ).not.toBeInTheDocument()
  })

  it('should render no buttons if totalPages is 0', () => {
    render(
      <Pagination
        totalPages={0}
        currentPage={1}
        onPageChange={mockOnPageChange}
      />,
    )

    const buttons = screen.queryAllByRole('button')
    expect(buttons).toHaveLength(0)
  })
})
