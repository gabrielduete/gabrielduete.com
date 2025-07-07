import { fireEvent, render, screen } from '@testing-library/react'

import ScrollTopButton from '.'

describe('<ScrollTopButton />', () => {
  it('should not render the button when the page is initially loaded', () => {
    render(<ScrollTopButton />)

    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })

  it('should render the button when scrolled past 800px', () => {
    render(<ScrollTopButton />)

    fireEvent.scroll(window, { target: { scrollY: 801 } })

    const button = screen.getByRole('button', { hidden: true })
    expect(button).toBeInTheDocument()
  })

  it('should hide the button when scrolled back above 800px', () => {
    render(<ScrollTopButton />)

    fireEvent.scroll(window, { target: { scrollY: 801 } })
    fireEvent.scroll(window, { target: { scrollY: 799 } })

    const button = screen.queryByRole('button')
    expect(button).not.toBeInTheDocument()
  })

  it('should scroll to the top of the page when the button is clicked', async () => {
    const scrollToMock = jest.fn()

    window.scrollTo = scrollToMock

    render(<ScrollTopButton />)

    fireEvent.scroll(window, { target: { scrollY: 801 } })

    const button = screen.getByRole('button', { hidden: true })
    fireEvent.click(button)

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
