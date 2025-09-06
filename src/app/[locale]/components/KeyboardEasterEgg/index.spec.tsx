import { fireEvent, render, screen } from '@testing-library/react'

import KeyBoardEasterEgg from '.'

Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn(),
})

const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

const consoleAcceptStyles = 'color: #46ce7a; font-size: 16px;'

const secretKeys = [
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'd',
  'a',
  'e',
  'ArrowUp',
  'ArrowRight',
  'r',
  'a',
  'g',
  'ArrowDown',
  'ArrowUp',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'g',
  'o',
  'n',
]

describe('<KeyBoardEasterEgg />', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.clearAllMocks()
  })

  afterEach(() => {
    document.removeEventListener('keydown', jest.fn())
  })

  it('should render the component with correct attributes', () => {
    render(<KeyBoardEasterEgg />)

    const element = screen.getByLabelText('Easter egg sequence hint')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass(
      'fixed',
      'text-secondary',
      'bottom-0',
      'right-0',
      'z-50',
      'opacity-0',
      'hover:opacity-100',
      'transition-opacity',
      'duration-300',
      'cursor-default',
      'text-small',
    )
    expect(element).toHaveTextContent('← ↑ ↓ d a e ↑ → r a g ↓ ↑ → ← → g o n')
  })

  it('should add keydown event listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

    render(<KeyBoardEasterEgg />)

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    )
  })

  it('should remove keydown event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener')

    const { unmount } = render(<KeyBoardEasterEgg />)
    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    )
  })

  it('should progress through correct key sequence', () => {
    render(<KeyBoardEasterEgg />)

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cArrowLeft 🎉',
      consoleAcceptStyles,
    )

    fireEvent.keyDown(document, { key: 'ArrowUp' })
    expect(consoleSpy).toHaveBeenCalledWith('%cArrowUp 🎉', consoleAcceptStyles)
  })

  it('should reset sequence on wrong key', () => {
    render(<KeyBoardEasterEgg />)

    // Start sequence
    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cArrowLeft 🎉',
      consoleAcceptStyles,
    )

    // Wrong key
    fireEvent.keyDown(document, { key: 'x' })
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cx ❌',
      'color: #ff4d4d; font-size: 16px;',
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cTry again! 🔄',
      'font-size: 16px;',
    )

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cArrowLeft 🎉',
      consoleAcceptStyles,
    )
  })

  it('should handle first key correctly when sequence is reset', () => {
    render(<KeyBoardEasterEgg />)

    fireEvent.keyDown(document, { key: 'x' })
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cx ❌',
      'color: #ff4d4d; font-size: 16px;',
    )

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(consoleSpy).toHaveBeenCalledWith(
      '%cArrowLeft 🎉',
      consoleAcceptStyles,
    )
  })

  it('should trigger easter egg when complete sequence is entered', () => {
    const createElementSpy = jest.spyOn(document, 'createElement')
    const appendChildSpy = jest.spyOn(document.body, 'appendChild')

    render(<KeyBoardEasterEgg />)

    // Enter complete sequence
    secretKeys.forEach(key => {
      fireEvent.keyDown(document, { key })
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      '%c🎉 EASTER EGG!!!!',
      'color: #46ce7a; font-size: 20px;',
    )
    expect(createElementSpy).toHaveBeenCalledWith('div')
    expect(appendChildSpy).toHaveBeenCalled()
  })

  it('should create flash element with correct styles', () => {
    render(<KeyBoardEasterEgg />)

    secretKeys.forEach(key => {
      fireEvent.keyDown(document, { key })
    })

    const flashElement = document.querySelector('div[style*="position: fixed"]')

    expect(flashElement).toBeInTheDocument()
    expect(flashElement).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.05s',
      pointerEvents: 'none',
    })
  })

  it('should call navigator.vibrate when available', () => {
    render(<KeyBoardEasterEgg />)

    secretKeys.forEach(key => {
      fireEvent.keyDown(document, { key })
    })

    expect(navigator.vibrate).toHaveBeenCalledWith([
      100, 50, 100, 50, 100, 50, 100,
    ])
  })

  it('should clean up flash element after animation', done => {
    render(<KeyBoardEasterEgg />)

    secretKeys.forEach(key => {
      fireEvent.keyDown(document, { key })
    })

    setTimeout(() => {
      const flashElement = document.querySelector(
        'div[style*="position: fixed"]',
      )
      expect(flashElement).not.toBeInTheDocument()
      done()
    }, 2500)
  })
})
