import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import ToggleTheme from '.'

type ViewTransitionDocument = Omit<Document, 'startViewTransition'> & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> }
}

const viewTransitionDocument = document as unknown as ViewTransitionDocument

const mockMatchMedia = (matches: Record<string, boolean>) => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia
}

const enableViewTransition = () => {
  const startViewTransition = jest.fn((callback: () => void) => {
    callback()
    return { ready: Promise.resolve() }
  })

  viewTransitionDocument.startViewTransition = startViewTransition

  return startViewTransition
}

describe('<ToggleTheme />', () => {
  let animateMock: jest.Mock

  beforeEach(() => {
    localStorage.clear()
    delete document.body.dataset.theme
    mockMatchMedia({})

    animateMock = jest.fn()
    document.documentElement.animate =
      animateMock as unknown as Element['animate']
  })

  afterEach(() => {
    delete viewTransitionDocument.startViewTransition
  })

  it('falls back to the system theme when nothing is stored', () => {
    mockMatchMedia({ '(prefers-color-scheme: dark)': true })

    render(<ToggleTheme />)

    expect(document.body.dataset.theme).toBe('dark')
  })

  it('falls back to light when the system does not prefer dark', () => {
    render(<ToggleTheme />)

    expect(document.body.dataset.theme).toBe('light')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('restores the stored theme', () => {
    localStorage.setItem('theme', 'light')

    render(<ToggleTheme />)

    expect(document.body.dataset.theme).toBe('light')
  })

  it('applies the theme directly when view transitions are unavailable', () => {
    localStorage.setItem('theme', 'dark')

    render(<ToggleTheme />)
    fireEvent.click(screen.getByRole('button'))

    expect(document.body.dataset.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('toggles back to dark on a second click', () => {
    localStorage.setItem('theme', 'light')

    render(<ToggleTheme />)
    fireEvent.click(screen.getByRole('button'))

    expect(document.body.dataset.theme).toBe('dark')
  })

  it('skips the view transition when the user prefers reduced motion', () => {
    const startViewTransition = enableViewTransition()
    mockMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    localStorage.setItem('theme', 'dark')

    render(<ToggleTheme />)
    fireEvent.click(screen.getByRole('button'))

    expect(startViewTransition).not.toHaveBeenCalled()
    expect(document.body.dataset.theme).toBe('light')
  })

  it('expands a circle from the click position when view transitions run', async () => {
    const startViewTransition = enableViewTransition()
    localStorage.setItem('theme', 'dark')

    render(<ToggleTheme />)
    fireEvent.click(screen.getByRole('button'), { clientX: 10, clientY: 20 })

    expect(startViewTransition).toHaveBeenCalled()
    expect(document.body.dataset.theme).toBe('light')

    await waitFor(() => expect(animateMock).toHaveBeenCalled())

    const [keyframes, options] = animateMock.mock.calls[0]
    expect(keyframes.clipPath[0]).toBe('circle(0px at 10px 20px)')
    expect(keyframes.clipPath[1]).toMatch(/^circle\(\d/)
    expect(options).toEqual(
      expect.objectContaining({
        duration: 450,
        pseudoElement: '::view-transition-new(root)',
      }),
    )
  })

  it('toggles the theme with the Enter key', () => {
    localStorage.setItem('theme', 'dark')

    render(<ToggleTheme />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })

    expect(document.body.dataset.theme).toBe('light')
  })

  it('toggles the theme with the Space key', () => {
    localStorage.setItem('theme', 'dark')

    render(<ToggleTheme />)
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })

    expect(document.body.dataset.theme).toBe('light')
  })

  it('ignores any other key', () => {
    localStorage.setItem('theme', 'dark')

    render(<ToggleTheme />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'a' })

    expect(document.body.dataset.theme).toBe('dark')
  })

  it('falls back to the viewport corner when the toggle has no measurable box', async () => {
    enableViewTransition()
    localStorage.setItem('theme', 'dark')
    const rectSpy = jest
      .spyOn(Element.prototype, 'getBoundingClientRect')
      .mockReturnValue(undefined as unknown as DOMRect)

    render(<ToggleTheme />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })

    await waitFor(() => expect(animateMock).toHaveBeenCalled())

    const [keyframes] = animateMock.mock.calls[0]
    expect(keyframes.clipPath[0]).toBe(
      `circle(0px at ${window.innerWidth}px 0px)`,
    )

    rectSpy.mockRestore()
  })
})
