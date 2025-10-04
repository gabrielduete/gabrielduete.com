import { Locales } from '@/enums/Locales'
import { render } from '@testing-library/react'
import { useLocale } from 'next-intl'

import TabTitleWatcher from './TabTitleWatcher'

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}))

describe('TabTitleWatcher', () => {
  let mockSetInterval: jest.SpyInstance
  let mockClearInterval: jest.SpyInstance
  let mockAddEventListener: jest.SpyInstance
  let mockRemoveEventListener: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
    })

    Object.defineProperty(document, 'title', {
      value: '',
      writable: true,
    })

    mockSetInterval = jest
      .spyOn(global, 'setInterval')
      .mockImplementation(() => 123 as unknown as NodeJS.Timeout)
    mockClearInterval = jest
      .spyOn(global, 'clearInterval')
      .mockImplementation(() => {})

    mockAddEventListener = jest
      .spyOn(document, 'addEventListener')
      .mockImplementation(() => {})
    mockRemoveEventListener = jest
      .spyOn(document, 'removeEventListener')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    mockSetInterval.mockRestore()
    mockClearInterval.mockRestore()
    mockAddEventListener.mockRestore()
    mockRemoveEventListener.mockRestore()
  })

  it('renders without crashing', () => {
    ;(useLocale as jest.Mock).mockReturnValue(Locales.EN)

    render(<TabTitleWatcher originalTitle='Test Title' />)

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    )
  })

  it('sets title to English message when tab is hidden and locale is EN', () => {
    ;(useLocale as jest.Mock).mockReturnValue(Locales.EN)

    render(<TabTitleWatcher originalTitle='Test Title' />)

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    const visibilityHandler = mockAddEventListener.mock.calls[0][1]
    visibilityHandler()

    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 10000)

    const intervalCallback = mockSetInterval.mock.calls[0][0]
    intervalCallback()

    expect(document.title).toBe('Hey, is anyone there?')
  })

  it('sets title to Portuguese message when tab is hidden and locale is PT_BR', () => {
    ;(useLocale as jest.Mock).mockReturnValue(Locales.PT_BR)

    render(<TabTitleWatcher originalTitle='Test Title' />)

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    const visibilityHandler = mockAddEventListener.mock.calls[0][1]
    visibilityHandler()

    expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 10000)

    const intervalCallback = mockSetInterval.mock.calls[0][0]
    intervalCallback()

    expect(document.title).toBe('Opa, tem alguém aí?')
  })

  it('restores original title when tab becomes visible', () => {
    ;(useLocale as jest.Mock).mockReturnValue(Locales.EN)

    render(<TabTitleWatcher originalTitle='Test Title' />)

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    const visibilityHandler = mockAddEventListener.mock.calls[0][1]
    visibilityHandler()

    Object.defineProperty(document, 'hidden', { value: false, writable: true })
    visibilityHandler()

    expect(mockClearInterval).toHaveBeenCalled()
    expect(document.title).toBe('Test Title')
  })

  it('cleans up interval and event listener on unmount', () => {
    ;(useLocale as jest.Mock).mockReturnValue(Locales.EN)

    const { unmount } = render(<TabTitleWatcher originalTitle='Test Title' />)

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    const visibilityHandler = mockAddEventListener.mock.calls[0][1]
    visibilityHandler()

    unmount()

    expect(mockClearInterval).toHaveBeenCalled()
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      visibilityHandler,
    )
  })

  it('handles multiple visibility changes correctly', () => {
    ;(useLocale as jest.Mock).mockReturnValue(Locales.EN)

    render(<TabTitleWatcher originalTitle='Test Title' />)

    const visibilityHandler = mockAddEventListener.mock.calls[0][1]

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    visibilityHandler()
    expect(mockSetInterval).toHaveBeenCalledTimes(1)

    Object.defineProperty(document, 'hidden', { value: false, writable: true })
    visibilityHandler()
    expect(mockClearInterval).toHaveBeenCalledTimes(1)
    expect(document.title).toBe('Test Title')

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    visibilityHandler()
    expect(mockSetInterval).toHaveBeenCalledTimes(2)
  })
})
