import { Storages } from '@/enums/Storages'
import { fireEvent, render, screen } from '@testing-library/react'

import BackButton from '.'

const routerBackMock = jest.fn()
const routerPushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: routerBackMock,
    push: routerPushMock,
  }),
}))

describe('<BackButton />', () => {
  afterEach(() => {
    routerBackMock.mockClear()
    routerPushMock.mockClear()
    sessionStorage.clear()
  })

  it('should navigate back if `canGoBack` is true', () => {
    sessionStorage.setItem(Storages.CAME_FROM_NAVIGATION, 'true')
    Object.defineProperty(window, 'history', {
      value: { length: 2 },
    })

    render(<BackButton path='/home' />)

    fireEvent.click(screen.getByRole('button'))
    expect(routerBackMock).toHaveBeenCalled()
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  it('should navigate to the provided path if `canGoBack` is false', () => {
    sessionStorage.setItem('CAME_FROM_NAVIGATION', 'false')
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
    })

    render(<BackButton path='/home' />)

    fireEvent.click(screen.getByRole('button'))
    expect(routerPushMock).toHaveBeenCalledWith('/home')
    expect(routerBackMock).not.toHaveBeenCalled()
  })

  it('should set `CAME_FROM_NAVIGATION` in sessionStorage on mount', () => {
    sessionStorage.setItem(Storages.CAME_FROM_NAVIGATION, 'false')

    render(<BackButton path='/home' />)

    expect(sessionStorage.getItem(Storages.CAME_FROM_NAVIGATION)).toBe('true')
  })
})
