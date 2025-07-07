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

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
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
    expect(nonCurrentPageButton).toHaveClass('text-primary')
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
